import * as styles from './PairButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { BasePair } from '@rnacanvas/base-pairs.oopified';

import { KeyBinding } from '@rnacanvas/utilities';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

export class PairButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['pair-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '-4 0 22 22');
    icon.setAttribute('width', '22');
    icon.setAttribute('height', '22');

    icon.innerHTML = `
      <path
        d="M 0.5 0 V 22 M 0 3 H 8 M 0 11 H 8 M 0 19 H 8 M 13.5 0 V 22 M 14 7 h -8 M 14 15 h -8"
        stroke="white" stroke-width="1" fill="none"
      ></path>
    `;

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.addEventListener('click', event => this.#press(event));
    this.#button.domNode.style.padding = '4px 6px';
    this.domNode.append(this.#button.domNode);

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 12;

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    [
      undefined,
      { shiftKey: true },
      { altKey: true },
      { altKey: true, shiftKey: true },
    ].forEach(options => this.#keyBindings.push(new KeyBinding('P', () => this.#press(options), options)));

    // special macOS key bindings (since the Option key can change the key itself)
    ([
      ['π', { altKey: true }],
      ['∏', { altKey: true, shiftKey: true }],
    ] as const).forEach(([key, options]) => this.#keyBindings.push(new KeyBinding(key, () => this.#press(options), options)));

    this.#keyBindings.forEach(kb => kb.owner = this.domNode);

    targetApp.selectedBases.addEventListener('change', () => this.#refresh());

    this.#refresh();
  }

  #disable(): void {
    this.#button.disable();

    this.#button.domNode.classList.remove(styles['clickable']);
    this.#button.domNode.classList.add(styles['draggable']);
  }

  #enable(): void {
    this.#button.enable();

    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.classList.remove(styles['draggable']);
  }

  isDisabled(): boolean {
    return this.#button.isDisabled();
  }

  #updateTooltipText(): void {
    let ShiftP = detectMacOS() ? '⇧ P' : 'Shift+P';

    let AltP = detectMacOS() ? '⌥ P' : 'Alt+P';

    let ShiftAltP = detectMacOS() ? '⇧ ⌥ P' : 'Shift+Alt+P';

    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length == 0) {
      this.#tooltip.textContent = 'No bases are selected.';
    }

    if (selectedBases.length == 1) {
      this.#tooltip.textContent = 'At least two bases must be selected.';
    }

    if (selectedBases.length >= 2) {
      this.#tooltip.textContent = (
        `Pair with secondary bonds. [ ${ShiftP} ]\n`
        + 'Only add missing secondary bonds. [ P ]\n'
        + `Pair with tertiary bonds. [ ${ShiftAltP} ]\n`
        + `Only add missing tertiary bonds. [ ${AltP} ]`
      );
    }
  }

  #refresh(): void {
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length < 2) {
      this.#disable();
    } else {
      this.#enable();
    }

    this.#updateTooltipText();
  }

  #press(options?: { altKey?: boolean, shiftKey?: boolean }) {
    if (this.isDisabled()) {
      return;
    }

    let allBases = [...this.#targetApp.drawing.bases];

    let selectedBases = [...this.#targetApp.selectedBases];

    // don't forget to sort!
    selectedBases = seqSorted(selectedBases, allBases);

    if (selectedBases.length < 2) {
      return;
    }

    let pairs = antiParallelPairs(selectedBases);

    let bonds = options?.altKey ? [...this.#targetApp.drawing.tertiaryBonds] : [...this.#targetApp.drawing.secondaryBonds];

    let alreadyPaired = pairs.filter(pr => bonds.some(bond => pr.includesBoth(bond.base1, bond.base2)));

    let notAlreadyPaired = pairs.filter(pr => !alreadyPaired.includes(pr));

    if (alreadyPaired.length == pairs.length && !options?.shiftKey) {
      return;
    }

    this.#targetApp.pushUndoStack();

    let addBond = options?.altKey ? 'addTertiaryBond' as const : 'addSecondaryBond' as const;

    if (options?.shiftKey) {
      pairs.forEach(pr => this.#targetApp.drawing[addBond](pr[0], pr[1]));
    } else {
      notAlreadyPaired.forEach(pr => this.#targetApp.drawing[addBond](pr[0], pr[1]));
    }
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}

function seqSorted<B extends Nucleobase>(bases: B[], parentSeq: B[]): B[] {
  let basesSet = new Set(bases);

  let sorted: B[] = [];

  parentSeq.forEach(b => basesSet.has(b) ? sorted.push(b) : {});

  return sorted;
}

function antiParallelPairs<B extends Nucleobase>(bases: B[]): BasePair<B>[] {
  let pairs: [B, B][] = [];

  for (let p = 1; p <= bases.length / 2; p++) {
    let q = bases.length - p + 1;
    pairs.push([bases[p - 1], bases[q - 1]]);
  }

  return pairs.map(pr => new BasePair(...pr));
}

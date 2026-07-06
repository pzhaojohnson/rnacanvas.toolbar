import * as styles from './UnpairButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import type { SecondaryBond } from './SecondaryBond';

import type { TertiaryBond } from './TertiaryBond';

import { KeyBinding } from '@rnacanvas/utilities';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

export class UnpairButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  #drawingObserver;

  constructor(targetApp: App) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['unpair-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '-7 0 22 22');
    icon.setAttribute('width', '22');
    icon.setAttribute('height', '22');

    icon.innerHTML = `
      <path
        d="M 0.5 0 V 22 M 0 3 H 8 M 0 11 H 8 M 0 19 H 8"
        stroke="white" stroke-width="1" fill="none"
      ></path>
    `;

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.padding = '4px 6px';
    this.domNode.append(this.#button.domNode);

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 12;

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    [
      undefined,
      { altKey: true },
    ].forEach(options => this.#keyBindings.push(new KeyBinding('U', () => this.press(options), options)));

    // special macOS key binding (since the Option key can change the key itself)
    ([
      ['Dead', { altKey: true }],
    ] as const).forEach(([key, options]) => this.#keyBindings.push(new KeyBinding(key, () => this.press(options), options)));

    this.#keyBindings.forEach(kb => kb.owner = this.domNode);

    targetApp.selectedBases.addEventListener('change', () => this.#refresh());

    this.#drawingObserver = new MutationObserver(() => this.#refresh());
    this.#drawingObserver.observe(targetApp.drawing.domNode, { childList: true, subtree: true });

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
    let selectedBases = new Set(this.#targetApp.selectedBases);

    if (selectedBases.size == 0) {
      this.#tooltip.textContent = 'No bases are selected.';
      return;
    }

    let secondaryBonds = new Bonds([...this.#targetApp.drawing.secondaryBonds]);

    let tertiaryBonds = new Bonds([...this.#targetApp.drawing.tertiaryBonds]);

    let AltU = detectMacOS() ? '⌥ U' : 'Alt+U';

    if (secondaryBonds.bindAny(selectedBases)) {
      this.#tooltip.addLine('Remove attached secondary bonds. [ U ]');
    }

    if (tertiaryBonds.bindAny(selectedBases)) {
      this.#tooltip.addLine(`Remove attached tertiary bonds. [ ${AltU} ]`);
    }

    if (!secondaryBonds.bindAny(selectedBases) && !tertiaryBonds.bindAny(selectedBases)) {
      this.#tooltip.textContent = 'The selected bases are already unpaired.';
    }
  }

  #refresh(): void {
    let selectedBases = new Set(this.#targetApp.selectedBases);

    if (selectedBases.size == 0) {
      this.#disable();
    }

    let secondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    if (secondaryBonds.some(sb => selectedBases.has(sb.base1) || selectedBases.has(sb.base2))) {
      this.#enable();
    } else {
      this.#disable();
    }

    this.#updateTooltipText();
  }

  press(options?: { altKey?: boolean }) {
    if (this.isDisabled()) {
      return;
    }

    let selectedBases = new Set(this.#targetApp.selectedBases);

    if (selectedBases.size == 0) {
      return;
    }

    let bondType = options?.altKey ? 'tertiaryBonds' as const : 'secondaryBonds' as const;

    let bonds = new Bonds([...this.#targetApp.drawing[bondType]]);

    if (!bonds.bindAny(selectedBases)) {
      return;
    }

    this.#targetApp.pushUndoStack();

    [...bonds]
      .filter(bond => bond.bindsAny(selectedBases))
      .forEach(bond => bond.remove());
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}

type Bond = SecondaryBond | TertiaryBond;

class Bond_ {
  readonly #bond;

  constructor(bond: Bond) {
    this.#bond = bond;
  }

  /**
   * The bases in the bond.
   */
  get bases() {
    return [this.#bond.base1, this.#bond.base2];
  }

  binds(b: Nucleobase): boolean {
    return this.bases.includes(b);
  }

  bindsAny(bases: Set<Nucleobase>): boolean {
    return this.bases.some(b => bases.has(b));
  }

  remove() {
    this.#bond.remove();
  }
}

class Bonds {
  readonly #bonds;

  constructor(bonds: Bond[]) {
    this.#bonds = bonds.map(bond => new Bond_(bond));
  }

  [Symbol.iterator]() {
    return this.#bonds.values();
  }

  bindAny(bases: Set<Nucleobase>): boolean {
    return this.#bonds.some(bond => bond.bindsAny(bases));
  }
}

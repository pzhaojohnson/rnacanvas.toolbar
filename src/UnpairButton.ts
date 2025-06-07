import * as styles from './UnpairButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { Tooltip } from '@rnacanvas/tooltips';

import { KeyBinding } from '@rnacanvas/utilities';

export class UnpairButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  #drawingObserver;

  constructor(targetApp: App<B, F>) {
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

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#keyBindings.push(new KeyBinding('U', () => this.press()));

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

    let secondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    if (secondaryBonds.some(sb => selectedBases.has(sb.base1) || selectedBases.has(sb.base2))) {
      let s = selectedBases.size == 1 ? '' : 's';
      this.#tooltip.textContent = `Unpair the selected base${s}. [ U ]`;
    } else {
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

  press() {
    if (this.isDisabled()) {
      return;
    }

    let selectedBases = new Set(this.#targetApp.selectedBases);

    if (selectedBases.size == 0) {
      return;
    }

    let secondaryBonds = [...this.#targetApp.drawing.secondaryBonds];

    if (!secondaryBonds.some(sb => selectedBases.has(sb.base1) || selectedBases.has(sb.base2))) {
      return;
    }

    this.#targetApp.pushUndoStack();

    secondaryBonds
      .filter(sb => selectedBases.has(sb.base1) || selectedBases.has(sb.base2))
      .forEach(sb => sb.remove());
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}

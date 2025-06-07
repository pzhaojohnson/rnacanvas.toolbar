import * as styles from './SelectInterveningButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { min, max } from '@rnacanvas/math';

import { KeyBinding } from '@rnacanvas/utilities';

import { Tooltip } from '@rnacanvas/tooltips';

export class SelectInterveningButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['select-intervening-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    let iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('d', 'M 8 20 v -8 h -4 l 8 -8 l 8 8 h -4 v 8 z');
    iconPath.setAttribute('stroke', 'white');
    iconPath.setAttribute('stroke-width', '1');
    iconPath.setAttribute('fill', 'none');
    icon.append(iconPath);

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.padding = '4px 6px';
    this.domNode.append(this.#button.domNode);

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 12;

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    // make sure not to interfere with the Ctrl+Shift+I key binding to open web browser dev tools on Windows and Linux
    this.#keyBindings.push(new KeyBinding('I', () => this.press(), { ctrlKey: false }));
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
    let boundKey = '[ I ]';

    let allBases = [...this.#targetApp.drawing.bases];
    let selectedBases = [...this.#targetApp.selectedBases];

    let selectedBaseIndices = selectedBases.map(b => allBases.indexOf(b));

    let minSelectedBaseIndex = min(selectedBaseIndices);
    let maxSelectedBaseIndex = max(selectedBaseIndices);

    if (selectedBases.length == 0) {
      this.#tooltip.textContent = 'No bases are selected.';
      this.#tooltip.pointerDisplacement = 0;
    } else if (selectedBases.length == 1) {
      this.#tooltip.textContent = 'At least two bases must be selected.';
      this.#tooltip.pointerDisplacement = -68;
    } else if (maxSelectedBaseIndex - minSelectedBaseIndex + 1 == selectedBases.length) {
      this.#tooltip.textContent = 'There are no intervening bases to select.';
      this.#tooltip.pointerDisplacement = -91;
    } else {
      this.#tooltip.textContent = `Select intervening bases between those already selected. The Shift key can also be held while dragging-to-select bases. ${boundKey}`;
      this.#tooltip.pointerDisplacement = -523;
    }
  }

  #refresh(): void {
    let allBases = [...this.#targetApp.drawing.bases];
    let selectedBases = [...this.#targetApp.selectedBases];

    let selectedBaseIndices = selectedBases.map(b => allBases.indexOf(b));

    let minSelectedBaseIndex = min(selectedBaseIndices);
    let maxSelectedBaseIndex = max(selectedBaseIndices);

    if (selectedBases.length == 0) {
      this.#disable();
    } else if (selectedBases.length == 1) {
      this.#disable();
    } else if (maxSelectedBaseIndex - minSelectedBaseIndex + 1 == selectedBases.length) {
      this.#disable();
    } else {
      this.#enable();
    }

    this.#updateTooltipText();
  }

  press() {
    if (this.isDisabled()) {
      return;
    }

    let allBases = [...this.#targetApp.drawing.bases];
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length < 2) {
      return;
    }

    let selectedBaseIndices = selectedBases.map(b => allBases.indexOf(b));

    let basesToSelect = allBases.slice(min(selectedBaseIndices), max(selectedBaseIndices) + 1);

    this.#targetApp.selectedBases.addAll(basesToSelect);
  }

  get keyBindings(): Iterable<{ owner: Element | undefined }> {
    return [...this.#keyBindings];
  }
}

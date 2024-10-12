import * as styles from './SelectInterveningButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { min, max } from '@rnacanvas/math';

export class SelectInterveningButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip;

  #targetApp;

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
    this.#button.domNode.classList.add(styles['button'], styles['clickable']);
    this.#button.domNode.addEventListener('click', () => this.#handleClick());
    this.domNode.append(this.#button.domNode);

    this.#tooltip = new Tooltip();
    this.domNode.append(this.#tooltip.domNode);

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

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
    let allBases = [...this.#targetApp.drawing.bases];
    let selectedBases = [...this.#targetApp.selectedBases];

    let selectedBaseIndices = selectedBases.map(b => allBases.indexOf(b));

    let minSelectedBaseIndex = min(selectedBaseIndices);
    let maxSelectedBaseIndex = max(selectedBaseIndices);

    if (selectedBases.length == 0) {
      this.#tooltip.textContent = 'No bases are selected.';
    } else if (selectedBases.length == 1) {
      this.#tooltip.textContent = 'At least two bases must be selected.';
    } else if (maxSelectedBaseIndex - minSelectedBaseIndex + 1 == selectedBases.length) {
      this.#tooltip.textContent = 'There are no intervening bases to select.';
    } else {
      this.#tooltip.textContent = 'Select intervening bases between those already selected. The Shift key can also be held while dragging-to-select bases.';
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

  #handleClick() {
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
}

class Tooltip {
  readonly domNode = document.createElement('div');

  #p;

  constructor() {
    this.#p = document.createElement('p');
    this.#p.classList.add(styles['tooltip-text']);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode.classList.add(styles['tooltip']);
    this.domNode.append(textContainer);
  }

  get textContent() {
    return this.#p.textContent;
  }

  set textContent(textContent) {
    this.#p.textContent = textContent;
  }
}

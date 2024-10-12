import * as styles from './ShiftButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { shift } from '@rnacanvas/bases-layout';

import { detectMac } from '@rnacanvas/utilities';

export class ShiftButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip;

  #targetApp;

  #isActive = false;

  #shifted = false;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['shift-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    let iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('d', 'M 12 12 v 7 h -3 l 3 3 l 3 -3 h -3 v -7 v -7 h -3 l 3 -3 l 3 3 h -3 v 7 h -7 v 3 l -3 -3 l 3 -3 v 3 h 7 h 7 v -3 l 3 3 l -3 3 v -3 h -7 z');
    iconPath.setAttribute('stroke', 'white');
    iconPath.setAttribute('stroke-width', '1');
    iconPath.setAttribute('fill', 'white');
    icon.append(iconPath);

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['button'], styles['draggable']);
    this.domNode.append(this.#button.domNode);

    this.#button.domNode.addEventListener('mousedown', event => this.#handleMouseDown(event));
    window.addEventListener('mousemove', event => this.#handleMouseMove(event));
    window.addEventListener('mouseup', () => this.#handleMouseUp());

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#tooltip = new Tooltip();
    this.domNode.append(this.#tooltip.domNode);

    targetApp.selectedBases.addEventListener('change', () => this.#refresh());

    this.#refresh();
  }

  #disable(): void {
    this.#button.disable();
  }

  #enable(): void {
    this.#button.enable();
  }

  isDisabled(): boolean {
    return this.#button.isDisabled();
  }

  #refresh(): void {
    let numSelectedBases = [...this.#targetApp.selectedBases].length;

    if (numSelectedBases == 0) {
      this.#disable();
      this.#tooltip.textContent = 'No bases are selected.';
    } else {
      this.#enable();
      this.#tooltip.textContent = this.#tooltip.enabledTextContent;
    }
  }

  #handleMouseDown(event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (event.button != 0) {
      return;
    } else if (detectMac() && event.ctrlKey) {
      return;
    }

    this.#isActive = true;
    this.#shifted = false;
  }

  #handleMouseMove(event: MouseEvent): void {
    if (!this.#isActive) {
      return;
    }

    let horizontalClientScaling = this.#targetApp.drawing.horizontalClientScaling;
    let verticalClientScaling = this.#targetApp.drawing.verticalClientScaling;

    if (!Number.isFinite(horizontalClientScaling)) { horizontalClientScaling = 1; }
    if (!Number.isFinite(verticalClientScaling)) { verticalClientScaling = 1; }

    if (!this.#shifted) {
      this.#targetApp.beforeDragging();
    }

    shift([...this.#targetApp.selectedBases], {
      x: event.movementX / horizontalClientScaling,
      y: event.movementY / verticalClientScaling,
    });

    this.#shifted = true;
  }

  #handleMouseUp(): void {
    this.#isActive = false;

    if (this.#shifted) {
      this.#targetApp.afterDragging();
    }
  }
}

class Tooltip {
  readonly domNode;

  #p;

  enabledTextContent = 'Shift bases.';

  constructor() {
    this.#p = document.createElement('p');
    this.#p.classList.add(styles['tooltip-text']);
    this.#p.textContent = this.enabledTextContent;

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode = document.createElement('div');
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

import * as styles from './ShiftButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from '@rnacanvas/bases-layout';

import { shift } from '@rnacanvas/bases-layout';

import { detectMac } from '@rnacanvas/utilities';

export class ShiftButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

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

    let button = ToolbarButton(icon);
    button.classList.add(styles['button']);
    this.domNode.append(button);

    button.addEventListener('mousedown', event => this.#handleMouseDown(event));
    window.addEventListener('mousemove', event => this.#handleMouseMove(event));
    window.addEventListener('mouseup', () => this.#handleMouseUp());

    this.domNode.style.borderRadius = button.style.borderRadius;

    this.domNode.append(Tooltip());
  }

  #handleMouseDown(event: MouseEvent): void {
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

function Tooltip() {
  let text = document.createElement('p');
  text.classList.add(styles['tooltip-text']);
  text.textContent = 'Drag bases.';

  let textContainer = document.createElement('div');
  textContainer.classList.add(styles['tooltip-text-container']);
  textContainer.append(text);

  let tooltip = document.createElement('div');
  tooltip.classList.add(styles['tooltip']);
  tooltip.append(textContainer);
  return tooltip;
}

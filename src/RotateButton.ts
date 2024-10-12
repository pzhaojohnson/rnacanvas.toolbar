import * as styles from './RotateButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { detectMac } from '@rnacanvas/utilities';

import { midpoint } from '@rnacanvas/points';

import { direction } from '@rnacanvas/points';

import { rotate } from '@rnacanvas/bases-layout';

export class RotateButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #targetApp;

  #isActive = false;

  /**
   * Whether or not bases have been rotated
   * since the rotate button last became active.
   */
  #rotated = false;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['rotate-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    icon.innerHTML = `
      <path
        d="M 18 18 A 6 6 0 1 1 6, 6"
        stroke="white" stroke-width="1" fill="none"
      ></path>
      <path
        d="M 6 18 A 6 6 0 1 1 18, 6"
        stroke="white"l stroke-width="1" fill="none"
      ></path>
      <path
        d="M 18 6 l 3 -3 v 6 h -6 z"
        stroke="white" stroke-width="1" fill="white"
      ></path>
    `;

    let button = new ToolbarButton(icon);
    button.domNode.classList.add(styles['button']);
    this.domNode.append(button.domNode);

    button.domNode.addEventListener('mousedown', event => this.#handleMouseDown(event));
    window.addEventListener('mousemove', event => this.#handleMouseMove(event));
    window.addEventListener('mouseup', () => this.#handleMouseUp());

    this.domNode.style.borderRadius = button.domNode.style.borderRadius;

    this.domNode.append(Tooltip());
  }

  #handleMouseDown(event: MouseEvent): void {
    if (event.button != 0) {
      return;
    } else if (detectMac() && event.ctrlKey) {
      return;
    }

    this.#isActive = true;
    this.#rotated = false;
  }

  #handleMouseMove(event: MouseEvent): void {
    if (!this.#isActive) {
      return;
    }

    let allBases = [...this.#targetApp.drawing.bases];

    let selectedBasesSet = new Set(this.#targetApp.selectedBases);

    // retrieve in sequence order
    let selectedBases = allBases.filter(b => selectedBasesSet.has(b));

    if (selectedBases.length < 2) {
      return;
    }

    let firstSelectedBase = selectedBases[0];
    let lastSelectedBase = selectedBases[selectedBases.length - 1];

    let pointOfRotation = midpoint(firstSelectedBase.clientCenterPoint, lastSelectedBase.clientCenterPoint);

    let currentPoint = { x: event.clientX, y: event.clientY };
    let previousPoint = { x: currentPoint.x - event.movementX, y: currentPoint.y - event.movementY };

    let currentDirection = direction(pointOfRotation, currentPoint);
    let previousDirection = direction(pointOfRotation, previousPoint);

    if (!this.#rotated) {
      this.#targetApp.beforeDragging();
    }

    rotate(selectedBases, currentDirection - previousDirection);

    this.#rotated = true;
  }

  #handleMouseUp(): void {
    this.#isActive = false;

    if (this.#rotated) {
      this.#targetApp.afterDragging();
    }
  }
}

function Tooltip() {
  let text = document.createElement('p');
  text.classList.add(styles['tooltip-text']);
  text.textContent = 'Rotate bases.';

  let textContainer = document.createElement('div');
  textContainer.classList.add(styles['tooltip-text-container']);
  textContainer.append(text);

  let tooltip = document.createElement('div');
  tooltip.classList.add(styles['tooltip']);
  tooltip.append(textContainer);
  return tooltip;
}

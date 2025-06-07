import * as styles from './RotateButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

import { midpoint } from '@rnacanvas/points';

import { direction } from '@rnacanvas/points';

export class RotateButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

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

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['button'], styles['draggable']);
    this.domNode.append(this.#button.domNode);

    this.#button.domNode.addEventListener('mousedown', event => this.#handleMouseDown(event));
    window.addEventListener('mousemove', event => this.#handleMouseMove(event));
    window.addEventListener('mouseup', () => this.#handleMouseUp());

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 12;

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

  #updateTooltipText(): void {
    let numSelectedBases = [...this.#targetApp.selectedBases].length;

    let Alt = detectMacOS() ? '⌥' : 'Alt';

    if (numSelectedBases == 0) {
      this.#tooltip.textContent = 'No bases are selected.';
    } else if (numSelectedBases == 1) {
      this.#tooltip.textContent = 'At least two bases must be selected.';
    } else {
      this.#tooltip.textContent = `Rotate bases. [ ${Alt} ←↑↓→ ]`;
    }
  }

  #refresh(): void {
    let numSelectedBases = [...this.#targetApp.selectedBases].length;

    if (numSelectedBases == 0) {
      this.#disable();
    } else if (numSelectedBases == 1) {
      this.#disable();
    } else {
      this.#enable();
    }

    this.#updateTooltipText();
  }

  #handleMouseDown(event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (event.button != 0) {
      return;
    } else if (detectMacOS() && event.ctrlKey) {
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

    this.#targetApp.drawing.rotate(selectedBases, currentDirection - previousDirection);

    this.#rotated = true;
  }

  #handleMouseUp(): void {
    this.#isActive = false;

    if (this.#rotated) {
      this.#targetApp.afterDragging();
    }
  }
}

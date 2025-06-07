import * as styles from './ShiftButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { shift } from '@rnacanvas/layout';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

export class ShiftButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip = new Tooltip('');

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

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 11;

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

    if (numSelectedBases == 0) {
      this.#tooltip.textContent = 'No bases are selected.';
    } else if (numSelectedBases == 1) {
      this.#tooltip.textContent = 'Shift base. [ ←↑↓→ ]';
    } else {
      this.#tooltip.textContent = 'Shift bases. [ ←↑↓→ ]';
    }
  }

  #refresh(): void {
    let numSelectedBases = [...this.#targetApp.selectedBases].length;

    if (numSelectedBases == 0) {
      this.#disable();
    } else if (numSelectedBases == 1) {
      this.#enable();
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

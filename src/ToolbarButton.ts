import * as styles from './ToolbarButton.css';

import { detectMacOS } from '@rnacanvas/utilities';

export class ToolbarButton {
  readonly domNode = document.createElement('div');

  constructor(content: string | SVGSVGElement) {
    this.domNode.classList.add(styles['toolbar-button'], styles['enabled']);

    this.domNode.append(content);

    // prevent dragging of the toolbar when the toolbar button is enabled and primary clicked
    this.domNode.addEventListener('mousedown', event => {
      if (this.isEnabled()) {
        isPrimaryMouseDown(event) ? event.stopPropagation() : {};
      }
    });
  }

  disable(): void {
    this.domNode.classList.remove(styles['enabled']);
  }

  enable(): void {
    this.domNode.classList.add(styles['enabled']);
  }

  isDisabled(): boolean {
    return !this.domNode.classList.contains(styles['enabled']);
  }

  isEnabled(): boolean {
    return !this.isDisabled();
  }
}

/**
 * Returns true if and only if the mouse event
 * is a mouse down event for a primary click sequence.
 */
function isPrimaryMouseDown(event: MouseEvent): boolean {
  if (event.type != 'mousedown') {
    return false;
  }

  if (detectMacOS()) {
    return event.button == 0 && !event.ctrlKey;
  } else {
    return event.button == 0;
  }
}

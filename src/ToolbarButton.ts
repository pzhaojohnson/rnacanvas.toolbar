import * as styles from './ToolbarButton.css';

import { detectMac } from '@rnacanvas/utilities';

export class ToolbarButton {
  readonly domNode = document.createElement('button');

  constructor(content: string | SVGSVGElement) {
    this.domNode.classList.add(styles.toolbarButton);

    this.domNode.append(content);

    // prevent dragging of the toolbar when toolbar buttons are clicked normally
    this.domNode.addEventListener('mousedown', event => {
      if (detectMac()) {
        event.button == 0 && !event.ctrlKey ? event.stopPropagation() : {};
      } else {
        event.button == 0 ? event.stopPropagation() : {};
      }
    });
  }
}

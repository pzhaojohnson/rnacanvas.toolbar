import * as styles from './ToolbarButton.css';

import { detectMac } from '@rnacanvas/utilities';

export function ToolbarButton(content: string | SVGSVGElement) {
  let toolbarButton = document.createElement('button');

  toolbarButton.classList.add(styles.toolbarButton);

  toolbarButton.append(content);

  // prevent dragging of the toolbar when toolbar buttons are clicked normally
  toolbarButton.addEventListener('mousedown', event => {
    if (detectMac()) {
      event.button == 0 && !event.ctrlKey ? event.stopPropagation() : {};
    } else {
      event.button == 0 ? event.stopPropagation() : {};
    }
  });

  return toolbarButton;
}

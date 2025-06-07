import * as styles from './GrabEtching.css';

import { Tooltip } from '@rnacanvas/tooltips';

import { detectMacOS } from '@rnacanvas/utilities';

export function GrabEtching() {
  let grabEtching = document.createElement('div');

  grabEtching.classList.add(styles['grab-etching']);

  grabEtching.append(
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
  );

  let secondaryClick = detectMacOS() ? 'Control-click' : 'Right-click'

  let tooltip = new Tooltip(`Anywhere along the Toolbar can be dragged. ${secondaryClick} when dragging to avoid pressing buttons.`);

  tooltip.owner = grabEtching;

  tooltip.pointerDisplacement = 225;

  return grabEtching;
}

function Line() {
  let line = document.createElement('div');

  line.classList.add(styles.line);

  return line;
}

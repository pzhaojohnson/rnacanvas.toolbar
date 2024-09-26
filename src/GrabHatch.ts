import * as styles from './GrabHatch.css';

import { detectMac } from '@rnacanvas/utilities';

export function GrabHatch() {
  let grabHatch = document.createElement('div');

  grabHatch.classList.add(styles.grabHatch);

  grabHatch.append(
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
    Line(),
  );

  grabHatch.append(Tooltip());

  return grabHatch;
}

function Line() {
  let line = document.createElement('div');

  line.classList.add(styles.line);

  return line;
}

let contextClick = detectMac() ? 'Ctrl-Click' : 'Right-click'

function Tooltip() {
  let tooltip = document.createElement('div');

  tooltip.classList.add(styles['tooltip']);

  let firstLine = document.createElement('p');
  firstLine.classList.add(styles['tooltip-text']);
  firstLine.textContent = 'Anywhere along the toolbar can be dragged.';
  tooltip.append(firstLine);

  let secondLine = document.createElement('p');
  secondLine.classList.add(styles['tooltip-text']);
  secondLine.textContent = `${contextClick} while dragging to avoid pressing buttons.`;
  tooltip.append(secondLine);

  return tooltip;
}

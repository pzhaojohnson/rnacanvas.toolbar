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

  let textContainer = document.createElement('div');
  textContainer.classList.add(styles['tooltip-text-container']);
  tooltip.append(textContainer);

  let firstSentence = 'Anywhere along the toolbar can be dragged.';

  let secondSentence = `${contextClick} while dragging to avoid pressing buttons.`;

  let text = document.createElement('p');
  text.classList.add(styles['tooltip-text']);
  text.textContent = `${firstSentence} ${secondSentence}`;
  textContainer.append(text);

  return tooltip;
}

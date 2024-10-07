import * as styles from './GrabEtching.css';

import { detectMac } from '@rnacanvas/utilities';

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

  grabEtching.append(Tooltip());

  return grabEtching;
}

function Line() {
  let line = document.createElement('div');

  line.classList.add(styles.line);

  return line;
}

let secondaryClick = detectMac() ? 'Control-click' : 'Right-click'

function Tooltip() {
  let tooltip = document.createElement('div');
  tooltip.classList.add(styles['tooltip']);
  tooltip.style.width = detectMac() ? '548px' : '533px';

  let textContainer = document.createElement('div');
  textContainer.classList.add(styles['tooltip-text-container']);
  tooltip.append(textContainer);

  let firstSentence = 'Anywhere along the toolbar can be dragged.';

  let secondSentence = `${secondaryClick} when dragging to avoid pressing buttons.`;

  let text = document.createElement('p');
  text.classList.add(styles['tooltip-text']);
  text.textContent = `${firstSentence} ${secondSentence}`;
  textContainer.append(text);

  return tooltip;
}

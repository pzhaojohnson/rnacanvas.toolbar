import * as styles from './SelectInterveningButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import { min, max } from '@rnacanvas/math';

export class SelectInterveningButton<B, F> {
  readonly domNode = document.createElement('div');

  #targetApp: App<B, F>;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['select-intervening-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    let iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('d', 'M 8 20 v -8 h -4 l 8 -8 l 8 8 h -4 v 8 z');
    iconPath.setAttribute('stroke', 'white');
    iconPath.setAttribute('stroke-width', '1');
    iconPath.setAttribute('fill', 'none');
    icon.append(iconPath);

    let button = ToolbarButton(icon);
    button.classList.add(styles['button']);
    button.addEventListener('click', () => this.#handleClick());
    this.domNode.append(button);

    this.domNode.append(Tooltip());
    this.domNode.style.borderRadius = button.style.borderRadius;
  }

  #handleClick() {
    let allBases = [...this.#targetApp.drawing.bases];
    let selectedBases = [...this.#targetApp.selectedBases];

    if (selectedBases.length < 2) {
      return;
    }

    let selectedBaseIndices = selectedBases.map(b => allBases.indexOf(b));

    let basesToSelect = allBases.slice(min(selectedBaseIndices), max(selectedBaseIndices) + 1);

    this.#targetApp.selectedBases.addAll(basesToSelect);
  }
}

function Tooltip() {
  let firstSentence = 'Select intervening bases between those already selected.';
  let secondSentence = 'The Shift key can also be held while dragging-to-select bases.';

  let text = document.createElement('p');
  text.classList.add(styles['tooltip-text']);
  text.textContent = `${firstSentence} ${secondSentence}`;

  let textContainer = document.createElement('div');
  textContainer.classList.add(styles['tooltip-text-container']);
  textContainer.append(text);

  let tooltip = document.createElement('div');
  tooltip.classList.add(styles['tooltip']);
  tooltip.append(textContainer);
  return tooltip;
}

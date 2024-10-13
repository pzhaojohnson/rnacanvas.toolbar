import * as styles from './LayoutButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

export class LayoutButton<B extends Nucleobase, F> {
  readonly domNode;

  #button;

  constructor(targetApp: App<B, F>) {
    this.#button = new ToolbarButton('Layout');
    this.#button.domNode.addEventListener('click', () => targetApp.openForm(targetApp.forms['layout']));
    this.#button.domNode.style.cursor = 'pointer';

    this.domNode = document.createElement('div');
    this.domNode.classList.add(styles['layout-button']);
    this.domNode.append(this.#button.domNode, Tooltip());

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;
  }
}

function Tooltip() {
  let text = document.createElement('p');
  text.classList.add(styles['tooltip-text']);
  text.textContent = 'Open the Layout form.';

  let textContainer = document.createElement('div');
  textContainer.classList.add(styles['tooltip-text-container']);
  textContainer.append(text);

  let tooltip = document.createElement('div');
  tooltip.classList.add(styles['tooltip']);
  tooltip.append(textContainer);
  return tooltip;
}

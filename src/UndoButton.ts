import * as styles from './UndoButton.css';

import { ToolbarButton } from './ToolbarButton';

import type { App } from './App';

import type { Nucleobase } from './Nucleobase';

import { KeyBinding } from '@rnacanvas/utilities';

import { detectMac } from '@rnacanvas/utilities';

export class UndoButton<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #button;

  #tooltip;

  #targetApp;

  #keyBindings: KeyBinding[] = [];

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['undo-button']);

    let icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');

    icon.innerHTML = `
      <path
        d="M 10 18 H 16 A 6 6 0 1 0 16 6 h -10"
        stroke="white" stroke-width="1" fill="none"
      ></path>
      <path
        d="M 6 6 v -4 l -4 4 l 4 4 v -4 z"
        stroke="white" stroke-width="1" fill="white"
      ></path>
    `;

    this.#button = new ToolbarButton(icon);
    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.addEventListener('click', () => this.press());
    this.#button.domNode.style.padding = '4px 6px';
    this.domNode.append(this.#button.domNode);

    this.#tooltip = new Tooltip();
    this.domNode.append(this.#tooltip.domNode);

    this.domNode.style.borderRadius = this.#button.domNode.style.borderRadius;

    this.#keyBindings.push(new KeyBinding('Z', () => this.press(), { ctrlKey: true, shiftKey: false }));
    this.#keyBindings.push(new KeyBinding('Z', () => this.press(), { metaKey: true, shiftKey: false }));

    this.#keyBindings.forEach(kb => kb.scope = this.domNode);

    targetApp.undoStack.addEventListener('change', () => this.#refresh());

    this.#refresh();
  }

  #disable(): void {
    this.#button.disable();

    this.#button.domNode.classList.remove(styles['clickable']);
    this.#button.domNode.classList.add(styles['draggable']);
  }

  #enable(): void {
    this.#button.enable();

    this.#button.domNode.classList.add(styles['clickable']);
    this.#button.domNode.classList.remove(styles['draggable']);
  }

  isDisabled(): boolean {
    return this.#button.isDisabled();
  }

  #updateTooltipText(): void {
    let boundKey = detectMac() ? '[ ⌘ Z ]' : '[ Ctrl+Z ]';

    if (this.#targetApp.undoStack.isEmpty()) {
      this.#tooltip.textContent = `Can't undo.`;
    } else {
      this.#tooltip.textContent = `Undo. ${boundKey}`;
    }
  }

  #refresh(): void {
    this.#targetApp.undoStack.isEmpty() ? this.#disable() : this.#enable();

    this.#updateTooltipText();
  }

  press() {
    if (this.isDisabled()) {
      return;
    }

    if (!this.#targetApp.undoStack.isEmpty()) {
      this.#targetApp.undo();
    }
  }

  get keyBindings(): Iterable<{ scope: Element | undefined }> {
    return [...this.keyBindings];
  }
}

class Tooltip {
  readonly domNode = document.createElement('div');

  #p;

  constructor() {
    this.#p = document.createElement('p');
    this.#p.classList.add(styles['tooltip-text']);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode.classList.add(styles['tooltip']);
    this.domNode.append(textContainer);
  }

  get textContent() {
    return this.#p.textContent;
  }

  set textContent(textContent) {
    this.#p.textContent = textContent;
  }
}

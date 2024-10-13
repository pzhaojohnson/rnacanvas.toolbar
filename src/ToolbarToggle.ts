import * as styles from './ToolbarToggle.css';

import * as SVG from '@svgdotjs/svg.js';

import type { Toolbar } from './Toolbar';

import type { Nucleobase } from './Nucleobase';

/**
 * A button to reposition and hide/unhide the toolbar.
 */
export class ToolbarToggle<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #tooltip;

  #targetApp: App<B, F>;

  constructor(targetApp: App<B, F>) {
    this.#targetApp = targetApp;

    this.domNode.classList.add(styles['toolbar-toggle']);

    let svg = new SVG.Svg();

    svg.attr({ width: '30', height: '30' });

    svg.viewbox(0, 0, 30, 30);

    let whiteCircle = svg.circle();

    whiteCircle.attr({
      'r': '4',
      'cx': '15',
      'cy': '15',
      'stroke': 'white',
      'stroke-width': '0',
      'fill': 'white',
    });

    svg.attr('style', 'user-select: none; -webkit-user-select: none;');

    svg.addTo(this.domNode);

    this.domNode.addEventListener('click', () => this.press());

    this.#tooltip = new Tooltip();
    this.domNode.append(this.#tooltip.domNode);

    this.domNode.addEventListener('mouseover', () => this.#refresh());

    this.#refresh();
  }

  press(): void {
    if (this.#targetApp.toolbar.isHidden()) {
      this.#targetApp.toolbar.unhide();
    } else if (this.#targetApp.toolbar.displacement.magnitude == 0) {
      this.#targetApp.toolbar.hide();
    } else {
      this.#targetApp.toolbar.reposition();
    }

    this.#refresh();
  }

  #refresh(): void {
    if (this.#targetApp.toolbar.isHidden()) {
      this.#tooltip.textContent = 'Unhide the Toolbar.';
    } else if (this.#targetApp.toolbar.displacement.magnitude == 0) {
      this.#tooltip.textContent = 'Hide the Toolbar.';
    } else {
      this.#tooltip.textContent = 'Reposition the Toolbar.';
    }
  }

  hide(): void {
    this.domNode.style.visibility = 'hidden';
  }

  unhide(): void {
    this.domNode.style.visibility = 'visible';
  }

  isHidden(): boolean {
    // keep in mind that an invalid visibility style value results in a visible element
    return ['hidden', 'collapse'].includes(this.domNode.style.visibility);
  }
}

interface App<B extends Nucleobase, F> {
  /**
   * The toolbar of the app.
   */
  readonly toolbar: Toolbar<B, F>;
}

class Tooltip {
  readonly domNode;

  #p;

  constructor() {
    this.#p = document.createElement('p');
    this.#p.classList.add(styles['tooltip-text']);

    let textContainer = document.createElement('div');
    textContainer.classList.add(styles['tooltip-text-container']);
    textContainer.append(this.#p);

    this.domNode = document.createElement('div');
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

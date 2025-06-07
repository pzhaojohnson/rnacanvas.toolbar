import * as styles from './ToolbarToggle.css';

import * as SVG from '@svgdotjs/svg.js';

import type { Toolbar } from './Toolbar';

import type { Nucleobase } from './Nucleobase';

import { Tooltip } from '@rnacanvas/tooltips';

/**
 * A button to reposition and hide/unhide the toolbar.
 */
export class ToolbarToggle<B extends Nucleobase, F> {
  readonly domNode = document.createElement('div');

  #tooltip = new Tooltip('');

  #boundKey?: string;

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

    this.#tooltip.owner = this.domNode;

    this.#tooltip.padding = 7;

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

  /**
   * The key that the toolbar toggle has been bound to.
   *
   * Is displayed in the tooltip for the toolbar toggle when set.
   */
  get boundKey() {
    return this.#boundKey;
  }

  set boundKey(boundKey) {
    this.#boundKey = boundKey;

    this.#refresh();
  }

  #refresh(): void {
    let boundKey = this.boundKey ? `[ ${this.boundKey} ]` : '';

    if (this.#targetApp.toolbar.isHidden()) {
      this.#tooltip.textContent = `Unhide the Toolbar. ${boundKey}`;
      this.#tooltip.pointerDisplacement = -127;
    } else if (this.#targetApp.toolbar.displacement.magnitude == 0) {
      this.#tooltip.textContent = `Hide the Toolbar. ${boundKey}`;
      this.#tooltip.pointerDisplacement = -113;
    } else {
      this.#tooltip.textContent = `Reposition the Toolbar. ${boundKey}`;
      this.#tooltip.pointerDisplacement = -144;
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

import * as styles from './ToolbarToggle.css';

import * as SVG from '@svgdotjs/svg.js';

import type { App } from './App';

/**
 * A button to reposition and hide/unhide the toolbar.
 */
export class ToolbarToggle<B, F> {
  readonly domNode = document.createElement('div');

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

    svg.addTo(this.domNode);

    this.domNode.addEventListener('click', () => this.press());
  }

  press(): void {
    if (this.#targetApp.toolbar.isHidden()) {
      this.#targetApp.toolbar.unhide();
    } else if (this.#targetApp.toolbar.displacement.magnitude == 0) {
      this.#targetApp.toolbar.hide();
    } else {
      this.#targetApp.toolbar.reposition();
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

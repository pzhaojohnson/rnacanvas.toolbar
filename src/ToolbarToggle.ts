import type { Toolbar } from './Toolbar';

import * as styles from './ToolbarToggle.css';

import * as SVG from '@svgdotjs/svg.js';

/**
 * A button to reposition and hide/unhide the toolbar of a target RNAcanvas app.
 */
export class ToolbarToggle {
  /**
   * The DOM node corresponding to the toolbar toggle.
   */
  readonly domNode = document.createElement('div');

  #targetApp: App;

  constructor(targetApp: App) {
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
    } else if (this.#targetApp.toolbar.displacementMagnitude == 0) {
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
    return (
      this.domNode.style.visibility != 'visible'
      && this.domNode.style.visibility.trim() != ''
    );
  }
}

/**
 * The app interface used by toolbar toggles.
 */
interface App {
  readonly toolbar: Toolbar;
}

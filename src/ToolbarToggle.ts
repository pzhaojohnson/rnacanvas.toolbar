import type { Toolbar } from './Toolbar';

import * as styles from './ToolbarToggle.css';

import * as SVG from '@svgdotjs/svg.js';

/**
 * A button to reposition the toolbar of the target app, for instance.
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

  /**
   * Appends the DOM node corresponding to the toolbar toggle
   * to the provided container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the DOM node corresponding to the toolbar toggle
   * from any parent container node that it is in.
   *
   * Has no effect if the toolbar toggle had no parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  press(): void {
    this.#targetApp.toolbar.reposition();
  }
}

/**
 * The app interface used by toolbar toggles.
 */
interface App {
  readonly toolbar: Toolbar;
}

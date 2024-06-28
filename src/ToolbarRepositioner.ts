import * as SVG from '@svgdotjs/svg.js';

import * as styles from './ToolbarRepositioner.css';

/**
 * Can be used as a button to bring the RNAcanvas toolbar
 * back to its original position (before any mouse dragging).
 */
export function ToolbarRepositioner() {
  let toolbarRepositioner = new SVG.Svg();

  toolbarRepositioner.addClass(styles.toolbarRepositioner);

  toolbarRepositioner.attr({ width: '32', height: '32' });

  toolbarRepositioner.viewbox(0, 0, 32, 32);

  let caret = toolbarRepositioner.path();

  caret.attr({
    'd': 'M 13 11 L 22 16 L 13 21 z',
    'stroke': 'white',
    'stroke-width': '0',
    'fill': 'white',
  });

  return toolbarRepositioner.node;
}

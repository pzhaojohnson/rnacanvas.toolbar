import * as SVG from '@svgdotjs/svg.js';

import * as styles from './ToolbarRepositioner.css';

/**
 * Can be used as a button to bring the RNAcanvas toolbar
 * back to its original position (before any mouse dragging).
 */
export function ToolbarRepositioner() {
  let toolbarRepositioner = new SVG.Svg();

  toolbarRepositioner.addClass(styles.toolbarRepositioner);

  toolbarRepositioner.attr({ width: '22', height: '22' });

  toolbarRepositioner.viewbox(0, 0, 10, 10);

  let caret = toolbarRepositioner.path();

  caret.attr({
    'd': 'M 3 6 L 5 4 L 7 6',
    'stroke': 'white',
    'stroke-width': '1',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'fill': 'none',
  });

  return toolbarRepositioner.node;
}

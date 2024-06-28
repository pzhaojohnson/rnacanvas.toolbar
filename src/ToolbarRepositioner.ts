import * as SVG from '@svgdotjs/svg.js';

import * as styles from './ToolbarRepositioner.css';

/**
 * Can be used as a button to bring the RNAcanvas toolbar
 * back to its original position (before any mouse dragging).
 */
export function ToolbarRepositioner() {
  let toolbarRepositioner = document.createElement('div');

  toolbarRepositioner.classList.add(styles.toolbarRepositioner);

  let caret = new SVG.Svg();

  caret.attr({ width: '32', height: '32' });

  caret.viewbox(0, 0, 32, 32);

  let caretPath = caret.path();

  caretPath.attr({
    'd': 'M 13 11 L 22 16 L 13 21 z',
    'stroke': 'white',
    'stroke-width': '0',
    'fill': 'white',
  });

  caret.addTo(toolbarRepositioner);

  return toolbarRepositioner;
}

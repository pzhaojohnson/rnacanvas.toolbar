import * as SVG from '@svgdotjs/svg.js';

import * as styles from './ToolbarRepositioner.css';

/**
 * Can be used as a button to bring the RNAcanvas toolbar
 * back to its original position (before any mouse dragging).
 */
export function ToolbarRepositioner() {
  let toolbarRepositioner = document.createElement('div');

  toolbarRepositioner.classList.add(styles.toolbarRepositioner);

  let triangle = new SVG.Svg();

  triangle.attr({ width: '32', height: '32' });

  triangle.viewbox(0, 0, 32, 32);

  let trianglePath = triangle.path();

  trianglePath.attr({
    'd': 'M 13 11 L 22 16 L 13 21 z',
    'stroke': 'rgb(231, 231, 242)',
    'stroke-width': '0',
    'fill': 'rgb(231, 231, 242)',
  });

  triangle.addTo(toolbarRepositioner);

  return toolbarRepositioner;
}

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

  triangle.attr({ width: '30', height: '30' });

  triangle.viewbox(0, 0, 30, 30);

  let trianglePath = triangle.path();

  trianglePath.attr({
    'd': 'M 12 10 L 21 15 L 12 20 z',
    'stroke': 'white',
    'stroke-width': '0',
    'fill': 'white',
  });

  triangle.addTo(toolbarRepositioner);

  return toolbarRepositioner;
}

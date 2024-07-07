import * as SVG from '@svgdotjs/svg.js';

import * as styles from './ToolbarRepositioner.css';

/**
 * Can be used as a button to bring the RNAcanvas toolbar
 * back to its original position (before any mouse dragging).
 */
export function ToolbarRepositioner() {
  let toolbarRepositioner = document.createElement('div');

  toolbarRepositioner.classList.add(styles.toolbarRepositioner);

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

  svg.addTo(toolbarRepositioner);

  return toolbarRepositioner;
}

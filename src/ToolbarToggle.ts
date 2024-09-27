import * as SVG from '@svgdotjs/svg.js';

import * as styles from './ToolbarToggle.css';

/**
 * Can be used as a button to bring the RNAcanvas toolbar
 * back to its original position (before any mouse dragging).
 */
export function ToolbarToggle() {
  let toolbarToggle = document.createElement('div');

  toolbarToggle.classList.add(styles['toolbar-toggle']);

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

  svg.addTo(toolbarToggle);

  return toolbarToggle;
}

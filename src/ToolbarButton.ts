import * as styles from './ToolbarButton.css';

export function ToolbarButton(content: string | SVGSVGElement) {
  let toolbarButton = document.createElement('button');

  toolbarButton.classList.add(styles.toolbarButton);

  toolbarButton.append(content);

  return toolbarButton;
}

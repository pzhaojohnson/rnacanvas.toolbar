import * as styles from './ToolbarButton.css';

export function ToolbarButton(name: string) {
  let toolbarButton = document.createElement('button');

  toolbarButton.classList.add(styles.toolbarButton);

  toolbarButton.append(name);

  return toolbarButton;
}

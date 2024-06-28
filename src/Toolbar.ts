import * as styles from './Toolbar.css';

import { GrabHatch } from './GrabHatch';

import { ToolbarButton } from './ToolbarButton';

import { DragTranslater } from '@rnacanvas/forms';

type Props = {
  editLayout: () => void;
};

/**
 * The RNAcanvas toolbar.
 *
 * Can be dragged around with the mouse.
 */
export class Toolbar {
  /**
   * The actual DOM node corresponding to the toolbar.
   */
  private readonly domNode = document.createElement('div');

  private readonly dragTranslater: DragTranslater;

  constructor(private props: Props) {
    this.domNode.classList.add(styles.toolbar);

    this.domNode.appendChild(GrabHatch());

    let layoutButton = ToolbarButton('Layout');
    layoutButton.addEventListener('click', () => this.props.editLayout());
    this.domNode.appendChild(layoutButton);

    this.dragTranslater = new DragTranslater(this.domNode);
  }

  /**
   * Appends the toolbar to the provided container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the toolbar from any parent container node that it is in.
   *
   * Has no effect if the toolbar did not have a parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  /**
   * Repositions the toolbar to its original position (before any mouse dragging).
   */
  reposition(): void {
    this.dragTranslater.untranslate();
  }
}

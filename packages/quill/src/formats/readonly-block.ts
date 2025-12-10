import { BlockEmbed } from '../blots/block.js';

class ReadOnlyBlock extends BlockEmbed {
  static blotName = 'readonly-block';
  static tagName = 'div';
  static className = 'ql-readonly-block';

  static create(value: string | { html: string }) {
    const node = super.create() as HTMLElement;
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-readonly', 'true');
    node.style.cssText = `
      user-select: none;
      cursor: default;
      margin-bottom: 1em;
    `;

    const html = typeof value === 'string' ? value : value.html;
    node.innerHTML = html;

    return node;
  }

  static value(domNode: HTMLElement) {
    return {
      html: domNode.innerHTML,
    };
  }

  length() {
    return 1;
  }

  // Prevent all editing operations
  deleteAt(index: number, length: number) {
    return;
  }

  formatAt(index: number, length: number, name: string, value: any) {
    return;
  }

  insertAt(index: number, value: string, def?: any) {
    return;
  }

  remove() {
    // Can only be removed programmatically
    super.remove();
  }
}

export default ReadOnlyBlock;

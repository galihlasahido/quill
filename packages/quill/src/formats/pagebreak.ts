import { BlockEmbed } from '../blots/block.js';

class PageBreak extends BlockEmbed {
  static blotName = 'pagebreak';
  static tagName = 'div';
  static className = 'ql-page-break';

  static create(value: any) {
    const node = super.create(value) as HTMLElement;
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('data-page-break', 'true');
    node.style.cssText = `
      height: 20px;
      background: transparent;
      margin: 0;
      padding: 0;
      position: relative;
      page-break-after: always;
      break-after: page;
      user-select: none;
      cursor: default;
    `;

    // Add visual separator line
    const line = document.createElement('div');
    line.style.cssText = `
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #cbd5e0 20%, #cbd5e0 80%, transparent 100%);
      transform: translateY(-50%);
      pointer-events: none;
    `;
    node.appendChild(line);

    return node;
  }

  static value(domNode: HTMLElement) {
    return true;
  }

  length() {
    return 1;
  }

  deleteAt(index: number, length: number) {
    // Prevent deletion
    return;
  }

  // Make it non-deletable via keyboard
  remove() {
    // Override to prevent removal
    return;
  }
}

export default PageBreak;

import Block from '../blots/block.js';
import Container from '../blots/container.js';
import type Scroll from '../blots/scroll.js';
import Quill from '../core/quill.js';

class ListContainer extends Container {
  static blotName = 'list-container';
  static tagName = 'OL';

  static create(value: string) {
    const node = super.create() as HTMLOListElement;
    const listStyle = value || 'decimal';

    // Map list types to CSS list-style-type
    const styleMap: Record<string, string> = {
      'ordered': 'decimal',
      'decimal': 'decimal',
      'roman': 'upper-roman',
      'roman-lower': 'lower-roman',
      'alpha': 'upper-alpha',
      'alpha-lower': 'lower-alpha',
      'bullet': 'disc',
      'checked': 'none',
      'unchecked': 'none'
    };

    const cssStyle = styleMap[listStyle] || 'decimal';
    node.style.listStyleType = cssStyle;
    node.setAttribute('data-list-style', listStyle);

    return node;
  }
}

class ListItem extends Block {
  static blotName = 'list';
  static tagName = 'LI';

  static create(value: string) {
    const node = super.create() as HTMLLIElement;
    const [listType, level = '1'] = value.split(':');

    node.setAttribute('data-list', listType);
    node.setAttribute('data-level', level);

    // Set indentation based on level
    const levelNum = parseInt(level, 10);
    if (levelNum > 1) {
      node.style.marginLeft = `${(levelNum - 1) * 2}em`;
    }

    return node;
  }

  static formats(domNode: HTMLLIElement) {
    const listType = domNode.getAttribute('data-list') || 'ordered';
    const level = domNode.getAttribute('data-level') || '1';
    return `${listType}:${level}`;
  }

  static register() {
    Quill.register(ListContainer);
  }

  constructor(scroll: Scroll, domNode: HTMLLIElement) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement('span');
    const listEventHandler = (e: Event) => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      const [listType] = format.split(':');

      if (listType === 'checked') {
        this.format('list', format.replace('checked', 'unchecked'));
        e.preventDefault();
      } else if (listType === 'unchecked') {
        this.format('list', format.replace('unchecked', 'checked'));
        e.preventDefault();
      }
    };
    ui.addEventListener('mousedown', listEventHandler);
    ui.addEventListener('touchstart', listEventHandler);
    this.attachUI(ui);
  }

  format(name: string, value: string) {
    if (name === this.statics.blotName && value) {
      const [listType, level = '1'] = value.split(':');
      this.domNode.setAttribute('data-list', listType);
      this.domNode.setAttribute('data-level', level);

      // Update indentation
      const levelNum = parseInt(level, 10);
      if (levelNum > 1) {
        this.domNode.style.marginLeft = `${(levelNum - 1) * 2}em`;
      } else {
        this.domNode.style.marginLeft = '';
      }
    } else {
      super.format(name, value);
    }
  }

  // Get current level
  getLevel(): number {
    const level = this.domNode.getAttribute('data-level');
    return level ? parseInt(level, 10) : 1;
  }

  // Increase indent level (Tab key)
  indent() {
    const currentFormat = this.statics.formats(this.domNode);
    const [listType, level = '1'] = currentFormat.split(':');
    const currentLevel = parseInt(level, 10);

    if (currentLevel < 3) {
      const newLevel = currentLevel + 1;
      this.format('list', `${listType}:${newLevel}`);
      return true;
    }
    return false;
  }

  // Decrease indent level (Shift+Tab)
  outdent() {
    const currentFormat = this.statics.formats(this.domNode);
    const [listType, level = '1'] = currentFormat.split(':');
    const currentLevel = parseInt(level, 10);

    if (currentLevel > 1) {
      const newLevel = currentLevel - 1;
      this.format('list', `${listType}:${newLevel}`);
      return true;
    }
    return false;
  }
}

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

export { ListContainer, ListItem as default };

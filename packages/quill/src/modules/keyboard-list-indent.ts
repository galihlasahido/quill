import type { Range } from '../core/selection.js';
import type { Context } from './keyboard.js';
import ListItem from '../formats/list-enhanced.js';

// Tab key handler for list indentation
export function handleTabIndent(
  this: { quill: any },
  range: Range,
  context: Context
): boolean {
  const line = context.line;

  if (line instanceof ListItem) {
    const success = line.indent();
    if (success) {
      this.quill.setSelection(range.index, 0);
      return false; // Prevent default tab behavior
    }
  }

  return true; // Allow default behavior if not in list
}

// Shift+Tab handler for list outdent
export function handleTabOutdent(
  this: { quill: any },
  range: Range,
  context: Context
): boolean {
  const line = context.line;

  if (line instanceof ListItem) {
    const success = line.outdent();
    if (success) {
      this.quill.setSelection(range.index, 0);
      return false; // Prevent default behavior
    }
  }

  return true; // Allow default behavior if not in list
}

// Keyboard bindings for list indentation
export const listIndentBindings = {
  'list indent': {
    key: 'Tab',
    format: ['list'],
    handler: handleTabIndent
  },
  'list outdent': {
    key: 'Tab',
    shiftKey: true,
    format: ['list'],
    handler: handleTabOutdent
  }
};

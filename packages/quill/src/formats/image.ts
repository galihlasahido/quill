import { EmbedBlot } from 'parchment';
import { sanitize } from './link.js';

const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'data-border-width',
  'data-border-color',
  'data-border-style',
  'data-margin-top',
  'data-margin-right',
  'data-margin-bottom',
  'data-margin-left',
  'data-float'
];

class Image extends EmbedBlot {
  static blotName = 'image';
  static tagName = 'IMG';

  static create(value: string) {
    const node = super.create(value) as HTMLImageElement;
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    // Default cursor for interactivity
    node.style.cursor = 'pointer';
    return node;
  }

  static formats(domNode: Element) {
    const formats = ATTRIBUTES.reduce(
      (formats: Record<string, string | null>, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {},
    );

    // Also capture inline styles
    const element = domNode as HTMLElement;
    if (element.style.border) formats['style-border'] = element.style.border;
    if (element.style.margin) formats['style-margin'] = element.style.margin;
    if (element.style.float) formats['style-float'] = element.style.float;
    if (element.style.display) formats['style-display'] = element.style.display;

    return formats;
  }

  static match(url: string) {
    return /\.(jpe?g|gif|png|svg|webp)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url: string) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode: Element) {
    return domNode.getAttribute('src');
  }

  domNode: HTMLImageElement;

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else if (name.startsWith('style-')) {
      // Handle inline style formats
      const styleName = name.replace('style-', '');
      if (value) {
        this.domNode.style[styleName as any] = value;
      } else {
        this.domNode.style[styleName as any] = '';
      }
    } else {
      super.format(name, value);
    }
  }
}

export default Image;

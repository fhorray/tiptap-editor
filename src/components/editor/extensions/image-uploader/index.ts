import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageUploaderComponent } from './component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUploader: {
      setImageUploader: () => ReturnType;
    };
  }
}

export const ImageUploader = Node.create({
  name: 'imageUploader',
  group: 'block',
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      loading: {
        default: false,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-uploader"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-uploader' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploaderComponent);
  },

  addCommands() {
    return {
      setImageUploader:
        () =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
            });
          },
    };
  },
});

export default ImageUploader;
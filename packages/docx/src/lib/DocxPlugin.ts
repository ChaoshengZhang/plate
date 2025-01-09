import {
  type HtmlDeserializer,
  type SlatePlugin,
  HtmlPlugin,
  createSlatePlugin,
} from '@udecode/plate-common';

import { cleanDocx } from './docx-cleaner/cleanDocx';
import {
  getDocxIndent,
  getDocxTextIndent,
} from './docx-cleaner/utils/getDocxIndent';
import { getDocxListContentHtml } from './docx-cleaner/utils/getDocxListContentHtml';
import { getDocxListIndent } from './docx-cleaner/utils/getDocxListIndent';
import { getTextListStyleType } from './docx-cleaner/utils/getTextListStyleType';
import { isDocxContent } from './docx-cleaner/utils/isDocxContent';
import { isDocxList } from './docx-cleaner/utils/isDocxList';

const isIndentListStatic = (element: HTMLElement) => {
  return !!element.dataset.slateListStyleType;
};

const getParse =
  (type: string): HtmlDeserializer['parse'] =>
  ({ element }) => {
    const node: any = { type };

    if (isIndentListStatic(element)) {
      const { slateChecked, slateIndent, slateListStart, slateListStyleType } =
        element.dataset;

      if (slateChecked !== undefined) {
        node.checked = slateChecked === 'true';
      }
      if (slateIndent !== undefined) {
        node.indent = Number(slateIndent);
      }
      if (slateListStart !== undefined) {
        node.listStart = Number(slateListStart);
      }
      if (slateListStyleType !== undefined) {
        node.listStyleType = slateListStyleType;
      }

      return node;
    }
    if (isDocxList(element)) {
      node.indent = getDocxListIndent(element);

      const text = element.textContent ?? '';

      node.listStyleType = getTextListStyleType(text) ?? 'disc';

      element.innerHTML = getDocxListContentHtml(element);
    } else {
      const indent = getDocxIndent(element);

      if (indent) {
        node.indent = indent;
      }

      const textIndent = getDocxTextIndent(element);

      if (textIndent) {
        node.textIndent = textIndent;
      }
    }

    return node;
  };

export const DocxPlugin = createSlatePlugin({
  key: 'docx',
  inject: {
    plugins: {
      [HtmlPlugin.key]: {
        parser: {
          transformData: ({ data, dataTransfer }) => {
            const rtf = dataTransfer.getData('text/rtf');

            return cleanDocx(data, rtf);
          },
        },
      },
    },
  },
}).extend(({ editor }) => {
  return {
    override: {
      plugins: {
        ...Object.fromEntries(
          ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((key) => [
            key,
            {
              parsers: {
                html: {
                  deserializer: {
                    parse: getParse(editor.getType({ key })),
                  },
                },
              },
            } satisfies Partial<SlatePlugin>,
          ])
        ),
        img: {
          parser: {
            query: ({ dataTransfer }) => {
              const data = dataTransfer.getData('text/html');
              const { body } = new DOMParser().parseFromString(
                data,
                'text/html'
              );

              return !isDocxContent(body);
            },
          },
        },
      },
    },
  };
});

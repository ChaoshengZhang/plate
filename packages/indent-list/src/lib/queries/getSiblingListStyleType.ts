import type {
  ElementOf,
  NodeEntry,
  SlateEditor,
  TElement,
} from '@udecode/plate';

import type { ListStyleType } from '../types';

import { BaseIndentListPlugin } from '../BaseIndentListPlugin';
import {
  type GetIndentListSiblingsOptions,
  getIndentListSiblings,
} from './index';

/**
 * Get the first sibling list style type at the given indent. If none, return
 * the entry list style type.
 */
export const getSiblingListStyleType = <E extends SlateEditor>(
  editor: E,
  {
    entry,
    indent,
    ...options
  }: {
    entry: NodeEntry<TElement>;
    indent: number;
  } & GetIndentListSiblingsOptions<ElementOf<E>, E>
) => {
  const siblingEntry: NodeEntry<TElement> = [{ ...entry[0], indent }, entry[1]];

  const siblings = getIndentListSiblings(editor, siblingEntry as any, {
    breakOnEqIndentNeqListStyleType: false,
    current: false,
    eqIndent: true,
    ...options,
  });

  return (
    siblings.length > 0
      ? siblings[0][0][BaseIndentListPlugin.key]
      : entry[0][BaseIndentListPlugin.key]
  ) as ListStyleType;
};

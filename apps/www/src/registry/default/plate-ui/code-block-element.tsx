'use client';

import React from 'react';

import type { Editor, TElement } from '@udecode/plate';

import { cn, withRef } from '@udecode/cn';
import {
  formatCodeBlock,
  isLangSupported,
  useCodeBlockElementState,
} from '@udecode/plate-code-block/react';
import { BracesIcon } from 'lucide-react';

import { Button } from './button';
import { CodeBlockCombobox } from './code-block-combobox';
import { PlateElement } from './plate-element';

import './code-block-element.css';

export const CodeBlockElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const { element } = props;

    const state = useCodeBlockElementState({ element });

    return (
      <PlateElement
        ref={ref}
        className={cn(className, 'py-1', state.className)}
        {...props}
      >
        <pre className="overflow-x-auto rounded-md bg-muted px-6 py-8 font-mono text-sm leading-[normal] [tab-size:2]">
          <code>{children}</code>
        </pre>

        {state.syntax && (
          <div
            className="absolute right-2 top-2 z-10 flex select-none items-center gap-1"
            contentEditable={false}
          >
            <CodeBlockFormatButton {...props} />
            <CodeBlockCombobox />
          </div>
        )}
      </PlateElement>
    );
  }
);

export function CodeBlockFormatButton({
  editor,
  element,
}: {
  editor: Editor;
  element: TElement;
}) {
  if (!isLangSupported(element)) {
    return null;
  }

  return (
    <Button
      size="xs"
      variant="ghost"
      className="h-5 justify-between px-1 text-xs"
      onClick={() => formatCodeBlock(editor, { element })}
      title="Format code"
    >
      <BracesIcon className="text-gray-500" />
    </Button>
  );
}

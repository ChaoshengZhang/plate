import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import {
  EditablePlugins,
  MentionPlugin,
  MentionSelect,
  ParagraphPlugin,
  pipe,
  useMention,
  withMention,
} from '../../../packages/slate-plugins/src';
import { CHARACTERS } from '../../config/data';
import { initialValueMentions, nodeTypes } from '../../config/initialValues';

export default {
  title: 'Element/Inline Void/Mention',
  component: MentionPlugin,
  subcomponents: {
    useMention,
    MentionSelect,
  },
};

const plugins = [ParagraphPlugin(nodeTypes), MentionPlugin(nodeTypes)];

const withPlugins = [withReact, withHistory, withMention(nodeTypes)] as const;

export const Example = () => {
  const createReactEditor = () => () => {
    const [value, setValue] = useState(initialValueMentions);

    const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

    const {
      MentionSelectComponent,
      onChangeMention,
      onKeyDownMention,
    } = useMention({
      characters: CHARACTERS,
      maxSuggestions: 10,
    });

    return (
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);

          onChangeMention({ editor });
        }}
      >
        <EditablePlugins
          plugins={plugins}
          placeholder="Enter some text..."
          onKeyDown={[onKeyDownMention]}
        />
        <MentionSelectComponent />
      </Slate>
    );
  };

  const Editor = createReactEditor();

  return <Editor />;
};

import React from 'react';
import { useFormikContext } from 'formik';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Node } from 'slate';

interface SlateEditorProps {
  initialValue: any;
}

// Create a new SlateEditor component
const SlateEditor = ({ initialValue }: SlateEditorProps) => {
  const editor = withHistory(withReact(createEditor()));
  const { setFieldValue } = useFormikContext(); // Use the useFormikContext hook inside the SlateEditor component

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={value => {
        const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value);
          setFieldValue('about', content); // Set the custom value for the 'about' field
        }
      }}>
      <Editable />
    </Slate>
  );
};

export default SlateEditor;

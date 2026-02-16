declare module 'y-codemirror.next' {
  import { Awareness } from 'y-protocols/awareness';
  import { Extension } from '@codemirror/state';
  import * as Y from 'yjs';

  export function yCollab(
    ytext: Y.Text,
    awareness: Awareness,
    { undoManager }?: { undoManager?: Y.UndoManager },
  ): Extension;
}

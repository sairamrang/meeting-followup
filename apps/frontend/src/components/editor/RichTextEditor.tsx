import { useEditor, EditorContent, type AnyExtension } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  BoldIcon,
  ItalicIcon,
  ListBulletIcon,
  QueueListIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  editable = true,
}: RichTextEditorProps) {
  const isUpdatingFromProps = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }) as AnyExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      // Only call onChange if this update came from user interaction, not from props
      if (!isUpdatingFromProps.current) {
        onChange(editor.getHTML());
      }
    },
  });

  // Update editor content when content prop changes (e.g., when loading saved data)
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    // Only update if content actually changed and is different from current editor content
    if (content !== currentContent) {
      isUpdatingFromProps.current = true;
      editor.commands.setContent(content || '', false);
      // Reset the flag after a short delay to allow the update to complete
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      // Use toggleLink as a workaround for type compatibility issues between tiptap versions
      (editor.chain().focus() as any).setLink({ href: url }).run();
    }
  };

  return (
    <div
      className="border-[3px] border-slate-300 rounded-2xl overflow-hidden shadow-lg hover:border-purple-400 hover:shadow-xl focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all duration-300 bg-white group cursor-text"
      onClick={() => editor?.chain().focus().run()}
    >
      {/* Toolbar */}
      {editable && (
        <div className="bg-gradient-to-r from-slate-100 via-purple-50 to-slate-100 border-b-2 border-slate-200 p-3 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            <BoldIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            <ItalicIcon className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            title="Bullet List"
          >
            <ListBulletIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            title="Numbered List"
          >
            <QueueListIcon className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-gray-200' : ''
            }`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className={`prose prose-sm max-w-none p-6 min-h-[350px] focus:outline-none ${
            !editable ? 'bg-slate-50' : 'bg-white'
          }`}
        />
        {editable && editor.isEmpty && (
          <div className="absolute inset-0 flex items-start p-6 pointer-events-none">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-base font-medium italic">{placeholder}</span>
            </div>
          </div>
        )}
        {editable && !editor.isEmpty && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs font-semibold rounded-lg pointer-events-none select-none border border-purple-200 shadow-sm">
            Click anywhere to edit
          </div>
        )}
      </div>
    </div>
  );
}

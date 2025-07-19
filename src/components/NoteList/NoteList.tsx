import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {

  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
  if (!notes.length) {
    return <p>No notes yet</p>;
  }
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
            className={css.button}
            onClick={() => handleDelete(note.id.toString())}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
          </div>
        </li>
      ))}
    </ul>
  );
}







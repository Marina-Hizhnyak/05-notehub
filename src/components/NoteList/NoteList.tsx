import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  page: number;
  search: string;
  onTotalPages: (total: number) => void;
}

export default function NoteList({ page, search, onTotalPages }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
  });

  useEffect(() => {
    if (data?.totalPages) {
      onTotalPages(data.totalPages);
    }
  }, [data?.totalPages, onTotalPages]);

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load notes</p>;
  if (!data?.notes?.length) return <p>No notes yet</p>;

  return (
    <ul className={css.list}>
      {data.notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}



import { useEffect, useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';
import { useDebounce } from 'use-debounce';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', debouncedSearch, currentPage],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: {
      notes: [],
      page: 1,
      perPage: 12,
      totalPages: 1,
      totalItems: 0,
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreate = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data!.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data!.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Failed to load notes</p>}

      {data && data.notes.length > 0 ? (
        <NoteList
          notes={data.notes}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      ) : (
        <p>No notes yet</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} onCreate={handleCreate} />
        </Modal>
      )}
    </div>
  );
}


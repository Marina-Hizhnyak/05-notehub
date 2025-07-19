import { useEffect, useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';
import { useDebounce } from 'use-debounce';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', debouncedSearch, currentPage],
    queryFn: (): Promise<FetchNotesResponse> =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch,
      }),
    keepPreviousData: true,
  });
  
  
  

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handleCreate = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {data?.totalPages > 1 && (
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

      {data?.notes.length > 0 ? <NoteList notes={data.notes} /> : <p>No notes found</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} onCreate={handleCreate} />
        </Modal>
      )}
    </div>
  );
}


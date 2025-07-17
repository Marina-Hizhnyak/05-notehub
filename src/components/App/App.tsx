import { useState } from 'react'
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '..//NoteForm/NoteForm';
import css from './App.module.css';
import { useQueryClient } from '@tanstack/react-query';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const queryClient = useQueryClient();

  const handleCreate = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] }); 
    setIsModalOpen(false); 
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
      <SearchBox value={search} onChange={setSearch} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        />
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <NoteList
        page={currentPage}
        search={search}
        onTotalPages={setTotalPages}
      />

      {isModalOpen && (
      <Modal onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} onCreate={handleCreate} />
      </Modal>
)}

    </div>
  );
}

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {

  if (totalPages <= 1) return null;

  return (
    <div className={css.paginationContainer}>
      <ReactPaginate
        forcePage={currentPage - 1} 
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        containerClassName={css.pagination}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        breakLabel="..."
        previousLabel="<"
        nextLabel=">"
        previousClassName={css.pageItem}
        nextClassName={css.pageItem}
        previousLinkClassName={css.pageLink}
        nextLinkClassName={css.pageLink}
        breakClassName={css.pageItem}
        breakLinkClassName={css.pageLink}
      />
    </div>
  );
}


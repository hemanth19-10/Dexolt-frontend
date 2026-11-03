const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex space-x-2">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-4 py-2 ${page === currentPage ? 'bg-brand-blue text-white shadow-md shadow-violet-200' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
export default Pagination
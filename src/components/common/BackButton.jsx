import { FaArrowLeft } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'

const BackButton = ({ fallback = '/', showOnHome = false, homeLabel = 'Back to store' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isPanelHome = location.pathname === '/' || location.pathname === '/admin'

  const handleBack = () => {
    if (isPanelHome) {
      navigate(fallback)
    } else if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(fallback)
    }
  }

  if (isPanelHome && !showOnHome) return null

  return (
    <button
      type="button"
      onClick={handleBack}
      className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 hover:bg-white hover:text-brand-blue"
      aria-label={isPanelHome ? homeLabel : 'Go back to the previous page'}
    >
      <FaArrowLeft size={13} />
      {isPanelHome ? homeLabel : 'Back'}
    </button>
  )
}

export default BackButton

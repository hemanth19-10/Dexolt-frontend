import React from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa'

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: {
      icon: FaCheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-700',
      iconColor: 'text-green-400'
    },
    error: {
      icon: FaTimesCircle,
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: FaExclamationCircle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: FaInfoCircle,
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-700',
      iconColor: 'text-blue-400'
    }
  }

  const { icon: Icon, bg, border, text, iconColor } = types[type] || types.info

  return (
    <div className={`${bg} border-l-4 ${border} p-4 rounded-md flex items-start justify-between`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${iconColor} mr-2 mt-0.5`} />
        <p className={`${text} text-sm`}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FaTimesCircle />
        </button>
      )}
    </div>
  )
}

export default Alert
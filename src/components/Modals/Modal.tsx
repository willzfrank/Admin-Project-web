import { Icon } from '@iconify/react'
import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white border border-black p-8 max-w-xl relative">
        <Icon
          icon="material-symbols:close"
          className="absolute top-0 right-0 m-4 text-gray-600 cursor-pointer"
          onClick={onClose}
        />
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal

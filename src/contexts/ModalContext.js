import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import NotificationModal from '../components/Modal/NotificationModal'

const ModalContext = createContext()

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    showCancel: false,
    onConfirm: null,
    confirmText: 'OK',
    cancelText: 'Cancel',
  })

  const showModal = (config) => {
    setModal({
      visible: true,
      type: 'info',
      title: '',
      message: '',
      showCancel: false,
      onConfirm: null,
      confirmText: 'OK',
      cancelText: 'Cancel',
      ...config,
    })
  }

  const hideModal = () => {
    setModal((prev) => ({ ...prev, visible: false }))
  }

  const showSuccess = (message, title = 'Success') => {
    showModal({
      type: 'success',
      title,
      message,
    })
  }

  const showError = (message, title = 'Error') => {
    showModal({
      type: 'error',
      title,
      message,
    })
  }

  const showWarning = (message, title = 'Warning') => {
    showModal({
      type: 'warning',
      title,
      message,
    })
  }

  const showInfo = (message, title = 'Information') => {
    showModal({
      type: 'info',
      title,
      message,
    })
  }

  const showConfirm = (
    message,
    onConfirm,
    title = 'Confirm',
    confirmText = 'Yes',
    cancelText = 'No',
  ) => {
    showModal({
      type: 'warning',
      title,
      message,
      showCancel: true,
      onConfirm,
      confirmText,
      cancelText,
    })
  }

  const value = {
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      <NotificationModal
        visible={modal.visible}
        onClose={hideModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        showCancel={modal.showCancel}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </ModalContext.Provider>
  )
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Note: This file is deprecated. Use the modal system instead.
// Import useModal from '../contexts/ModalContext' in your components
// and use showSuccess, showError, showWarning, showInfo methods

// Legacy functions - kept for backward compatibility but will be removed
export const showSuccessMsg = (msg) => {
  console.warn('showSuccessMsg is deprecated. Use modal system instead.')
  // This will be handled by the modal system in components
}

export const showWarningMsg = (msg) => {
  console.warn('showWarningMsg is deprecated. Use modal system instead.')
  // This will be handled by the modal system in components
}

export const showErrorMsg = (msg) => {
  console.warn('showErrorMsg is deprecated. Use modal system instead.')
  // This will be handled by the modal system in components
}

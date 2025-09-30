import React from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilWarning, cilXCircle, cilInfo } from '@coreui/icons'

const NotificationModal = ({
  visible,
  onClose,
  type = 'info',
  title,
  message,
  showCancel = false,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CIcon icon={cilCheckCircle} className="text-success me-2" size="lg" />
      case 'warning':
        return <CIcon icon={cilWarning} className="text-warning me-2" size="lg" />
      case 'error':
        return <CIcon icon={cilXCircle} className="text-danger me-2" size="lg" />
      case 'info':
      default:
        return <CIcon icon={cilInfo} className="text-info me-2" size="lg" />
    }
  }

  const getAlertColor = () => {
    switch (type) {
      case 'success':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'danger'
      case 'info':
      default:
        return 'info'
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle className="d-flex align-items-center">
          {getIcon()}
          {title}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAlert color={getAlertColor()} className="mb-0">
          {message}
        </CAlert>
      </CModalBody>
      <CModalFooter>
        {showCancel && (
          <CButton color="secondary" onClick={onClose}>
            {cancelText}
          </CButton>
        )}
        <CButton
          color={type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}
          onClick={handleConfirm}
        >
          {confirmText}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

NotificationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  showCancel: PropTypes.bool,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
}

export default NotificationModal

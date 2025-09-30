/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CAlert,
  CSpinner,
  CImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import axios from 'axios'
import { API_URLS } from '../../config/Constants'
import { useModal } from '../../contexts/ModalContext'

const BackgroundImage = () => {
  const { showSuccess, showError } = useModal()
  const [currentBackground, setCurrentBackground] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    fetchBackgroundImage()
  }, [])

  const fetchBackgroundImage = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URLS.BACKGROUND_IMAGE)
      console.log('Background image response:', response.data)

      // Handle the new API response structure
      if (response.data.success && response.data.data && response.data.data !== '') {
        setCurrentBackground(response.data.data)
      } else {
        setCurrentBackground(null)
      }
    } catch (error) {
      console.error('Error fetching background image:', error)
      showError('Failed to load background image')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('background', file)

      const response = await axios.post(API_URLS.BACKGROUND_IMAGE_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Handle the new API response structure
      if (response.data.success && response.data.data) {
        setCurrentBackground(response.data.data)
      } else {
        setCurrentBackground(response.data)
      }
      showSuccess('Background image uploaded successfully!')
      event.target.value = ''
    } catch (error) {
      console.error('Error uploading background image:', error)
      showError('Failed to upload background image')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteBackground = async () => {
    try {
      await axios.delete(API_URLS.BACKGROUND_IMAGE_DELETE)
      setCurrentBackground(null)
      showSuccess('Background image deleted successfully!')
      setDeleteModal(false)
    } catch (error) {
      console.error('Error deleting background image:', error)
      showError('Failed to delete background image')
    }
  }

  return (
    <div className="container-fluid">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h4>Background Image Management</h4>
              <p className="text-muted">
                Upload and manage the background image for the restaurant app
              </p>
            </CCardHeader>
            <CCardBody>
              {/* Upload Section */}
              <CRow className="mb-4">
                <CCol>
                  <CForm>
                    <CFormLabel>Upload Background Image</CFormLabel>
                    <CFormInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <small className="text-muted">
                      Recommended size: 1920x1080 or higher. Supported formats: JPG, PNG
                    </small>
                  </CForm>
                </CCol>
              </CRow>

              {/* Current Background Image */}
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: '400px' }}
                >
                  <CSpinner />
                </div>
              ) : (
                <CRow>
                  <CCol>
                    <h5>Current Background Image</h5>
                    {currentBackground ? (
                      <div>
                        <div
                          className="mb-3"
                          style={{ maxHeight: '400px', overflow: 'hidden', borderRadius: '8px' }}
                        >
                          <CImage
                            src={`${process.env.REACT_APP_UPLOAD_URL}${currentBackground.url}`}
                            alt="Background image"
                            style={{ width: '100%', height: 'auto' }}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">
                              <strong>Filename:</strong> {currentBackground.filename}
                              <br />
                              <strong>Uploaded:</strong>{' '}
                              {new Date(currentBackground.uploadedAt).toLocaleString()}
                            </small>
                          </div>
                          <CButton color="danger" onClick={() => setDeleteModal(true)}>
                            Delete Background
                          </CButton>
                        </div>
                      </div>
                    ) : (
                      <CAlert color="warning">
                        No background image uploaded yet. Upload an image to set the background for
                        the restaurant app.
                      </CAlert>
                    )}
                  </CCol>
                </CRow>
              )}

              {uploading && (
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <CSpinner className="me-2" />
                  <span>Uploading background image...</span>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the current background image? This action cannot be
          undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteBackground}>
            Delete Background
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default BackgroundImage

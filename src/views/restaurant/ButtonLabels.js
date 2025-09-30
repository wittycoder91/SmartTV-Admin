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
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import { API_URLS } from '../../config/Constants'
import { useModal } from '../../contexts/ModalContext'

const ButtonLabels = () => {
  const { showSuccess, showError, showWarning } = useModal()
  const [labels, setLabels] = useState({
    menu: 'OUR MENU',
    reservation: 'RESERVATION',
    lunch: 'LUNCH',
    reviews: 'OUR REVIEWS',
    coffee: 'COFFEE, TEA AND DESSERT',
    wine: 'WINE',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLabels()
  }, [])

  const fetchLabels = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URLS.BUTTON_LABELS)
      if (response.data.success && response.data.data) {
        setLabels(response.data.data)
      } else {
        setLabels(response.data)
      }
    } catch (error) {
      console.error('Error fetching labels:', error)
      showError('Failed to load button labels')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (buttonKey, value) => {
    setLabels((prev) => ({
      ...prev,
      [buttonKey]: value,
    }))
  }

  const handleSave = async () => {
    const emptyFields = Object.entries(labels).filter(
      ([key, value]) => !value || (typeof value === 'string' && value.trim() === ''),
    )

    if (emptyFields.length > 0) {
      showWarning('Please fill in all button labels before saving. All fields are required.')
      return
    }

    setSaving(true)
    try {
      const response = await axios.put(API_URLS.BUTTON_LABELS, labels)
      if (response.data.success) {
        showSuccess('Button labels updated successfully!')
      } else {
        showError('Failed to save button labels')
      }
    } catch (error) {
      console.error('Error saving labels:', error)
      showError('Failed to save button labels')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <CSpinner />
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h4>Button Labels Management</h4>
              <p className="text-muted">
                Update the labels for the 6 buttons displayed on the restaurant app
              </p>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormLabel>Menu Button</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Button label"
                      value={labels.menu}
                      onChange={(e) => handleInputChange('menu', e.target.value)}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Reservation Button</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Button label"
                      value={labels.reservation}
                      onChange={(e) => handleInputChange('reservation', e.target.value)}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormLabel>Lunch Button</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Button label"
                      value={labels.lunch}
                      onChange={(e) => handleInputChange('lunch', e.target.value)}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Reviews Button</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Button label"
                      value={labels.reviews}
                      onChange={(e) => handleInputChange('reviews', e.target.value)}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-4">
                  <CCol md={6}>
                    <CFormLabel>Coffee & Dessert Button</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Button label"
                      value={labels.coffee}
                      onChange={(e) => handleInputChange('coffee', e.target.value)}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Wine Button</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Button label"
                      value={labels.wine}
                      onChange={(e) => handleInputChange('wine', e.target.value)}
                    />
                  </CCol>
                </CRow>

                <div className="d-flex justify-content-end">
                  <CButton color="primary" onClick={handleSave} disabled={saving}>
                    {saving ? <CSpinner size="sm" className="me-2" /> : null}
                    Save Changes
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default ButtonLabels

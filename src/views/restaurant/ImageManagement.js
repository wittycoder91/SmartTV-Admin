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

const ImageManagement = () => {
  const { showSuccess, showError, showWarning } = useModal()
  const [selectedCategory, setSelectedCategory] = useState('menu')
  const [images, setImages] = useState({
    menu: [],
    lunch: [],
    coffee: [],
    wine: [],
    reservation: [],
    reviews: [],
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, imageId: null })
  const [viewModal, setViewModal] = useState({ show: false, image: null, index: 0 })
  const [draggedImage, setDraggedImage] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [buttonLabels, setButtonLabels] = useState({
    menu: 'OUR MENU',
    reservation: 'RESERVATION',
    lunch: 'LUNCH',
    reviews: 'OUR REVIEWS',
    coffee: 'COFFEE, TEA AND DESSERT',
    wine: 'WINE',
  })

  const categories = [
    {
      key: 'menu',
      name: `${buttonLabels.menu} Images`,
      description: `Upload and manage images for the ${buttonLabels.menu.toLowerCase()} section`,
    },
    {
      key: 'lunch',
      name: `${buttonLabels.lunch} Images`,
      description: `Upload and manage images for the ${buttonLabels.lunch.toLowerCase()} section`,
    },
    {
      key: 'coffee',
      name: `${buttonLabels.coffee} Images`,
      description: `Upload and manage images for the ${buttonLabels.coffee.toLowerCase()} section`,
    },
    {
      key: 'wine',
      name: `${buttonLabels.wine} Images`,
      description: `Upload and manage images for the ${buttonLabels.wine.toLowerCase()} section`,
    },
    {
      key: 'reservation',
      name: `${buttonLabels.reservation} Images`,
      description: `Upload and manage images for the ${buttonLabels.reservation.toLowerCase()} section`,
    },
    {
      key: 'reviews',
      name: `${buttonLabels.reviews} Images`,
      description: `Upload and manage images for the ${buttonLabels.reviews.toLowerCase()} section`,
    },
  ]

  useEffect(() => {
    fetchButtonLabels()
    fetchImages()
  }, [])

  const fetchButtonLabels = async () => {
    try {
      const response = await axios.get(API_URLS.BUTTON_LABELS)
      if (response.data.success && response.data.data) {
        setButtonLabels(response.data.data)
      } else {
        setButtonLabels(response.data)
      }
    } catch (error) {
      console.error('Error fetching button labels:', error)
      // Keep default labels if API fails
    }
  }

  const fetchImages = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URLS.IMAGES)

      // Handle the new API response structure
      if (response.data.success && response.data.data) {
        const imageData = response.data.data
        const processedImages = {}

        // Convert URL strings to image objects for each category
        Object.keys(imageData).forEach((category) => {
          processedImages[category] = imageData[category].map((url, index) => ({
            id: `${category}_${index}_${Date.now()}`,
            url: url,
            filename: url.split('/').pop() || `image_${index + 1}`,
            uploadedAt: new Date().toISOString(),
          }))
        })

        setImages(processedImages)
      } else {
        setImages(response.data)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      showError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    const filesWithPreview = files.map((file) => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    }))

    setSelectedFiles((prev) => [...prev, ...filesWithPreview])
    event.target.value = ''
  }

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      showWarning('Please select images to upload')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      selectedFiles.forEach((fileObj) => {
        formData.append('images', fileObj.file)
      })
      formData.append('category', selectedCategory)

      const response = await axios.post(API_URLS.IMAGES_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success && response.data.data && response.data.data.uploadedUrls) {
        const uploadedUrls = response.data.data.uploadedUrls
        const newImages = uploadedUrls.map((url, index) => ({
          id: Date.now() + index,
          url: url,
          filename: `uploaded_image_${index + 1}`,
          uploadedAt: new Date().toISOString(),
        }))

        setImages((prev) => ({
          ...prev,
          [selectedCategory]: [...(prev[selectedCategory] || []), ...newImages],
        }))
      }
      showSuccess(`${selectedFiles.length} image(s) uploaded successfully!`)
      setSelectedFiles([])
    } catch (error) {
      console.error('Error uploading images:', error)
      console.error('Error details:', error.response?.data)
      showError(`Failed to upload images: ${error.response?.data?.error || error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveSelectedFile = (fileId) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }

  const handleViewImage = (image, index) => {
    setViewModal({ show: true, image, index })
  }

  const handleDeleteImage = async (imageId) => {
    try {
      const imageToDelete = images[selectedCategory].find((img) => img.id === imageId)
      if (!imageToDelete) {
        showError('Image not found')
        return
      }

      await axios.delete(API_URLS.IMAGE_DELETE, {
        data: {
          imageUrl: imageToDelete.url,
          category: selectedCategory,
        },
      })

      setImages((prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter((img) => img.id !== imageId),
      }))
      showSuccess('Image deleted successfully!')
      setDeleteModal({ show: false, imageId: null })
    } catch (error) {
      console.error('Error deleting image:', error)
      showError('Failed to delete image')
    }
  }

  const handleDragStart = (e, image, index) => {
    setDraggedImage({ image, index })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()

    if (!draggedImage || draggedImage.index === dropIndex) {
      setDraggedImage(null)
      setDragOverIndex(null)
      return
    }

    const newImages = [...images[selectedCategory]]
    const draggedItem = newImages[draggedImage.index]

    // Remove the dragged item from its original position
    newImages.splice(draggedImage.index, 1)

    // Insert it at the new position
    newImages.splice(dropIndex, 0, draggedItem)

    // Update local state immediately for better UX
    setImages((prev) => ({
      ...prev,
      [selectedCategory]: newImages,
    }))

    // Call API to update order on backend
    try {
      const imageUrls = newImages.map((img) => img.url)
      await axios.put(API_URLS.IMAGES, {
        category: selectedCategory,
        imageUrls: imageUrls,
      })
      showSuccess('Image order updated successfully!')
    } catch (error) {
      console.error('Error updating image order:', error)
      showError('Failed to update image order')
      // Revert local state on error
      setImages((prev) => ({
        ...prev,
        [selectedCategory]: images[selectedCategory],
      }))
    }

    setDraggedImage(null)
    setDragOverIndex(null)
  }

  const currentCategory = categories.find((cat) => cat.key === selectedCategory)
  const currentImages = images[selectedCategory] || []

  return (
    <div className="container-fluid">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h4>Image Management</h4>
              <p className="text-muted">
                Upload and manage images for different restaurant categories
              </p>
            </CCardHeader>
            <CCardBody>
              {/* Category Selection */}
              <CRow className="mb-4">
                <CCol>
                  <CFormLabel>Select Category</CFormLabel>
                  <div className="d-grid d-md-flex gap-2" role="group">
                    {categories.map((category) => (
                      <CButton
                        key={category.key}
                        color={selectedCategory === category.key ? 'primary' : 'outline-primary'}
                        onClick={() => setSelectedCategory(category.key)}
                        className="flex-fill"
                        size="sm"
                      >
                        <span className="d-none d-sm-inline">{category.name}</span>
                        <span className="d-sm-none">{category.name.split(' ')[0]}</span>
                      </CButton>
                    ))}
                  </div>
                </CCol>
              </CRow>

              {/* Current Category Info */}
              <CRow className="mb-4">
                <CCol>
                  <CAlert color="info">
                    <h5>{currentCategory?.name}</h5>
                    <p className="mb-0">{currentCategory?.description}</p>
                  </CAlert>
                </CCol>
              </CRow>

              {/* File Selection */}
              <CRow className="mb-4">
                <CCol>
                  <CForm>
                    <CFormLabel>Select Images</CFormLabel>
                    <CFormInput
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelection}
                      disabled={uploading}
                    />
                    <small className="text-muted">
                      You can select multiple images at once. Supported formats: JPG, PNG, GIF
                    </small>
                  </CForm>
                </CCol>
              </CRow>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <CRow className="mb-4">
                  <CCol>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5>Selected Images ({selectedFiles.length})</h5>
                      <CButton color="primary" onClick={handleUploadImages} disabled={uploading}>
                        {uploading ? (
                          <>
                            <CSpinner size="sm" className="me-2" />
                            Uploading...
                          </>
                        ) : (
                          'Upload Images'
                        )}
                      </CButton>
                    </div>
                    <CRow>
                      {selectedFiles.map((fileObj) => (
                        <CCol xs={6} sm={4} md={3} lg={2} className="mb-3" key={fileObj.id}>
                          <CCard className="h-100">
                            <div
                              style={{
                                height: '120px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                handleViewImage({ url: fileObj.preview, filename: fileObj.name }, 0)
                              }
                            >
                              <CImage
                                src={fileObj.preview}
                                alt={fileObj.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                            <CCardBody className="p-1">
                              <div className="d-flex flex-column">
                                <small className="text-muted text-break mb-2">{fileObj.name}</small>
                                <CButton
                                  color="danger"
                                  size="sm"
                                  className="w-100"
                                  onClick={() => handleRemoveSelectedFile(fileObj.id)}
                                >
                                  Remove
                                </CButton>
                              </div>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      ))}
                    </CRow>
                  </CCol>
                </CRow>
              )}

              {uploading && (
                <div className="d-flex justify-content-center align-items-center mt-3">
                  <CSpinner className="me-2" />
                  <span>Uploading images...</span>
                </div>
              )}

              {/* Uploaded Images */}
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
                    {currentImages.length === 0 ? (
                      <CAlert color="warning">
                        No images available for this category. Upload some images first.
                      </CAlert>
                    ) : (
                      <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5>Uploaded Images ({currentImages.length})</h5>
                        </div>
                        <CAlert color="info" className="mb-3">
                          <small>
                            <strong>💡 Tip:</strong> You can drag and drop images to reorder them.
                            The new order will be automatically saved to the server.
                          </small>
                        </CAlert>
                        <CRow>
                          {currentImages.map((image, index) => (
                            <CCol
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              className="mb-3"
                              key={image.id || index}
                            >
                              <CCard
                                className={`h-100 ${dragOverIndex === index ? 'border-primary border-3' : ''} ${draggedImage?.index === index ? 'opacity-50' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, image, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                style={{
                                  cursor: 'move',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <div
                                  style={{
                                    height: '200px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => handleViewImage(image, index)}
                                >
                                  <CImage
                                    src={`${process.env.REACT_APP_UPLOAD_URL}${image.url}`}
                                    alt={`${selectedCategory} image ${index + 1}`}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                </div>
                                <CCardBody className="p-2">
                                  <div
                                    className="d-flex flex-column"
                                    style={{
                                      height: '100%',
                                      justifyContent: 'space-around',
                                    }}
                                  >
                                    <div className="mb-2">
                                      <small className="text-muted text-break">
                                        {image.filename || `Image ${index + 1}`}
                                      </small>
                                    </div>
                                    <div className="d-flex flex-wrap flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                                      <small className="text-muted text-nowrap">
                                        Drag to reorder
                                      </small>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                        className="w-100 w-sm-auto"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setDeleteModal({ show: true, imageId: image.id })
                                        }}
                                      >
                                        Delete
                                      </CButton>
                                    </div>
                                  </div>
                                </CCardBody>
                              </CCard>
                            </CCol>
                          ))}
                        </CRow>
                      </>
                    )}
                  </CCol>
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Image View Modal */}
      <CModal
        visible={viewModal.show}
        onClose={() => setViewModal({ show: false, image: null, index: 0 })}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Image Gallery - {currentCategory?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewModal.image && (
            <div>
              <CImage
                src={`${process.env.REACT_APP_UPLOAD_URL}${viewModal.image.url}`}
                alt="Gallery image"
                style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
              />
              <div className="mt-3">
                <small className="text-muted">
                  <strong>Filename:</strong> {viewModal.image.filename}
                  <br />
                  <strong>Uploaded:</strong> {new Date(viewModal.image.uploadedAt).toLocaleString()}
                </small>
              </div>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setViewModal({ show: false, image: null, index: 0 })}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, imageId: null })}
      >
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this image?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal({ show: false, imageId: null })}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => handleDeleteImage(deleteModal.imageId)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ImageManagement

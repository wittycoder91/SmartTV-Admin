import React from 'react'

// Restaurant Management
const ButtonLabels = React.lazy(() => import('./views/restaurant/ButtonLabels'))
const ImageManagement = React.lazy(() => import('./views/restaurant/ImageManagement'))
const BackgroundImage = React.lazy(() => import('./views/restaurant/BackgroundImage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/restaurant', name: 'Restaurant Management', element: ButtonLabels, exact: true },
  { path: '/restaurant/labels', name: 'Button Labels', element: ButtonLabels },
  { path: '/restaurant/images', name: 'Image Management', element: ImageManagement },
  { path: '/restaurant/background', name: 'Background Image', element: BackgroundImage },
]

export default routes

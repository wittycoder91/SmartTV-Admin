import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilText, cilImage, cilList } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Restaurant Management',
  },
  {
    component: CNavItem,
    name: 'Button Labels',
    to: '/restaurant/labels',
    icon: <CIcon icon={cilText} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Image Management',
    to: '/restaurant/images',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Background Image',
    to: '/restaurant/background',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
]

export default _nav

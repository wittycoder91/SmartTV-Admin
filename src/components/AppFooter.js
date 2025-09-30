import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2024 Smart TV</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        Smart TV
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

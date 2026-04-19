import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/frontend_assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <div className="app-download-content">
        <span className="app-download-tag">📱 Mobile App</span>
        <h2>
          Get the <span>Apna Swad</span><br />
          app today
        </h2>
        <p>
          Order faster, track live, and enjoy exclusive app-only deals.
          Available on Android and iOS — download now!
        </p>
        <div className="app-download-platforms">
          <img src={assets.play_store} alt="Get it on Google Play" />
          <img src={assets.app_store} alt="Download on App Store" />
        </div>
      </div>
    </div>
  )
}

export default AppDownload
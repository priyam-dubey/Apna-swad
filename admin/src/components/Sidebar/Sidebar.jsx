import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <p className="sidebar-label">Management</p>

      <NavLink to='add' className="sidebar-option">
        <div className="sidebar-option-icon">
          <img src={assets.add_icon} alt="Add" />
        </div>
        <p>Add Items</p>
      </NavLink>

      <NavLink to='list' className="sidebar-option">
        <div className="sidebar-option-icon">
          <img src={assets.order_icon} alt="List" />
        </div>
        <p>List Items</p>
      </NavLink>

      <div className="sidebar-divider"></div>

      <p className="sidebar-label">Operations</p>

      <NavLink to='orders' className="sidebar-option">
        <div className="sidebar-option-icon">
          <img src={assets.order_icon} alt="Orders" />
        </div>
        <p>Orders</p>
      </NavLink>

      <div className="sidebar-footer">
        <p>🍛 Apna Swad</p>
        <span>Admin Panel v1.0</span>
      </div>
    </div>
  )
}

export default Sidebar
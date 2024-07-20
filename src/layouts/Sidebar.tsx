import React, { ReactNode, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

interface SidebarLayoutProps {
  children: ReactNode
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [selected, setSelected] = useState('Dashboard')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleToggleCollapse = () => {
    if (!isMobile) {
      setCollapsed(!collapsed)
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar Container */}
      <div
        className={`h-full overflow-y-auto scrollbar-hidden ${
          isMobile ? 'w-[26%]' : collapsed ? 'w-[80px]' : 'w-[20%]'
        } sticky top-0 z-10`}
      >
        <Sidebar
          collapsed={isMobile ? true : collapsed}
          width="270px"
          collapsedWidth="80px"
          transitionDuration={300}
          rootStyles={{
            backgroundColor: 'rgba(249, 249, 249, 0.7)',
          }}
        >
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                backgroundColor: active ? '#eecef9' : undefined,
                '&:hover': {
                  backgroundColor: '#f5d9ff',
                },
              }),
            }}
          >
            {/* Logo and Collapse Button */}
            <MenuItem
              onClick={handleToggleCollapse}
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              style={{ margin: '10px 0 20px 0' }}
            >
              {(!collapsed || isMobile) && (
                <div className="flex items-center justify-between">
                  <img
                    src="/path/to/logo.png"
                    alt="Project logo"
                    className="w-[140px] h-auto bg-white p-2 rounded"
                  />
                </div>
              )}
            </MenuItem>

            {/* Menu Items */}
            <MenuItem
              component={<Link to="/dashboard" />}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              }
              active={selected === 'Manage Roles'}
              onClick={() => setSelected('Manage Roles')}
            >
              Manage Roles
            </MenuItem>

            <MenuItem
              component={<Link to="/user-management" />}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              }
              active={selected === 'User Management'}
              onClick={() => setSelected('User Management')}
            >
              User Management
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>

      {/* Main Content Area */}
      <main
        className={`h-full overflow-y-auto ${
          isMobile
            ? 'w-full '
            : collapsed
            ? 'w-[calc(100%-80px)] px-10'
            : 'w-[95%]'
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  )
}

export default SidebarLayout

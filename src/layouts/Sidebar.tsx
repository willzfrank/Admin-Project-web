import React, { ReactNode, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'

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

    handleResize() // Check initial size
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
        className={`h-full overflow-y-auto ${
          isMobile ? 'w-[26%]' : collapsed ? 'w-[80px]' : 'w-[20%]'
        }`}
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

            {/* User Profile */}
            {(!collapsed || isMobile) && (
              <div className="mb-[25px] text-center">
                <img
                  alt="profile-user"
                  src="https://st3.depositphotos.com/7865540/13292/i/1600/depositphotos_132922972-stock-photo-view-of-tablet-with-icons.jpg"
                  className="rounded w-[100px] h-auto mx-auto"
                />
                <h2 className="font-bold mt-[10px]">Hi, Admin</h2>
                <h5>Project Builder Admin</h5>
              </div>
            )}

            {/* Menu Items */}
            <MenuItem
              component={<Link to="/" />}
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

            <SubMenu label="Data">
              <MenuItem
                component={<Link to="/transaction" />}
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                active={selected === 'Manage Users'}
                onClick={() => setSelected('Manage Users')}
              >
                Manage Users
              </MenuItem>
            </SubMenu>
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
            : 'w-[80%] px-6'
        }`}
      >
        {children}
      </main>
    </div>
  )
}

export default SidebarLayout

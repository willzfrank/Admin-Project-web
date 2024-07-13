import { Dropdown, Menu } from 'antd'
import emptyImage from '../assets/Images/empty_image.svg'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AUTH_KEY, USER_ENDPOINT, USER_KEY } from './util/constant'
import { HttpResponse, User } from '../types/global'
import axiosInstance from './util/AxiosInstance'

const Navbar = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async (userId: string) => {
      try {
        const cachedUser = localStorage.getItem(USER_KEY)
        if (cachedUser) {
          setUser(JSON.parse(cachedUser))
        } else {
          const response = await axiosInstance.get<any, HttpResponse<User>>(
            `${USER_ENDPOINT}${userId}`
          )
          if (response.data?.status && response.data.data) {
            const userData = response.data.data
            localStorage.setItem(USER_KEY, JSON.stringify(userData))
            setUser(userData)
          } else {
            console.error('Error fetching user data:', response)
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    const authData = localStorage.getItem(AUTH_KEY)
    if (authData) {
      const { token, userId } = JSON.parse(authData)
      setToken(token)
      fetchUser(userId)
    }
  }, [])

  const formatUser = (user: User | null) => {
    if (!user) return 'N/A'
    return (
      <span>
        <span style={{ color: 'black' }}>
          {user.firstName} {user.lastName}
        </span>
        <span className="text-blue-900"> ({user.roleName})</span>
      </span>
    )
  }

  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      localStorage.clear()
      navigate('/login')
    }
  }

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">
        <div className="flex items-center">
          <Icon icon="mingcute:logout" className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </div>
      </Menu.Item>
    </Menu>
  )

  return token ? (
    <div>
      <div className="hidden md:block bg-gray-100 md:bg-white w-full text-text-black">
        <div className="w-full px-4 mx-auto">
          <div className="flex flex-wrap -mx-3.75">
            <div className="flex-1 basis-0 max-w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center md:h-20">
                  {/* <img src="" alt="Logo" /> */}
                  <div className="md:mt-[3px] sherpa-bold font-bold text-[20px] leading-[16px] text-logo-color tracking-[0.4px]">
                    Logo here
                  </div>
                </div>
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <div className="cursor-pointer flex gap-2.5 items-center">
                    {user && <div className="mr-2">Hi, {formatUser(user)}</div>}
                    <Icon icon="mingcute:down-fill" />
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:hidden items-center justify-between w-full px-10 py-2">
        <div className="text-xs">Logo here</div>
        <Dropdown overlay={userMenu} trigger={['click']}>
          <div className="flex items-center cursor-pointer">
            {user && <div className="mr-2 text-xs">Hi, {formatUser(user)}</div>}
            <img src={emptyImage} alt="User Avatar" className="w-6 h-6" />
          </div>
        </Dropdown>
      </div>
    </div>
  ) : null
}

export default Navbar

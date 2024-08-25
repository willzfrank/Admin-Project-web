import { useEffect, useState } from 'react'
import axiosInstance from '../../components/util/AxiosInstance'
import { UserData } from '../../types/global'
import SidebarLayout from '../../layouts/Sidebar'
import UserManagementContent from './UserManagementContent'

const UserManagement = () => {
  const [data, setData] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/Users/ViewAll`)
      setData(response?.data?.data)
    } catch (error) {
      console.error('Error fetching issues by users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <SidebarLayout>
      <UserManagementContent
        data={data}
        isLoading={loading}
        fetchUserData={fetchUserData}
      />
    </SidebarLayout>
  )
}

export default UserManagement

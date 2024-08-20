import { useEffect, useState } from 'react'
import axiosInstance from '../../components/util/AxiosInstance'
import IssueManagementContent from './IssueManagementContent'
import { Issue } from '../../types/global'
import SidebarLayout from '../../layouts/Sidebar'

const IssueManagement = () => {
  const [data, setData] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/Issues/ViewAll`)
      setData(response?.data?.data)
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SidebarLayout>
      <IssueManagementContent data={data} isLoading={loading} />
    </SidebarLayout>
  )
}

export default IssueManagement

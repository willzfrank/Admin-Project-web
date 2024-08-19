import { useEffect, useState } from 'react'
import axiosInstance from '../../components/util/AxiosInstance'
import IssueManagementContent from './IssueManagementContent'
import { Issue } from '../../types/global'
import SidebarLayout from '../../layouts/Sidebar'

const IssueManagement = () => {
  const [data, setData] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const savedProjectId = localStorage.getItem('selectedProject')
        const response = await axiosInstance.get(
          `/Issues/GetByProject?ProjectId=${savedProjectId}`
        )
        setData(response?.data?.data)
      } catch (error) {
        console.error('Error fetching issues by project:', error)
      } finally {
        setLoading(false) // Set loading to false after fetching completes
      }
    }

    fetchData()
  }, [])

  return (
    <SidebarLayout>
      <IssueManagementContent data={data} isLoading={loading} />
    </SidebarLayout>
  )
}

export default IssueManagement

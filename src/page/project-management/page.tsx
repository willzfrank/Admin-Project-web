import { useEffect, useState } from 'react'
import axiosInstance from '../../components/util/AxiosInstance'
import { ProjectData } from '../../types/global'
import SidebarLayout from '../../layouts/Sidebar'
import ProjectManagementContent from './ProjectManagementContent'

const ProjectManagement = () => {
  const [data, setData] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjectData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/Projects/ViewAll`)
      setData(response?.data?.data)
    } catch (error) {
      console.error('Error fetching issues by project:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectData()
  }, [])

  return (
    <SidebarLayout>
      <ProjectManagementContent
        data={data}
        isLoading={loading}
        fetchProjectData={fetchProjectData}
      />
    </SidebarLayout>
  )
}

export default ProjectManagement

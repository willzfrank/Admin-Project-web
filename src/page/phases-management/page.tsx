import { useEffect, useState } from 'react'
import axiosInstance from '../../components/util/AxiosInstance'
import { Phase } from '../../types/global'
import SidebarLayout from '../../layouts/Sidebar'
import PhasesManagementContent from './PhasesManagementContent'

const PhasesManagement = () => {
  const [data, setData] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPhasesData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/Phases/ViewAll`)
      setData(response?.data?.data)
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhasesData()
  }, [])

  return (
    <SidebarLayout>
      <PhasesManagementContent
        data={data}
        isLoading={loading}
        fetchPhasesData={fetchPhasesData}
      />
    </SidebarLayout>
  )
}

export default PhasesManagement

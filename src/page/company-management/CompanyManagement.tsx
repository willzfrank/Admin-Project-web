import { useEffect, useState } from 'react'
import axiosInstance from '../../components/util/AxiosInstance'
import { Company } from '../../types/global'
import SidebarLayout from '../../layouts/Sidebar'
import CompanyManagementContent from './CompanyManagementContent'

const CompanyManagement = () => {
  const [data, setData] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

   const fetchData = async () => {
     setLoading(true)
     try {
       const response = await axiosInstance.get(`/Company/ViewAll`)
       setData(response?.data?.data)
     } catch (error) {
       console.error('Error fetching company data:', error)
     } finally {
       setLoading(false)
     }
   }


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SidebarLayout>
      <CompanyManagementContent
        data={data}
        isLoading={loading}
        fetchData={fetchData}
      />
    </SidebarLayout>
  )
}

export default CompanyManagement

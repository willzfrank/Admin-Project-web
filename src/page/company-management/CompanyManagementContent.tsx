import { useState } from 'react'
import { Table, Spin } from 'antd'
import toast from 'react-hot-toast'
import { SortOrder } from 'antd/lib/table/interface'
import { LoadingOutlined } from '@ant-design/icons'
import { Company } from '../../types/global'
import { formatDate } from '../../components/util/formatdate'
import axiosInstance from '../../components/util/AxiosInstance'
import Button from '../../components/commons/Button'
import Modal from '../../components/Modals/Modal'
import BackArrow from '../../components/commons/BackArrow'
import CreateCompanyModal from '../../components/Modals/company/CreateCompanyModal'
import CompanyActions from '../../components/CompanyActions'
import CompanyDetailsModal from '../../components/Modals/company/CompanyDetailsModal'
import { useBackButton } from '../../Hooks/useBackButton'
import EditCompanyModal from '../../components/Modals/company/EditCompanyModal'

interface Props {
  data: Company[]
  isLoading: boolean
  fetchData: () => void
}

const CompanyManagementContent: React.FC<Props> = ({
  data,
  isLoading,
  fetchData,
}) => {
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)

  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [companyDetails, setCompanyDetails] = useState<Company>()
  const [isCompanyOpen, setIsCompanyOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false)
  const [editProject, setIsEditProject] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [newCompany, setNewCompany] = useState({
    name: '',
    namePrefix: '',
    description: '',
    email: '',
    phoneNumber: '',
    documents: [],
  })

  const { handleBackButton, ripplePosition } = useBackButton()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewCompany((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleCompanyDetails = (id: string) => {
    setIsModalDetailsOpen(true)
    setSelectedCode(id)
    if (id) {
      getCompanyDetails(id)
    }
  }

  const handleEditCompanyDetails = (id: string) => {
    setIsEditProject(true)
    const companyToEdit = data.find((company) => company.id === id)
    if (companyToEdit) {
      setEditingCompany(companyToEdit)
    }
  }

  const handleModalDetailsClose = () => {
    setIsModalDetailsOpen(false)
    setSelectedCode(null)
    setCompanyDetails(undefined)
  }

  const getCompanyDetails = async (id: string) => {
    setIsModalDetailsOpen(true)
    setSelectedCode(id)
    if (id) {
      try {
        setIsClosedLoading(true)
        const response = await axiosInstance.get(
          `/Company/ViewById?CompanyId=${id}`
        )
        setCompanyDetails(response.data.data)
      } catch (error) {
        toast.error('Failed to fetch company details. Please try again.')
        setError('Failed to fetch company details. Please try again later.')
      } finally {
        setIsClosedLoading(false)
      }
    }
  }

  const handleStatusToggle = async (companyId: string) => {
    try {
      const response = await axiosInstance.get(`/Company/Status/Toggle`, {
        params: {
          CompanyId: companyId,
        },
      })
      if (response.status === 200) {
        toast.success('Company status toggled successfully')
        fetchData()
      } else {
        toast.error('Failed to toggle company status')
      }
    } catch (error) {
      toast.error('An error occurred while toggling the company status')
    }
  }

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Company Name</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Company, b: Company) =>
        a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Company Code</div>,
      dataIndex: 'code',
      key: 'code',
      sorter: (a: Company, b: Company) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 flex items-center justify-center  px-6 font-medium">
          {text}
        </span>
      ),
    },

    {
      title: <div style={{ textAlign: 'center' }}>Date Created</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Company, b: Company) =>
        a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>,
      dataIndex: 'isActive', // Change to 'isActive' to match the data property
      key: 'isActive',
      sorter: (a: Company, b: Company) =>
        a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1,
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (isActive: boolean) => (
        <span
          className={`py-4 text-xs font-medium flex items-center justify-center px-6 ${
            isActive ? 'text-blue-500' : 'text-amber-700'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (record: Company) => (
        <span className="text-xs py-4 p-6 font-medium">
          <CompanyActions
            companyId={record.id}
            handleCompanyDetails={() => handleCompanyDetails(record.id)}
            handleEditCompany={() => {
              handleEditCompanyDetails(record.id)
              setIsEditProject(true)
            }}
            isActive={record.isActive}
            onStatusToggle={() => handleStatusToggle(record.id)}
          />
        </span>
      ),
    },
  ]

  const handleSubmit = async () => {
    const { name, namePrefix, description, email, phoneNumber } = newCompany

    if (!name || !namePrefix || !description || !email || !phoneNumber) {
      toast.error('All fields are required')
      setIsSubmitting(false)
      return
    }
    setIsSubmitting(true)
    try {
      await axiosInstance.post('/Company/Create', {
        ...newCompany,
        documents: [],
      })

      setIsCompanyOpen(false)
      toast.success('Company created successfully')
    } catch (error) {
      toast.error('Error creating company')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCompany = async () => {
    if (!editingCompany) return

    setIsEditingSubmitting(true)
    try {
      const response = await axiosInstance.post('/Company/Update', {
        id: editingCompany.id,
        name: editingCompany.name,
        description: editingCompany.description,
        email: editingCompany.email,
        phoneNumber: editingCompany.phoneNumber,
        documents: editingCompany.documents || [],
      })

      if (response.status === 200) {
        toast.success('Company updated successfully')
        setIsEditProject(false)
        fetchData()
      } else {
        toast.error('Failed to update company')
      }
    } catch (error) {
      toast.error('Error updating company')
    } finally {
      setIsEditingSubmitting(false)
    }
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between w-full cursor-pointer">
        <BackArrow
          handleBackButton={handleBackButton}
          ripplePosition={ripplePosition}
          title="Company Management"
        />
        <div
          className="px-5 py-2.5 mb-5 border"
          onClick={() => setIsCompanyOpen(true)}
        >
          Add New Company
        </div>
      </div>
      <div className="bg-gray-200 w-full md:p-8 p-4 pb-2 mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              className="text-black"
              size="large"
            />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No company found.</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ position: ['bottomRight'], pageSize: 100 }}
              scroll={{ x: 800 }}
            />
          </div>
        )}
      </div>

      {/* COMPANY DETAILS MODAL */}
      <CompanyDetailsModal
        isModalDetailsOpen={isModalDetailsOpen}
        handleModalDetailsClose={handleModalDetailsClose}
        isClosedLoading={isClosedLoading}
        companyDetails={companyDetails}
      />

      {/* ADD NEW COMPANY */}
      <CreateCompanyModal
        isCompanyOpen={isCompanyOpen}
        handleSubmit={handleSubmit}
        setIsCompanyOpen={setIsCompanyOpen}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        newCompany={newCompany}
      />

      {/* EDIT PROJECT */}
      <EditCompanyModal
        editProject={editProject}
        setIsEditProject={setIsEditProject}
        editingCompany={editingCompany}
        setEditingCompany={setEditingCompany}
        isEditingSubmitting={isEditingSubmitting}
        handleUpdateCompany={handleUpdateCompany}
      />
    </div>
  )
}

export default CompanyManagementContent

import React, { useEffect, useState } from 'react'
import { Table, Spin } from 'antd'
import toast from 'react-hot-toast'
import { SortOrder } from 'antd/lib/table/interface'
import { LoadingOutlined } from '@ant-design/icons'
import {
  Issue,
  ProjectData,
  Phase,
  ProjectStatusType,
} from '../../types/global'
import { formatDate } from '../../components/util/formatdate'
import axiosInstance from '../../components/util/AxiosInstance'
import Button from '../../components/commons/Button'
import Modal from '../../components/Modals/Modal'
import BackArrow from '../../components/commons/BackArrow'
import { useBackButton } from '../../Hooks/useBackButton'
import PhasesAction from '../../components/PhasesAction'
import { getStatusClass } from '../../components/util/getStatusClassName'
import AddnewPhaseModal from '../../components/Modals/phase/AddNewPhaseModal'
import { USER_KEY } from '../../components/util/constant'
import { v4 as uuidv4 } from 'uuid'
import EditPhaseModal from '../../components/Modals/phase/EditPhaseModal'
import PhaseDetailsModal from '../../components/Modals/phase/PhaseDetailsModal'

interface Props {
  data: Phase[]
  isLoading: boolean
  fetchPhasesData: () => Promise<void>
}

// const getStatusClass = (status: IssueStatusType): string => {
//   switch (status) {
//     case 'Unresolved':
//       return 'text-amber-700'
//     case 'Resolved':
//       return 'text-blue-500'
//     default:
//       return 'text-black-200'
//   }
// }

const PhasesManagementContent: React.FC<Props> = ({
  data,
  isLoading,
  fetchPhasesData,
}) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)
  const [phaseEditOpen, setPhaseEditOpen] = useState<boolean>(false)

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [phaseDetails, setPhaseDetails] = useState<Phase>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchProjectLoading, setIsFetchProjectLoading] = useState(false)
  const [phaseModalOpen, setPhaseModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [editIngPhaseData, setEditingPhaseData] = useState<Phase>()
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false)

  const [projects, setProjects] = useState<ProjectData[]>([])
  const [newPhase, setNewPhase] = useState({
    name: '',
    description: '',
    projectId: '',
    status: '',
    documents: [] as File[],
  })

  const { handleBackButton, ripplePosition } = useBackButton()

  const fetchProjects = async () => {
    setIsFetchProjectLoading(true)
    try {
      const response = await axiosInstance.get<{ data: ProjectData[] }>(
        '/Projects/ViewAll'
      )
      setProjects(response?.data?.data)
    } catch (error) {
      console.error('Error fetching phases:', error)
      toast.error('Failed to fetch phases. Please try again.')
    } finally {
      setIsFetchProjectLoading(false)
    }
  }

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setNewPhase({
      ...newPhase,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleResolvePhase = (PhaseId: string) => {
    setIsResolveModalOpen(true)
    setSelectedPhaseId(PhaseId)
  }

  const handleModalClose = () => {
    setIsResolveModalOpen(false)
    setSelectedPhaseId(null)
  }

  const handlePhaseDetails = (code: string) => {
    setIsModalDetailsOpen(true)
    setSelectedCode(code)
    if (code) {
      fetchData(code)
    }
  }

  const handleModalDetailsClose = () => {
    setIsModalDetailsOpen(false)
    setSelectedCode(null)
    setPhaseDetails(undefined)
  }

  const handleModalEditClose = () => {
    setPhaseEditOpen(false)
  }

  const handleEditPhase = (id: string) => {
    setPhaseEditOpen(true)
    const phaseToEdit = data.find((phase) => phase.id === id)
    if (phaseToEdit) {
      setEditingPhaseData(phaseToEdit)
    }
  }

  const handleClosePhase = async () => {
    if (!selectedPhaseId) return
    setIsClosedLoading(true)
    try {
      const response = await axiosInstance.get(
        `/Phases/Close?PhaseId=${selectedPhaseId}`
      )

      if (response.status === 200) {
        toast.success('Phase closed successfully')
        setIsResolveModalOpen(false)
        fetchPhasesData()
      }
    } catch (error) {
      toast.error('Failed to close the phase. Please try again.')
    } finally {
      setIsClosedLoading(false)
    }
  }

  const fetchData = async (code: string) => {
    try {
      setIsClosedLoading(true)
      const response = await axiosInstance.get(`/Phases/GetByCode?code=${code}`)
      setPhaseDetails(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.')
      setError('Failed to fetch activity log. Please try again later.')
    } finally {
      setIsClosedLoading(false)
    }
  }

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Created on</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Phase, b: Phase) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Phase</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Phase, b: Phase) =>
        (a?.name || '').localeCompare(b?.name || ''),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 flex px-6 items-center justify-center font-medium">
          {text || 'N/A'}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Company</div>,
      dataIndex: ['company', 'name'],

      key: 'company',
      sorter: (a: Phase, b: Phase) =>
        (a.company?.name || 'N/A').localeCompare(b.company?.name || 'N/A'),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 flex items-center justify-center  px-6 font-medium">
          {text || 'N/A'}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: Phase, b: Phase) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: ProjectStatusType) => (
        <span
          className={`py-4 text-xs font-medium px-6 flex items-center justify-center ${getStatusClass(
            text
          )}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (record: Phase) => (
        <span className="text-xs py-4 p-6 font-medium">
          <PhasesAction
            PhaseId={record.id}
            phasesStatus={record.status}
            handleResolvePhase={() => handleResolvePhase(record.id)}
            handlePhaseDetails={() => handlePhaseDetails(record.code)}
            handleEditPhases={() => {
              handleEditPhase(record.id)
            }}
          />
        </span>
      ),
    },
  ]

  const uploadFile = async (file: File): Promise<string | undefined> => {
    if (!userId) {
      toast.error('User not found. Please log in again.')
      return
    }
    const formData = new FormData()
    formData.append('Id', uuidv4())
    formData.append('File', file)
    formData.append('UserId', userId)
    formData.append('Kind', 'Phase')

    try {
      const response = await axiosInstance.post('/Documents/Upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.status) {
        return response.data.data.id
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(`Failed to upload ${file.name}`)
    }
  }

  const validateForm = () => {
    const { name, description, status } = newPhase
    return name && description && status
  }

  const clearForm = () => {
    setNewPhase({
      name: '',
      description: '',
      projectId: '',
      status: '',
      documents: [],
    })
    setUploadedFiles([])
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const { name, description, status, projectId } = newPhase

      let documentIds: string[] = []

      // Only upload documents if there are any
      if (uploadedFiles.length > 0) {
        const uploadPromises = uploadedFiles.map((file) => uploadFile(file))
        const uploadResults = await Promise.all(uploadPromises)
        documentIds = uploadResults.filter(
          (id): id is string => id !== undefined
        )
      }

      // Create an object with the form data
      const phaseData = {
        name,
        description,
        status,
        projectId,
        documents: documentIds,
      }

      // Send the data as JSON
      const response = await axiosInstance.post('/Phases/Create', phaseData)

      if (response.status === 201 || 200) {
        toast.success('Phase created successfully')
        clearForm()
        setPhaseModalOpen(false)
        fetchPhasesData()
      }
    } catch (error) {
      toast.error('Failed to create the phase. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePhase = async () => {
    if (!setEditingPhaseData) return

    setIsEditingSubmitting(true)
    try {
      const response = await axiosInstance.post('/Phases/Update', {
        id: editIngPhaseData?.id,
        name: editIngPhaseData?.name,
        description: editIngPhaseData?.description,
        projectId: editIngPhaseData?.projectId,
        status: editIngPhaseData?.status,
        documents: [],
      })

      if (response.status === 200 || 201) {
        toast.success('Phase updated successfully')
        setPhaseEditOpen(false)
        fetchPhasesData()
      } else {
        toast.error('Failed to update phase')
      }
    } catch (error) {
      toast.error('Error updating phase')
    } finally {
      setIsEditingSubmitting(false)
    }
  }

  useEffect(() => {
    if (phaseModalOpen || phaseEditOpen) {
      fetchProjects()
    }
  }, [phaseModalOpen, phaseEditOpen])

  useEffect(() => {
    const authDataString = localStorage.getItem(USER_KEY)
    if (authDataString) {
      const authData = JSON.parse(authDataString)
      setUserId(authData.id)
    }
  }, [])

  return (
    <div className="px-4">
      <div className="flex items-center justify-between w-full">
        <BackArrow
          handleBackButton={handleBackButton}
          ripplePosition={ripplePosition}
          title="Phases"
        />
        <div
          className="px-5 py-2.5 mb-5 border  cursor-pointer"
          onClick={() => setPhaseModalOpen(true)}
        >
          Add New Phase
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
          <p className="text-center text-gray-600 py-8">No issues found.</p>
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

      <Modal isOpen={isResolveModalOpen} onClose={handleModalClose}>
        <p className="text-center md:text-base text-sm">
          Are you sure you want to mark this as resolved?
        </p>
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            text="No, Go Back"
            shade="dark"
            buttonType="default"
            type="button"
            size="small"
            action={handleModalClose}
            className="gap-2 border border-black text-xs md:text-sm text-black w-max"
          />
          <Button
            text={isClosedLoading ? 'Processing...' : 'Yes, Proceed'}
            buttonType="secondary"
            isLoading={isClosedLoading}
            type="button"
            action={handleClosePhase}
            size="small"
            className="w-max gap-2 bg-black text-xs md:text-sm text-white"
          />
        </div>
      </Modal>

      <PhaseDetailsModal
        handleModalDetailsClose={handleModalDetailsClose}
        isModalDetailsOpen={isModalDetailsOpen}
        isClosedLoading={isClosedLoading}
        phaseDetails={phaseDetails}
      />

      {/* EDIT */}

      <EditPhaseModal
        phaseEditOpen={phaseEditOpen}
        handleModalEditClose={handleModalEditClose}
        setPhaseEditOpen={setPhaseEditOpen}
        isFetchProjectLoading={isFetchProjectLoading}
        setEditingPhaseData={setEditingPhaseData}
        editIngPhaseData={editIngPhaseData}
        projects={projects}
        handleUpdatePhase={handleUpdatePhase}
        isEditingSubmitting={isEditingSubmitting}
      />

      <AddnewPhaseModal
        phaseModalOpen={phaseModalOpen}
        setPhaseModalOpen={setPhaseModalOpen}
        handleChange={handleChange}
        newPhase={newPhase}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleFileChange={handleFileChange}
        projects={projects}
        uploadedFiles={uploadedFiles}
        isFetchProjectLoading={isFetchProjectLoading}
      />
    </div>
  )
}

export default PhasesManagementContent

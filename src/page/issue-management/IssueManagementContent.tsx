import React, { useEffect, useState } from 'react'
import { Table, Spin } from 'antd'
import toast from 'react-hot-toast'
import { SortOrder } from 'antd/lib/table/interface'
import { LoadingOutlined } from '@ant-design/icons'
import { Issue, IssueStatusType, Phase, SeverityType } from '../../types/global'
import { formatDate } from '../../components/util/formatdate'
import axiosInstance from '../../components/util/AxiosInstance'
import Button from '../../components/commons/Button'
import Modal from '../../components/Modals/Modal'
import BackArrow from '../../components/commons/BackArrow'
import IssueActions from '../../components/IssueAction'
import { useBackButton } from '../../Hooks/useBackButton'
import AddnewIssuesModal from '../../components/Modals/Issues/AddNewIssuesModal'
import IssueDetailsModal from '../../components/Modals/Issues/IssueDetailsModal'
import { v4 as uuidv4 } from 'uuid'
import { USER_KEY } from '../../components/util/constant'
import EditIssueModal from '../../components/Modals/Issues/EditIssueModal'

interface IssueManagementContentProps {
  data: Issue[]
  isLoading: boolean
  fetchIssues: () => Promise<void>
}

const getSeverityClass = (severity: SeverityType): string => {
  switch (severity) {
    case 'Informational':
      return 'text-black'
    case 'Warning':
      return 'text-orange-500'
    case 'Critical':
      return 'text-red-500'
    default:
      return 'text-black-200'
  }
}

const getStatusClass = (status: IssueStatusType): string => {
  switch (status) {
    case 'Unresolved':
      return 'text-amber-700'
    case 'Resolved':
      return 'text-blue-500'
    default:
      return 'text-black-200'
  }
}

const IssueManagementContent: React.FC<IssueManagementContentProps> = ({
  data,
  isLoading,
  fetchIssues,
}) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [issueDetails, setIssueDetails] = useState<Issue>()
  const [issueDetailsOpen, setIssueDetailsOpen] = useState<boolean>(false)
  const [issueEditOpen, setIssueEditOpen] = useState<boolean>(false)
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchPhaseLoading, setIsFetchPhaseLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [editIssueData, setEditingData] = useState<Issue>()

  const [phases, setPhases] = useState<Phase[]>([])
  const [newIssue, setNewIssue] = useState({
    name: '',
    description: '',
    phaseId: '',
    severity: '',
    documents: [] as File[],
  })

  const { handleBackButton, ripplePosition } = useBackButton()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const fetchPhases = async () => {
    setIsFetchPhaseLoading(true)
    try {
      const response = await axiosInstance.get<{ data: Phase[] }>(
        '/Phases/ViewAll'
      )
      setPhases(response?.data?.data)
    } catch (error) {
      console.error('Error fetching phases:', error)
      toast.error('Failed to fetch phases. Please try again.')
    } finally {
      setIsFetchPhaseLoading(false)
    }
  }

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setNewIssue({
      ...newIssue,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleResolveIssue = (issueId: string) => {
    setIsResolveModalOpen(true)
    setSelectedIssueId(issueId)
  }

  const handleModalClose = () => {
    setIsResolveModalOpen(false)
    setSelectedIssueId(null)
  }

  const handleIssueDetails = (code: string) => {
    setIsModalDetailsOpen(true)
    setSelectedCode(code)
    if (code) {
      fetchData(code)
    }
  }

  const handleModalDetailsClose = () => {
    setIsModalDetailsOpen(false)
    setSelectedCode(null)
    setIssueDetails(undefined)
  }

  const handleModalEditClose = () => {
    setIssueEditOpen(false)
  }

  const handleEditIssue = (id: string) => {
    setIssueEditOpen(true)
    const issueToEdit = data.find((issue) => issue.id === id)
    if (issueToEdit) {
      setEditingData(issueToEdit)
    }
  }

  const handleCloseIssue = async () => {
    if (!selectedIssueId) return
    setIsClosedLoading(true)
    try {
      const response = await axiosInstance.get(
        `/Issues/Close?IssueId=${selectedIssueId}`
      )

      if (response.status === 200) {
        toast.success('Issue closed successfully')
        setIsResolveModalOpen(false)
        fetchIssues()
      }
    } catch (error) {
      toast.error('Failed to close the issue. Please try again.')
    } finally {
      setIsClosedLoading(false)
    }
  }

  const fetchData = async (code: string) => {
    try {
      setIsClosedLoading(true)
      const response = await axiosInstance.get(`/Issues/GetByCode?code=${code}`)
      setIssueDetails(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.')
      setError('Failed to fetch activity log. Please try again later.')
    } finally {
      setIsClosedLoading(false)
    }
  }

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Date</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Issue, b: Issue) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-end justify-end font-medium">
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Issue</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Issue, b: Issue) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 flex items-end justify-end  px-6 font-medium">
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Phase</div>,
      dataIndex: ['phase', 'name'],
      key: 'phase',
      sorter: (a: Issue, b: Issue) =>
        (a.phase?.name || '').localeCompare(b.phase?.name || ''),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 font-medium">{text || 'N/A'}</span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Severity</div>,
      dataIndex: 'severity',
      key: 'severity',
      sorter: (a: Issue, b: Issue) => a.severity.localeCompare(b.severity),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: SeverityType) => (
        <span
          className={`py-4 text-xs flex items-center justify-center  font-medium px-6 ${getSeverityClass(
            text
          )}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: Issue, b: Issue) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: IssueStatusType) => (
        <span
          className={`py-4 text-xs font-medium px-6 ${getStatusClass(text)}`}
        >
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (record: Issue) => (
        <span className="text-xs py-4 p-6 font-medium">
          <IssueActions
            issueId={record.id}
            issueStatus={record.status}
            handleResolveIssue={() => handleResolveIssue(record.id)}
            handleIssueDetails={() => handleIssueDetails(record.code)}
            handleEditIssues={() => {
              handleEditIssue(record.id)
            }}
          />
        </span>
      ),
    },
  ]

  const handleUpdateIssue = async () => {
    if (!setEditingData) return

    setIsEditingSubmitting(true)
    try {
      const response = await axiosInstance.post('/Issues/Update', {
        id: editIssueData?.id,
        name: editIssueData?.name,
        description: editIssueData?.description,
        phaseId: editIssueData?.phaseId,
        severity: editIssueData?.severity,
        documents: [],
      })

      if (response.status === 200) {
        toast.success('Issue updated successfully')
        setIssueEditOpen(false)
        fetchIssues()
      } else {
        toast.error('Failed to update issue')
      }
    } catch (error) {
      toast.error('Error updating issue')
    } finally {
      setIsEditingSubmitting(false)
    }
  }

  const validateForm = () => {
    const { name, description, phaseId, severity } = newIssue
    return name && description && phaseId && severity
  }

  const clearForm = () => {
    setNewIssue({
      name: '',
      description: '',
      phaseId: '',
      severity: '',
      documents: [],
    })
    setUploadedFiles([])
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const { name, description, phaseId, severity } = newIssue

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
      const issueData = {
        name,
        description,
        phaseId,
        severity,
        documents: documentIds,
      }

      const response = await axiosInstance.post('/Issues/Create', issueData)

      if (response.status === 200 || 201) {
        toast.success('Issue created successfully')
        clearForm()
        setIssueDetailsOpen(false)
        fetchIssues()
      }
    } catch (error) {
      toast.error('Failed to create the issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Modify the uploadFile function to return the document ID
  const uploadFile = async (file: File): Promise<string | undefined> => {
    if (!userId) {
      toast.error('User not found. Please log in again.')
      return
    }
    const formData = new FormData()
    formData.append('Id', uuidv4())
    formData.append('File', file)
    formData.append('UserId', userId)
    formData.append('Kind', 'Issue')

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

  useEffect(() => {
    if (issueDetailsOpen || issueEditOpen) {
      fetchPhases()
    }
  }, [issueDetailsOpen, issueEditOpen])

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
          title="Issues"
        />
        <p
          className="px-2.5 md:px-5 py-1.5 md:py-2.5 mb-0 md:mb-5 border  text-xs md:text-base cursor-pointer"
          onClick={() => setIssueDetailsOpen(true)}
        >
          Add New Issue
        </p>
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
            action={handleCloseIssue}
            size="small"
            className="w-max gap-2 bg-black text-xs md:text-sm text-white"
          />
        </div>
      </Modal>

      <IssueDetailsModal
        handleModalDetailsClose={handleModalDetailsClose}
        isModalDetailsOpen={isModalDetailsOpen}
        isClosedLoading={isClosedLoading}
        issueDetails={issueDetails}
      />

      <EditIssueModal
        issueEditOpen={issueEditOpen}
        setIssueEditOpen={setIssueEditOpen}
        isFetchPhaseLoading={isFetchPhaseLoading}
        setEditingData={setEditingData}
        editIssueData={editIssueData}
        phases={phases}
        handleModalEditClose={handleModalEditClose}
        handleUpdateIssue={handleUpdateIssue}
        isEditingSubmitting={isEditingSubmitting}
      />

      <AddnewIssuesModal
        issueDetailsOpen={issueDetailsOpen}
        setIssueDetailsOpen={setIssueDetailsOpen}
        handleChange={handleChange}
        newIssue={newIssue}
        phases={phases}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleFileChange={handleFileChange}
        isFetchPhaseLoading={isFetchPhaseLoading}
        uploadedFiles={uploadedFiles}
      />
    </div>
  )
}

export default IssueManagementContent

import React, { ChangeEvent, useEffect, useState } from 'react'
import { Table, Spin } from 'antd'
import toast from 'react-hot-toast'
import { SortOrder } from 'antd/lib/table/interface'
import { LoadingOutlined } from '@ant-design/icons'
import {
  ProjectData,
  NewProjectData,
  ProjectStatusType,
} from '../../types/global'
import { formatDate } from '../../components/util/formatdate'
import axiosInstance from '../../components/util/AxiosInstance'
import Button from '../../components/commons/Button'
import Modal from '../../components/Modals/Modal'
import BackArrow from '../../components/commons/BackArrow'
import { useBackButton } from '../../Hooks/useBackButton'
import ProjectAction from '../../components/ProjectAction'
import CreateProjectModal from '../../components/Modals/projects/CreateProjectModal'
import EditProjectModal from '../../components/Modals/projects/EditProjectModal'
import { getStatusClass } from '../../components/util/getStatusClassName'
import { v4 as uuidv4 } from 'uuid'
import { USER_KEY } from '../../components/util/constant'

interface Props {
  data: ProjectData[]
  fetchProjectData: any
  isLoading: boolean
}

const ProjectManagementContent: React.FC<Props> = ({
  data,
  isLoading,
  fetchProjectData,
}) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [projectDetails, setProjectDetails] = useState<ProjectData>()
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchCompanyLoading, setIsFetchCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState<NewProjectData>({
    name: '',
    description: '',
    status: 'Todo',
    companyId: '',
    documents: [],
  })

  const { handleBackButton, ripplePosition } = useBackButton()

  const fetchCompanies = async () => {
    setIsFetchCompanyLoading(true)
    try {
      const response = await axiosInstance.get('/Company/ViewAll')
      setCompanies(
        response.data.data.map((company: any) => ({
          id: company.id,
          name: company.name,
        }))
      )
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Failed to fetch companies. Please try again.')
    } finally {
      setIsFetchCompanyLoading(false)
    }
  }

  const handleFileChange = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleEditProject = (id: string) => {
    setIsEditModalOpen(true)
    fetchCompanies()

    const projectToEdit = data.find((project) => project.id === id)
    if (projectToEdit) {
      setEditingProject({
        ...projectToEdit,
        documents: projectToEdit.documents || [],
      })
    } else {
      toast.error('Project not found.')
      setIsEditModalOpen(false)
    }
  }

  const handleEditInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditingProject((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleResolveIssue = (issueId: string) => {
    setIsResolveModalOpen(true)
    setSelectedIssueId(issueId)
  }

  const handleModalClose = () => {
    setIsResolveModalOpen(false)
    setSelectedIssueId(null)
  }

  const handleProjectDetails = (code: string) => {
    setIsModalDetailsOpen(true)
    setSelectedCode(code)
    if (code) {
      fetchData(code)
    }
  }

  const handleModalDetailsClose = () => {
    setIsModalDetailsOpen(false)
    setSelectedCode(null)
    setProjectDetails(undefined)
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
        fetchProjectData()
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
      const response = await axiosInstance.get(
        `/Projects/GetByCode?code=${code}`
      )
      setProjectDetails(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch data. Please try again.')
      setError('Failed to fetch activity log. Please try again later.')
    } finally {
      setIsClosedLoading(false)
    }
  }

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Name</div>,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ProjectData, b: ProjectData) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Code</div>,
      dataIndex: 'code',
      key: 'code',
      sorter: (a: ProjectData, b: ProjectData) => a.code.localeCompare(b.code),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 flex items-center justify-center px-6 font-medium">
          {text}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Company</div>,
      dataIndex: 'company',
      key: 'company',
      render: (company: { name: string; code: string }) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {company ? company.name : 'N/A'}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Created On</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: ProjectData, b: ProjectData) =>
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
      dataIndex: 'status',
      key: 'status',
      sorter: (a: ProjectData, b: ProjectData) =>
        a.status.localeCompare(b.status),
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
      render: (record: ProjectData) => (
        <span className="text-xs py-4 p-6 font-medium flex items-center justify-center">
          <ProjectAction
            projectId={record.id}
            status={record.status}
            handleResolveIssue={() => handleResolveIssue(record.id)}
            handleProjectDetails={() => handleProjectDetails(record.code)}
            handleEditProject={() => {
              handleEditProject(record.id)
            }}
            refreshData={fetchProjectData}
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
    formData.append('Kind', 'Project')

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

  const isFormValid = (): boolean => {
    return (
      newProject.name?.trim() !== '' &&
      newProject.description?.trim() !== '' &&
      newProject.supervisorId?.trim() !== '' &&
      newProject.companyId?.trim() !== ''
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)

    let documentIds: string[] = []

    // Only upload documents if there are any
    if (uploadedFiles.length > 0) {
      const uploadPromises = uploadedFiles.map((file) => uploadFile(file))
      const uploadResults = await Promise.all(uploadPromises)
      documentIds = uploadResults.filter((id): id is string => id !== undefined)
    }
    try {
      const projectPayload = {
        ...newProject,
        documents: documentIds,
      }
      const response = await axiosInstance.post(
        '/Projects/Create',
        projectPayload
      )
      console.log('Project created:', response.data)
      toast.success('Project created successfully')
      setProjectModalOpen(false)
      fetchProjectData()
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditFormValid = (): boolean => {
    return editingProject
      ? editingProject.name.trim() !== '' &&
          editingProject.description.trim() !== '' &&
          editingProject.companyId.trim() !== ''
      : false
  }

  const handleUpdate = async () => {
    if (!isEditFormValid()) {
      toast.error('Please fill in all required fields.')
      return
    }

    setIsEditSubmitting(true)
    try {
      const response = await axiosInstance.post('/Projects/Update', {
        id: editingProject?.id,
        name: editingProject?.name,
        description: editingProject?.description,
        status: editingProject?.status,
        companyId: editingProject?.companyId,
        documents: [],
      })
      console.log('Project updated:', response.data)
      toast.success('Project updated successfully')
      setIsEditModalOpen(false)
      setTimeout(() => {
        fetchProjectData()
      }, 1000)
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project. Please try again.')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  useEffect(() => {
    if (projectModalOpen) {
      fetchCompanies()
    }
  }, [projectModalOpen])

  useEffect(() => {
    const authDataString = localStorage.getItem(USER_KEY)
    if (authDataString) {
      const authData = JSON.parse(authDataString)
      setUserId(authData.id)
    }
  }, [])

  return (
    <div className="px-4">
      <div className="flex items-center justify-between w-full cursor-pointer">
        <BackArrow
          handleBackButton={handleBackButton}
          ripplePosition={ripplePosition}
          title="Project Management"
        />
        <div
          className="px-5 py-2.5 mb-5 border"
          onClick={() => setProjectModalOpen(true)}
        >
          Add New Project
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
          <p className="text-center text-gray-600 py-8">No projects found.</p>
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

      <Modal isOpen={isModalDetailsOpen} onClose={handleModalDetailsClose}>
        {isClosedLoading ? (
          <div className="flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              className="text-black"
              size="large"
            />
          </div>
        ) : (
          <div>
            <h2 className="text-left md:text-base text-sm font-bold mb-5 md:mb-10">
              Project Details
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Company<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Plumbing"
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB] cursor-not-allowed outline-none"
                    value={projectDetails?.company?.name || ''}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Name<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Invalid configuration"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB] cursor-not-allowed outline-none"
                    value={projectDetails?.name}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  placeholder="Mismatch in issue number"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB] cursor-not-allowed outline-none resize-none"
                  value={projectDetails?.description}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
                {/* <div className="flex flex-col gap-2">
                  <h3>Media</h3>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2">
                      <Link
                        className="text-xs text-blue-800"
                        target="_blank"
                        to={`https://example.com`}
                      >
                        IMG-001.PNG
                      </Link>
                      <div className="text-xs text-red-600">Delete</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <Link
                        className="text-xs text-blue-800"
                        target="_blank"
                        to={`https://example.com`}
                      >
                        IMG-002.PNG
                      </Link>
                      <div className="text-xs text-red-600">Delete</div>
                    </div>
                  </div>
                </div> */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="severity">
                    Status<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Informational"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB] cursor-not-allowed outline-none"
                    value={projectDetails?.status}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end mt-6">
              <Button
                text="Close"
                shade="dark"
                buttonType="default"
                type="button"
                size="small"
                action={handleModalDetailsClose}
                className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ADD NEW PROJECT */}
      <CreateProjectModal
        projectModalOpen={projectModalOpen}
        setProjectModalOpen={setProjectModalOpen}
        isFetchCompanyLoading={isFetchCompanyLoading}
        handleInputChange={handleInputChange}
        newProject={newProject}
        handleModalDetailsClose={handleModalDetailsClose}
        companies={companies}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        uploadedFiles={uploadedFiles}
        handleFileChange={handleFileChange}
      />

      {/* EDIT PROJECT */}
      <EditProjectModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleEditInputChange={handleEditInputChange}
        editingProject={editingProject}
        companies={companies}
        isEditSubmitting={isEditSubmitting}
        handleUpdate={handleUpdate}
        isFetchCompanyLoading={isFetchCompanyLoading}
      />
    </div>
  )
}

export default ProjectManagementContent

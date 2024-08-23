import React, { useEffect, useState } from 'react'
import { Table, Spin } from 'antd'
import toast from 'react-hot-toast'
import { SortOrder } from 'antd/lib/table/interface'
import { LoadingOutlined } from '@ant-design/icons'
import { Issue, IssueStatusType, Phase, ProjectStatusType, SeverityType } from '../../types/global'
import { formatDate } from '../../components/util/formatdate'
import axiosInstance from '../../components/util/AxiosInstance'
import Button from '../../components/commons/Button'
import Modal from '../../components/Modals/Modal'
import BackArrow from '../../components/commons/BackArrow'
import IssueActions from '../../components/IssueAction'
import { useBackButton } from '../../Hooks/useBackButton'
import AddnewIssuesModal from '../../components/Modals/Issues/AddNewIssuesModal'
import IssueDetailsModal from '../../components/Modals/Issues/IssueDetailsModal'
import PhasesAction from '../../components/PhasesAction'
import { getStatusClass } from '../../components/util/getStatusClassName'

interface Props {
  data: Phase[]
  isLoading: boolean
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

const PhasesManagementContent: React.FC<Props> = ({ data, isLoading }) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [issueDetails, setIssueDetails] = useState<Issue>()
  const [issueDetailsOpen, setIssueDetailsOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchPhaseLoading, setIsFetchPhaseLoading] = useState(false)

  const [phases, setPhases] = useState<Phase[]>([])
  const [newIssue, setNewIssue] = useState({
    name: '',
    description: '',
    phaseId: '',
    severity: '',
    documents: [] as File[],
  })

  const { handleBackButton, ripplePosition } = useBackButton()

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewIssue({
      ...newIssue,
      documents: Array.from(e.target.files || []), // Convert FileList to array
    })
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
    setIssueDetails(undefined)
  }

  const handleClosePhase = async () => {
    if (!selectedPhaseId) return
    setIsClosedLoading(true)
    try {
      const response = await axiosInstance.get(
        `/Phases/Close?PhaseId=${selectedPhaseId}`
      )

      if (response.status === 200) {
        toast.success('Issue closed successfully')
        setIsResolveModalOpen(false)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
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
      title: <div style={{ textAlign: 'center' }}>Created on</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Phase, b: Phase) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-end justify-end font-medium">
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
        <span className="text-xs py-4 px-6 font-medium">{text || 'N/A'}</span>
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
        <span className="text-xs py-4 flex items-end justify-end px-6 font-medium">
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
          />
        </span>
      ),
    },
  ]

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
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)

    try {
      const { name, description, phaseId, severity, documents } = newIssue

      // Create an object with the form data
      const issueData = {
        name,
        description,
        phaseId,
        severity,
        documents: documents.map((file) => file.name),
      }

      // Send the data as JSON
      const response = await axiosInstance.post('/Issues/Create', issueData)

      if (response.status === 201) {
        toast.success('Issue created successfully')
        clearForm()
      }
    } catch (error) {
      toast.error('Failed to create the issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (issueDetailsOpen) {
      fetchPhases()
    }
  }, [issueDetailsOpen])

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
          onClick={() => setIssueDetailsOpen(true)}
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
              pagination={{ position: ['bottomRight'], pageSize: 10 }}
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

      <IssueDetailsModal
        handleModalDetailsClose={handleModalDetailsClose}
        isModalDetailsOpen={isModalDetailsOpen}
        isClosedLoading={isClosedLoading}
        issueDetails={issueDetails}
      />

      {/* EDIT */}

      <Modal
        isOpen={issueDetailsOpen}
        onClose={() => setIssueDetailsOpen(false)}
      >
        {isFetchPhaseLoading ? (
          <div className="flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              className="text-black"
              size="large"
            />
          </div>
        ) : (
          <div>
            <h2 className="text-left md:text-base text-sm mb-5 md:mb-10">
              Edit Issue
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Phase<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="phaseId"
                    onChange={handleChange}
                    value={newIssue.phaseId}
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="">Select Phase</option>
                    {phases.map((phase) => (
                      <option key={phase.id} value={phase.id}>
                        {phase.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Issue<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Issue"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={newIssue.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Mismatch in issue number"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB]"
                  value={newIssue.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
                <div className="flex flex-col gap-2">
                  <h3>Add Media</h3>
                  <input
                    type="file"
                    name="documents"
                    multiple
                    onChange={handleChange}
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="severity">
                    Severity<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="severity"
                    onChange={handleChange}
                    value={newIssue.severity}
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="">Select Severity</option>
                    <option value="Informational">Informational</option>
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-5 justify-end mt-6">
              <Button
                text="Close"
                shade="dark"
                buttonType="default"
                type="button"
                size="small"
                action={handleModalDetailsClose}
                className="gap-2 border border-black text-xs px-12 md:text-sm text-black"
              />

              <Button
                text={isSubmitting ? 'Submitting...' : 'Submit'}
                shade="dark"
                buttonType="default"
                type="button"
                size="small"
                action={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 border border-black text-xs px-12 md:text-sm text-black"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* <AddnewIssuesModal
        issueDetailsOpen={issueDetailsOpen}
        setIssueDetailsOpen={setIssueDetailsOpen}
        handleChange={handleChange}
        newIssue={newIssue}
        phases={phases}
        handleModalDetailsClose={handleModalDetailsClose}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleFileChange={handleFileChange}
        isFetchPhaseLoading={isFetchPhaseLoading}
      /> */}
    </div>
  )
}

export default PhasesManagementContent

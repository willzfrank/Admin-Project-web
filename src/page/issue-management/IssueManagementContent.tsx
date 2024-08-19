import React, { ChangeEvent, useEffect, useState } from 'react'
import { Table, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
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

interface Props {
  data: Issue[]
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

const IssueManagementContent: React.FC<Props> = ({ data, isLoading }) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
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
    documents: [],
  })

  const [ripplePosition, setRipplePosition] = useState<{
    x: number
    y: number
  } | null>(null)

  const navigate = useNavigate()

  const fetchPhases = async () => {
    setIsFetchPhaseLoading(true)
    try {
      const response = await axiosInstance.get<{ data: Phase[] }>(
        '/Phases/ViewAll'
      )
      // setPhases(response?.data)
    } catch (error) {
      console.error('Error fetching phases:', error)
      toast.error('Failed to fetch phases. Please try again.')
    } finally {
      setIsFetchPhaseLoading(false)
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewIssue((prev) => ({ ...prev, [name]: value }))
  }

  const handleBackButton = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setRipplePosition({ x, y })
    navigate(-1)
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
          />
        </span>
      ),
    },
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post('/Issues/Create', newIssue)
      console.log('Issue created:', response.data)
      toast.success('Issue created successfully')
      setIssueDetailsOpen(false)
      // You might want to refresh the issues list here
    } catch (error) {
      console.error('Error creating issue:', error)
      toast.error('Failed to create issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (ripplePosition) {
      const timer = setTimeout(() => {
        setRipplePosition(null)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [ripplePosition])

  useEffect(() => {
    if (issueDetailsOpen) {
      fetchPhases()
    }
  }, [issueDetailsOpen])

  return (
    <div className="px-4">
      <BackArrow
        handleBackButton={handleBackButton}
        ripplePosition={ripplePosition}
        title="Issues"
      />

      <div
        className="flex items-end justify-end w-full cursor-pointer"
        onClick={() => setIssueDetailsOpen(true)}
      >
        <div className="px-5 py-2.5 mb-5 border">Add New Issue</div>
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
              scroll={{ x: 800 }} // This ensures horizontal scrolling for the table on small screens
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
            <h2 className="text-left md:text-base text-sm mb-5 md:mb-10">
              Issue Details
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Phase<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Plumbing"
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={issueDetails?.phase?.name || ''}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Issue<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Invalid configuration"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={issueDetails?.name}
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
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB]"
                  value={issueDetails?.description}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
                <div className="flex flex-col gap-2">
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
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="severity">
                    Severity<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Informational"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={issueDetails?.severity}
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
                className="gap-2 border border-black text-xs px-12 md:text-sm text-black"
              />
            </div>
          </div>
        )}
      </Modal>

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
              New Issue
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Phase<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="phaseId"
                    onChange={handleInputChange}
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
                    placeholder="Enter Issue"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={newIssue.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  placeholder="Mismatch in issue number"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB]"
                  value={newIssue.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
                <div className="flex flex-col gap-2">
                  <h3>Add Media</h3>

                  <span>Select media files </span>
                  {/* make this dynamic if images selected */}
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
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="severity">
                    Severity<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="severity"
                    onChange={handleInputChange}
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
    </div>
  )
}

export default IssueManagementContent

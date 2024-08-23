import Modal from '../Modal'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { Issue, Phase } from '../../../types/global'
import Button from '../../commons/Button'

type EditIssueModalProps = {
  issueEditOpen: boolean
  setIssueEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  isFetchPhaseLoading: boolean
  setEditingData: React.Dispatch<React.SetStateAction<Issue | undefined>>
  editIssueData: Issue | undefined
  phases: Phase[]
  handleModalEditClose: () => void
  handleUpdateIssue: () => Promise<void>
  isEditingSubmitting: boolean
}

const EditIssueModal = ({
  issueEditOpen,
  setIssueEditOpen,
  isFetchPhaseLoading,
  setEditingData,
  editIssueData,
  phases,
  handleModalEditClose,
  handleUpdateIssue,
  isEditingSubmitting,
}: EditIssueModalProps) => {
  return (
    <>
      <Modal isOpen={issueEditOpen} onClose={() => setIssueEditOpen(false)}>
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
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                    value={editIssueData?.phaseId}
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
                    value={editIssueData?.name}
                    onChange={(e) =>
                      setEditingData((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
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
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB] resize-none"
                  value={editIssueData?.description}
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="severity">
                  Severity<span className="text-red-500"> *</span>
                </label>
                <select
                  name="severity"
                  onChange={(e) =>
                    setEditingData((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  value={editIssueData?.severity}
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                >
                  <option value="">Select Severity</option>
                  <option value="Informational">Informational</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
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
              </div> */}
            </div>

            <div className="flex items-end gap-5 justify-end mt-6">
              <Button
                text="Close"
                shade="dark"
                buttonType="default"
                type="button"
                size="small"
                action={handleModalEditClose}
                className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
              />

              <Button
                text={'Proceed'}
                shade="dark"
                loadingText="please wait..."
                buttonType="primary"
                type="button"
                size="small"
                action={handleUpdateIssue}
                disabled={isEditingSubmitting}
                isLoading={isEditingSubmitting}
                className="gap-2 border text-white text-xs px-[50px] md:text-sm bg-black"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default EditIssueModal

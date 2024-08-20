import React from 'react'
import Modal from '../Modal'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Issue, Phase } from '../../../types/global'
import Button from '../../commons/Button'

type AddnewIssuesModalProps = {
  issueDetailsOpen: boolean
  setIssueDetailsOpen: (args: boolean) => void
  isFetchPhaseLoading: boolean
  handleChange: (e: { target: { name: string; value: string } }) => void
  newIssue: any
  phases: Phase[]
  handleModalDetailsClose: () => void
  isSubmitting: boolean
  handleSubmit: () => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AddnewIssuesModal = ({
  issueDetailsOpen,
  setIssueDetailsOpen,
  isFetchPhaseLoading,
  handleChange,
  newIssue,
  phases,
  isSubmitting,
  handleModalDetailsClose,
  handleSubmit,
  handleFileChange,
}: AddnewIssuesModalProps) => {
  return (
    <>
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
          <form>
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
                    onChange={handleFileChange}
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
                type="submit"
                size="small"
                action={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 border border-black text-xs px-12 md:text-sm text-black"
              />
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

export default AddnewIssuesModal

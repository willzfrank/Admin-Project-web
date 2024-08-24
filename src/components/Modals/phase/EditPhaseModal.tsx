import Modal from '../Modal'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { Issue, Phase, ProjectData, ProjectStatusType } from '../../../types/global'
import Button from '../../commons/Button'

type EditPhaseModalProps = {
  phaseEditOpen: boolean
  setPhaseEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  isFetchProjectLoading: boolean
  setEditingPhaseData: React.Dispatch<React.SetStateAction<Phase | undefined>>
  editIngPhaseData: Phase | undefined
  projects: ProjectData[]
  handleModalEditClose: () => void
  handleUpdatePhase: () => Promise<void>
  isEditingSubmitting: boolean
}

const EditPhaseModal = ({
  phaseEditOpen,
  setPhaseEditOpen,
  isFetchProjectLoading,
  setEditingPhaseData,
  editIngPhaseData,
  projects,
  handleModalEditClose,
  handleUpdatePhase,
  isEditingSubmitting,
}: EditPhaseModalProps) => {
  return (
    <>
      <Modal isOpen={phaseEditOpen} onClose={() => setPhaseEditOpen(false)}>
        {isFetchProjectLoading ? (
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
              Edit Phase
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Project<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="projectId"
                    onChange={(e) =>
                      setEditingPhaseData((prev) => ({
                        ...prev!,
                        projectId: e.target.value,
                      }))
                    }
                    value={editIngPhaseData?.projectId}
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Name<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Phase"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={editIngPhaseData?.name}
                    onChange={(e) =>
                      setEditingPhaseData((prev) => ({
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
                  value={editIngPhaseData?.description}
                  onChange={(e) =>
                    setEditingPhaseData((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="status">
                  Status<span className="text-red-500"> *</span>
                </label>
                <select
                  name="status"
                  onChange={(e) =>
                    setEditingPhaseData((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: e.target.value as ProjectStatusType,
                          }
                        : undefined
                    )
                  }
                  value={editIngPhaseData?.status}
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                >
                  <option value="Todo">Todo</option>
                  <option value="InProgress">In Progress</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Done">Done</option>
                </select>
              </div>
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
                action={handleUpdatePhase}
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

export default EditPhaseModal

import Modal from '../Modal'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ProjectData } from '../../../types/global'
import Button from '../../commons/Button'

type AddnewPhaseModalProps = {
  setPhaseModalOpen: (args: boolean) => void
  handleChange: (e: { target: { name: string; value: string } }) => void
  newPhase?: {
    name: string
    description: string
    projectId: string
    status: string
    documents: File[]
  }
  isSubmitting: boolean
  handleSubmit: () => void
  handleFileChange: (files: File[]) => void
  uploadedFiles: File[]
  isFetchProjectLoading: boolean
  projects: ProjectData[]
  phaseModalOpen: boolean
}

const AddnewPhaseModal = ({
  setPhaseModalOpen,
  handleChange,
  newPhase,
  isSubmitting,
  handleSubmit,
  handleFileChange,
  isFetchProjectLoading,
  projects,
  uploadedFiles,
  phaseModalOpen,
}: AddnewPhaseModalProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    handleFileChange(imageFiles)
  }

  return (
    <>
      <Modal isOpen={phaseModalOpen} onClose={() => setPhaseModalOpen(false)}>
        {isFetchProjectLoading ? (
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
              New Phase
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Project<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="projectId"
                    required
                    onChange={handleChange}
                    value={newPhase?.projectId}
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="">Select Project</option>
                    {projects?.map((project) => (
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
                    required
                    placeholder="Enter Phase"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={newPhase?.name}
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
                  required
                  placeholder="Provide phase description"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB] resize-none"
                  value={newPhase?.description}
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
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm"
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-2">Files to be uploaded:</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="text-sm">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="status">
                    Status<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="status"
                    onChange={handleChange}
                    value={newPhase?.status}
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="Todo">Todo</option>
                    <option value="InProgress">In Progress</option>
                    <option value="OnHold">On Hold</option>
                    <option value="Done">Done</option>
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
                action={() => setPhaseModalOpen(false)}
                className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
              />

              <Button
                text="Proceed"
                shade="dark"
                buttonType="primary"
                isLoading={isSubmitting}
                loadingText="Proceeding..."
                type="submit"
                size="small"
                action={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 border bg-black text-xs px-[50px] md:text-sm text-white"
              />
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

export default AddnewPhaseModal

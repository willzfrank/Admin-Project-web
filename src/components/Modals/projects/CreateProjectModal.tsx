import { Spin } from 'antd'
import Modal from '../Modal'
import { LoadingOutlined } from '@ant-design/icons'
import { ChangeEvent } from 'react'
import { NewProjectData } from '../../../types/global'
import { Link } from 'react-router-dom'
import Button from '../../commons/Button'

type CreateProjectModalProps = {
  setProjectModalOpen: (args: boolean) => void
  projectModalOpen: boolean
  isFetchCompanyLoading: boolean
  newProject: NewProjectData
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  handleModalDetailsClose: () => void
  companies: { id: string; name: string }[]
  isSubmitting: boolean
  handleSubmit: () => void
  uploadedFiles: File[]
  handleFileChange: (files: File[]) => void
}

const CreateProjectModal = ({
  setProjectModalOpen,
  projectModalOpen,
  isFetchCompanyLoading,
  handleInputChange,
  uploadedFiles,
  handleFileChange,
  newProject,
  handleModalDetailsClose,
  companies,
  isSubmitting,
  handleSubmit,
}: CreateProjectModalProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    handleFileChange(imageFiles)
  }

  return (
    <>
      <Modal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      >
        {isFetchCompanyLoading ? (
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
              New Project
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Company<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="companyId"
                    onChange={handleInputChange}
                    value={newProject.companyId}
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
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
                    placeholder="Enter project name"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    value={newProject.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Provide project description"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB]"
                  value={newProject.description}
                  onChange={handleInputChange}
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
                  <label htmlFor="severity">
                    Status<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="status"
                    onChange={handleInputChange}
                    value={newProject.status}
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  >
                    <option value="Todo">Todo</option>
                    <option value="Inprogress">In Progress</option>
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
                action={handleModalDetailsClose}
                className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
              />

              <Button
                text={isSubmitting ? 'Proceeding...' : 'Proceed'}
                shade="dark"
                buttonType="primary"
                type="button"
                size="small"
                action={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="gap-2 border bg-black text-xs px-[50px] md:text-sm text-white"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default CreateProjectModal

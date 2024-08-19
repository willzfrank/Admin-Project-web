import Modal from '../Modal'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { CompanyData, ProjectData } from '../../../types/global'
import Button from '../../commons/Button'
import { ChangeEvent } from 'react'

type EditProjectModalProps = {
  isEditModalOpen: boolean
  setIsEditModalOpen: (args: boolean) => void
  isFetchCompanyLoading: boolean
  handleEditInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  editingProject: ProjectData | null
  companies: CompanyData[]
  isEditSubmitting: boolean
  handleUpdate: () => void
}

const EditProjectModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  isFetchCompanyLoading,
  handleEditInputChange,
  editingProject,
  companies,
  isEditSubmitting,
  handleUpdate,
}: EditProjectModalProps) => {
  return (
    <>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
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
              Edit Project
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="company">
                    Company<span className="text-red-500"> *</span>
                  </label>
                  <select
                    name="companyId"
                    onChange={handleEditInputChange}
                    value={editingProject?.companyId || ''}
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
                  <label htmlFor="name">
                    Name<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                    name="name"
                    value={editingProject?.name || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  placeholder="Provide project description"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB]"
                  name="description"
                  value={editingProject?.description || ''}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="status">
                  Status<span className="text-red-500"> *</span>
                </label>
                <select
                  name="status"
                  onChange={handleEditInputChange}
                  value={editingProject?.status || ''}
                  className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                >
                  <option value="Todo">Todo</option>
                  <option value="InProgress">In Progress</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              {/* <div className="flex flex-col gap-2">
                <label htmlFor="supervisorId">
                  Supervisor ID<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter supervisor ID"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  name="supervisorId"
                  value={editingProject?.supervisorId || ''}
                  onChange={handleEditInputChange}
                />
              </div> */}

              <div className="flex items-end justify-end mt-6">
                <Button
                  text="Cancel"
                  shade="dark"
                  buttonType="default"
                  type="button"
                  size="small"
                  action={() => setIsEditModalOpen(false)}
                  className="gap-2 border border-black text-xs px-12 md:text-sm text-black mr-4"
                />
                <Button
                  text={isEditSubmitting ? 'Updating...' : 'Update Project'}
                  buttonType="secondary"
                  isLoading={isEditSubmitting}
                  type="button"
                  action={handleUpdate}
                  size="small"
                  className="w-max gap-2 bg-black text-xs md:text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default EditProjectModal

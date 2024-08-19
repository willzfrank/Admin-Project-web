import React from 'react'
import Modal from '../Modal'
import Button from '../../commons/Button'
import { Company } from '../../../types/global'

type EditCompanyModalProps = {
  editProject: boolean
  setIsEditProject: (args: boolean) => void
  editingCompany: any
  setEditingCompany: React.Dispatch<React.SetStateAction<Company | null>>
  isEditingSubmitting: boolean
  handleUpdateCompany: () => void
}

const EditCompanyModal = ({
  editProject,
  setIsEditProject,
  editingCompany,
  setEditingCompany,
  isEditingSubmitting,
  handleUpdateCompany,
}: EditCompanyModalProps) => {
  return (
    <>
      <Modal isOpen={editProject} onClose={() => setIsEditProject(false)}>
        <div>
          <h2 className="text-left md:text-base text-sm mb-5 font-bold md:mb-10">
            Edit Company
          </h2>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">
                  Company Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingCompany?.name || ''}
                  onChange={(e) =>
                    setEditingCompany((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">
                  Email<span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingCompany?.email || ''}
                  onChange={(e) =>
                    setEditingCompany((prev) => ({
                      ...prev!,
                      email: e.target.value,
                    }))
                  }
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description">
                Description<span className="text-red-500"> *</span>
              </label>
              <textarea
                name="description"
                value={editingCompany?.description || ''}
                onChange={(e) =>
                  setEditingCompany((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
                className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB] resize-none"
              />
            </div>

            <div className="flex flex-col gap-2 mt-5">
              <label htmlFor="phoneNumber">
                Company Phone<span className="text-red-500"> *</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={editingCompany?.phoneNumber || ''}
                onChange={(e) =>
                  setEditingCompany((prev) => ({
                    ...prev!,
                    phoneNumber: e.target.value,
                  }))
                }
                className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
              />
            </div>
          </div>

          <div className="flex items-end gap-5 justify-end mt-6">
            <Button
              text="Close"
              shade="dark"
              buttonType="default"
              type="button"
              size="small"
              action={() => setIsEditProject(false)}
              className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
            />

            <Button
              text={isEditingSubmitting ? 'Updating...' : 'Update'}
              shade="dark"
              buttonType="primary"
              type="button"
              size="small"
              isLoading={isEditingSubmitting}
              action={handleUpdateCompany}
              disabled={isEditingSubmitting}
              className="gap-2 border bg-black text-xs px-[50px] md:text-sm text-white"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default EditCompanyModal

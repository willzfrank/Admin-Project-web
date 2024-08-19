import React from 'react'
import Modal from '../Modal'
import Button from '../../commons/Button'

interface NewCompany {
  name: string
  description: string
  email: string
  phoneNumber: string
  namePrefix: string
}

interface CreateCompanyModalProps {
  isCompanyOpen: boolean
  setIsCompanyOpen: (args: boolean) => void
  handleSubmit: () => void
  isSubmitting: boolean
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  newCompany: NewCompany
}

const CreateCompanyModal = ({
  isCompanyOpen,
  setIsCompanyOpen,
  handleSubmit,
  isSubmitting,
  handleInputChange,
  newCompany,
}: CreateCompanyModalProps) => {
  const handleNamePrefixChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 3)
    handleInputChange({
      ...event,
      target: {
        ...event.target,
        value,
        name: 'namePrefix',
      },
    })
  }
  return (
    <>
      <Modal isOpen={isCompanyOpen} onClose={() => setIsCompanyOpen(false)}>
        <div>
          <h2 className="text-left md:text-base font-bold text-sm mb-5 md:mb-5">
            Create Company
          </h2>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">
                  Company Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Maitame Inc"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  value={newCompany.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="businessRegNo">
                  Name Prefix.<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  id="namePrefix"
                  required
                  name="namePrefix"
                  placeholder="ABC"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB] uppercase"
                  value={newCompany.namePrefix}
                  onChange={handleNamePrefixChange}
                  maxLength={3}
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
                placeholder="One-of-a-kind company in the heart of Abuja"
                className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB]"
                value={newCompany.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email">
                  Company Email<span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="company@example.com"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  value={newCompany.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber">
                  Company Phone<span className="text-red-500"> *</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  placeholder="0700011011"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB]"
                  value={newCompany.phoneNumber}
                  onChange={handleInputChange}
                />
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
              action={() => setIsCompanyOpen(false)}
              className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
            />

            <Button
              text={isSubmitting ? 'Proceeding...' : 'Proceed'}
              shade="light"
              buttonType="primary"
              type="button"
              size="small"
              action={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="gap-2 border border-black bg-black text-xs px-[50px] md:text-sm text-white"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CreateCompanyModal

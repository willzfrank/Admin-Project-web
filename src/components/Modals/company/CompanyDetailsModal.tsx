import { Spin } from 'antd'
import Modal from '../Modal'
import { LoadingOutlined } from '@ant-design/icons'
import { Company } from '../../../types/global'
import Button from '../../commons/Button'

type CompanyDetailsModalProps = {
  isModalDetailsOpen: boolean
  handleModalDetailsClose: () => void
  isClosedLoading: boolean
  companyDetails?: Company
}

const CompanyDetailsModal = ({
  isModalDetailsOpen,
  handleModalDetailsClose,
  isClosedLoading,
  companyDetails,
}: CompanyDetailsModalProps) => {
  console.log('company', companyDetails)
  return (
    <>
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
              Company Details
            </h2>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-6 items-center justify-between w-full my-2.5 md:my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Company Name<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Maitama Inc"
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB] outline-none cursor-not-allowed"
                    value={companyDetails?.name || ''}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Code<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="RC or BN number"
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB] outline-none cursor-not-allowed"
                    value={companyDetails?.code || ''}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  placeholder="One-of-a-kind ompany in the heart of Abuja"
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB] outline-none cursor-not-allowed resize-none"
                  value={companyDetails?.description || ''}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Company Email<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB] outline-none cursor-not-allowed"
                    value={companyDetails?.email || ''}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phase">
                    Company Phone<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0700011011"
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB] outline-none cursor-not-allowed"
                    value={companyDetails?.phoneNumber || ''}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end justify-end mt-6 w-full ">
              <Button
                text="Close"
                shade="dark"
                buttonType="default"
                type="button"
                size="small"
                action={handleModalDetailsClose}
                className="gap-2 border border-black text-xs px-[50px] md:text-sm text-black"
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

export default CompanyDetailsModal

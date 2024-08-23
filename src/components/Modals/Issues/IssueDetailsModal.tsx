import { Spin } from 'antd'
import Modal from '../Modal'
import { LoadingOutlined } from '@ant-design/icons'
import { Issue } from '../../../types/global'
import { Link } from 'react-router-dom'
import Button from '../../commons/Button'

type IssueDetailsModalProps = {
  isModalDetailsOpen: boolean
  handleModalDetailsClose: () => void
  isClosedLoading: boolean
  issueDetails: Issue | undefined
}

const IssueDetailsModal = ({
  isModalDetailsOpen,
  handleModalDetailsClose,
  isClosedLoading,
  issueDetails,
}: IssueDetailsModalProps) => {
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
                    className="text-gray-600 text-sm px-2.5 py-1.5 my-1.5 border border-[#E5E7EB] outline-none cursor-not-allowed"
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
                    className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 border border-[#E5E7EB] outline-none cursor-not-allowed"
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
                  className="text-gray-600 text-sm px-1.5 py-1.5 my-1.5 h-20 border border-[#E5E7EB] resize-none outline-none cursor-not-allowed"
                  value={issueDetails?.description}
                  readOnly
                />
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between w-full my-5">
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
              </div> */}
            </div>

            <div className="flex items-end justify-end mt-6">
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

export default IssueDetailsModal

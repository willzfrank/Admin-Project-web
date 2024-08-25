import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from './util/AxiosInstance'

type UserActionProps = {
  issueId: string
  issueStatus: 'Unresolved' | 'Resolved'
  handleResolveIssue: () => void
  handleIssueDetails: () => void
  handleEditIssues: () => void
}

const reopenIssue = async (issueId: string) => {
  try {
    const response = await axiosInstance.get(
      `/Issues/Reopen?IssueId=${issueId}`
    )

    if (response.status === 200) {
      toast.success('Issue reopened successfully')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  } catch (error) {
    toast.error('Failed to reopen issue. Please try again.')
  }
}

const UserAction: React.FC<UserActionProps> = ({
  issueId,
  issueStatus,
  handleResolveIssue,
  handleIssueDetails,
  handleEditIssues,
}) => {
  return (
    <div className="items-center flex justify-center flex-col">
      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleEditIssues}
      >
        Edit
      </span>

      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleIssueDetails}
      >
        More Details
      </span>

      <span
        className="text-blue-500 cursor-pointer w-max hover:underline"
        onClick={handleResolveIssue}
      >
        Extra Permissions
      </span>
      <span className="text-blue-500 cursor-pointer w-max hover:underline">
        Enable{' '}
      </span>
    </div>
  )
}

export default UserAction

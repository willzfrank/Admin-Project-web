import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from './util/AxiosInstance'

type IssueActionsProps = {
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

const IssueActions: React.FC<IssueActionsProps> = ({
  issueId,
  issueStatus,
  handleResolveIssue,
  handleIssueDetails,
  handleEditIssues,
}) => {
  return (
    <div className="items-center flex justify-center flex-col">
      <span
        className="w-max cursor-pointer hover:underline text-[#35799c]"
        onClick={handleEditIssues}
      >
        Edit
      </span>
      {issueStatus === 'Resolved' && (
        <span
          className="text-amber-700 cursor-pointer hover:underline"
          onClick={async () => await reopenIssue(issueId)}
        >
          Reopen
        </span>
      )}
      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleIssueDetails}
      >
        More Details
      </span>
      <div className="cursor-pointer hover:underline">
        <Link to={`/issue-management/${issueId}`}>View history</Link>
      </div>
      {issueStatus === 'Unresolved' && (
        <span
          className="text-blue-500 cursor-pointer w-max hover:underline"
          onClick={handleResolveIssue}
        >
          Mark as resolved
        </span>
      )}
    </div>
  )
}

export default IssueActions

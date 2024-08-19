import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from './util/AxiosInstance'

type ProjectActionsProps = {
  issueId: string
  handleResolveIssue: () => void
  handleIssueDetails: () => void
  handleEditProject: () => void
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

const ProjectAction: React.FC<ProjectActionsProps> = ({
  issueId,
  handleResolveIssue,
  handleIssueDetails,
  handleEditProject,
}) => {
  return (
    <div className="items-center flex justify-center flex-col">
      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleEditProject}
      >
        Edit
      </span>
      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleIssueDetails}
      >
        More Details
      </span>
      <div className="cursor-pointer hover:underline">
        <Link to={`/activity-log/${issueId}`}>View history</Link>
      </div>

      <span
        className="text-blue-500 cursor-pointer w-max hover:underline"
        onClick={handleResolveIssue}
      >
        Mark as Done
      </span>
    </div>
  )
}

export default ProjectAction

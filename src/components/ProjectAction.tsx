import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from './util/AxiosInstance'

type ProjectActionsProps = {
  projectId: string
  status: string
  handleResolveIssue: () => void
  handleProjectDetails: () => void
  handleEditProject: () => void
  refreshData: () => void
}

const ProjectAction: React.FC<ProjectActionsProps> = ({
  projectId,
  status,
  handleResolveIssue,
  handleProjectDetails,
  handleEditProject,
  refreshData,
}) => {
  const handleStatusChange = async () => {
    try {
      let response
      if (status === 'Done') {
        response = await axiosInstance.get(
          `/Projects/Reopen?ProjectId=${projectId}`
        )
      } else {
        response = await axiosInstance.get(
          `/Projects/Close?ProjectId=${projectId}`
        )
      }

      if (response.status === 200) {
        toast.success(
          `Project ${
            status === 'Done' ? 'reopened' : 'marked as done'
          } successfully`
        )
        refreshData() // Call the refreshData function to update the table
      }
    } catch (error) {
      toast.error(
        `Failed to ${
          status === 'Done' ? 'reopen' : 'close'
        } project. Please try again.`
      )
    }
  }

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
        onClick={handleProjectDetails}
      >
        More Details
      </span>
      <div className="cursor-pointer hover:underline">
        <Link to={`/project-management/${projectId}`}>View history</Link>
      </div>

      <span
        className={`cursor-pointer w-max hover:underline ${
          status === 'Done' ? 'text-[#9a1012]' : 'text-[#2722ff]'
        }`}
        onClick={handleStatusChange}
      >
        {status === 'Done' ? 'Reopen' : 'Mark as Done'}{' '}
      </span>
    </div>
  )
}

export default ProjectAction

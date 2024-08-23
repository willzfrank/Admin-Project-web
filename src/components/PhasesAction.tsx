import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from './util/AxiosInstance'
import { ProjectStatusType } from '../types/global'

type PhasesActionProps = {
  PhaseId: string
  phasesStatus: ProjectStatusType
  handleResolvePhase: () => void
  handlePhaseDetails: () => void
}

const reopenPhase = async (PhaseId: string) => {
  try {
    const response = await axiosInstance.get(
      `/Phases/Reopen?PhaseId=${PhaseId}`
    )

    if (response.status === 200) {
      toast.success('Phase reopened successfully')
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  } catch (error) {
    toast.error('Failed to reopen phase. Please try again.')
  }
}

const PhasesAction: React.FC<PhasesActionProps> = ({
  PhaseId,
  phasesStatus,
  handleResolvePhase,
  handlePhaseDetails,
}) => {
  return (
    <div className="items-center flex justify-center flex-col">
      <span className="w-max cursor-pointer hover:underline text-[#547575]">
        Edit
      </span>
      {phasesStatus === 'Done' && (
        <span
          className="text-amber-700 cursor-pointer hover:underline"
          onClick={async () => await reopenPhase(PhaseId)}
        >
          Reopen
        </span>
      )}
      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handlePhaseDetails}
      >
        More Details
      </span>
      <div className="cursor-pointer hover:underline">
        <Link to={`/phase-management/${PhaseId}`}>View history</Link>
      </div>
      {['Todo', 'InProgress', 'OnHold'].includes(phasesStatus) && (
        <span
          className="text-[#3235ff] cursor-pointer w-max hover:underline"
          onClick={handleResolvePhase}
        >
          Mark as resolved
        </span>
      )}
    </div>
  )
}

export default PhasesAction

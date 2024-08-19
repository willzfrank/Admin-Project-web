import { Link } from 'react-router-dom'

type CompanyActionsProps = {
  companyId: string
  handleCompanyDetails: () => void
  handleEditCompany: () => void
  isActive: boolean
  onStatusToggle: () => void
}

const IssueActions: React.FC<CompanyActionsProps> = ({
  companyId,
  handleCompanyDetails,
  handleEditCompany,
  isActive,
  onStatusToggle,
}) => {
  return (
    <div className="items-center flex justify-center flex-col">
      <span
        className="text-amber-700 cursor-pointer hover:underline"
        onClick={handleEditCompany}
      >
        Edit
      </span>

      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleCompanyDetails}
      >
        More Details
      </span>

      <div className="cursor-pointer hover:underline">
        <Link to={`/company-management/${companyId}`}>View history</Link>
      </div>

      <span
        className={`text-xs  font-medium cursor-pointer hover:underline ${
          !isActive ? 'text-blue-500' : 'text-amber-700'
        }`}
        onClick={onStatusToggle}
      >
        {isActive ? 'Disable' : 'Enable'}
      </span>
    </div>
  )
}

export default IssueActions

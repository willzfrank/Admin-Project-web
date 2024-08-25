type UserActionProps = {
  userId: string
  userStatus: 'Active' | 'Inactive'
  handleEditUser: () => void
  handleUserDetails: () => void
  handleExtraPermissions: () => void
  handleToggleUserStatus: () => void
}

const UserAction: React.FC<UserActionProps> = ({
  userStatus,
  handleEditUser,
  handleUserDetails,
  handleExtraPermissions,
  handleToggleUserStatus,
}) => {
  const toggleStatusColor = userStatus === 'Active' ? '#a92f30' : '#3d2fff'
  return (
    <div className="items-center flex justify-center flex-col">
      <span
        className="text-[#35799c] w-max cursor-pointer hover:underline"
        onClick={handleEditUser}
      >
        Edit
      </span>

      <span
        className="w-max cursor-pointer hover:underline"
        onClick={handleUserDetails}
      >
        More Details
      </span>

      <span
        className="text-[#8aa264] cursor-pointer w-max hover:underline"
        onClick={handleExtraPermissions}
      >
        Extra Permissions
      </span>

      <span
        className="cursor-pointer w-max hover:underline"
        onClick={handleToggleUserStatus}
        style={{ color: toggleStatusColor }}
      >
        {userStatus === 'Active' ? 'Disable' : 'Enable'}
      </span>
    </div>
  )
}

export default UserAction

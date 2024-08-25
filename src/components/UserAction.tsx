import React from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from './util/AxiosInstance'

type UserActionProps = {
  userId: string
  userStatus: 'Active' | 'Inactive'
  handleEditUser: () => void
  handleUserDetails: () => void
  handleExtraPermissions: () => void
  handleToggleUserStatus: () => void
}

const toggleUserStatus = async (
  userId: string,
  currentStatus: 'Active' | 'Inactive'
) => {
  try {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    const response = await axiosInstance.post(`/Users/ToggleStatus`, {
      userId: userId,
      status: newStatus,
    })

    if (response.status === 200) {
      toast.success(`User ${newStatus.toLowerCase()} successfully`)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  } catch (error) {
    toast.error(
      `Failed to ${
        currentStatus === 'Active' ? 'deactivate' : 'activate'
      } user. Please try again.`
    )
  }
}

const UserAction: React.FC<UserActionProps> = ({
  userId,
  userStatus,
  handleEditUser,
  handleUserDetails,
  handleExtraPermissions,
  handleToggleUserStatus,
}) => {
  return (
    <div className="items-center flex justify-center flex-col">
      <span
        className="w-max cursor-pointer hover:underline"
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
        className="text-blue-500 cursor-pointer w-max hover:underline"
        onClick={handleExtraPermissions}
      >
        Extra Permissions
      </span>

      <span
        className="text-blue-500 cursor-pointer w-max hover:underline"
        onClick={handleToggleUserStatus}
      >
        {userStatus === 'Active' ? 'Disable' : 'Enable'}
      </span>
    </div>
  )
}

export default UserAction

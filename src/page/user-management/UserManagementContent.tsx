import React, { ChangeEvent, useEffect, useState } from 'react'
import { Table, Spin } from 'antd'
import toast from 'react-hot-toast'
import { SortOrder } from 'antd/lib/table/interface'
import { LoadingOutlined } from '@ant-design/icons'
import {
  ProjectData,
  NewProjectData,
  ProjectStatusType,
  UserData,
  statusType,
} from '../../types/global'
import { formatDate } from '../../components/util/formatdate'
import axiosInstance from '../../components/util/AxiosInstance'
import Button from '../../components/commons/Button'
import Modal from '../../components/Modals/Modal'
import BackArrow from '../../components/commons/BackArrow'
import { useBackButton } from '../../Hooks/useBackButton'
import ProjectAction from '../../components/ProjectAction'
import CreateProjectModal from '../../components/Modals/projects/CreateProjectModal'
import EditProjectModal from '../../components/Modals/projects/EditProjectModal'
import { getStatusClass } from '../../components/util/getStatusClassName'
import { v4 as uuidv4 } from 'uuid'
import { USER_KEY } from '../../components/util/constant'
import { Form, FormInstance } from 'antd'
import AddUserModal from '../../components/Modals/user/AddUserModal'
import EditUserModal from '../../components/Modals/user/EditUserFormModal'
import UserAction from '../../components/UserAction'

interface Props {
  data: UserData[]
  fetchUserData: () => Promise<void>
  isLoading: boolean
}

const UserManagementContent: React.FC<Props> = ({
  data,
  isLoading,
  fetchUserData,
}) => {
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isClosedLoading, setIsClosedLoading] = useState(false)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFetchCompanyLoading, setIsFetchCompanyLoading] = useState(false)
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([])
  const [isViewOnly, setIsViewOnly] = useState(false)

  interface FormValues {
    userName: string
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    password: string
    gender: 'Male' | 'Female'
    roleName: string
    companyId: string
  }

  const [form] = Form.useForm<FormValues>()
  const [editForm] = Form.useForm()

  const { handleBackButton, ripplePosition } = useBackButton()

  const statusColors = {
    active: '#3d2fff',
    inactive: '#a92f30',
  }

  const fetchCompanies = async () => {
    setIsFetchCompanyLoading(true)
    try {
      const response = await axiosInstance.get('/Company/ViewAll')
      setCompanies(
        response.data.data.map((company: any) => ({
          id: company.id,
          name: company.name,
        }))
      )
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Failed to fetch companies. Please try again.')
    } finally {
      setIsFetchCompanyLoading(false)
    }
  }

  const handleExtraPermissions = (userId: string) => {
    // Implement extra permissions logic here
    console.log('Extra permissions for user:', userId)
  }

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await axiosInstance.get(
        `/Users/Status/Toggle?UserId=${userId}`
      )

      if (response.status === 200) {
        toast.success(
          `User ${currentStatus ? 'deactivated' : 'activated'} successfully`
        )
        fetchUserData()
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Failed to toggle user status. Please try again.')
    }
  }

  const handleModalClose = () => {
    setIsResolveModalOpen(false)
    setSelectedIssueId(null)
  }

  const handleUserDetails = (user: UserData) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
    fetchCompanies()
    editForm.setFieldsValue({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      gender: user.gender,
      roleName: user.roleName,
      companyId: user.companyId,
    })
    // Set isViewOnly to true for user details view
    setIsViewOnly(true)
  }

  const handleCloseIssue = async () => {
    if (!selectedIssueId) return
    setIsClosedLoading(true)
    try {
      const response = await axiosInstance.get(
        `/Issues/Close?IssueId=${selectedIssueId}`
      )

      if (response.status === 200) {
        toast.success('Issue closed successfully')
        setIsResolveModalOpen(false)
        fetchUserData()
      }
    } catch (error) {
      toast.error('Failed to close the issue. Please try again.')
    } finally {
      setIsClosedLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/Roles/List')
      if (response.data.status) {
        setRoles(response.data.data)
      } else {
        toast.error('Failed to fetch roles')
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('An error occurred while fetching roles')
    }
  }

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>First Name</div>,
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a: UserData, b: UserData) =>
        a.firstName.localeCompare(b.firstName),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {text}
        </span>
      ),
    },

    {
      title: <div style={{ textAlign: 'center' }}>Last Name</div>,
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a: UserData, b: UserData) =>
        a.lastName.localeCompare(b.lastName),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 flex items-center justify-center px-6 font-medium">
          {text}
        </span>
      ),
    },

    {
      title: <div style={{ textAlign: 'center' }}>Company</div>,
      dataIndex: 'company',
      key: 'companyName',
      render: (company: { name: string; code: string }) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {company ? company.name : 'N/A'}
        </span>
      ),
    },

    {
      title: <div style={{ textAlign: 'center' }}>Role</div>,
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text: string) => (
        <span className="text-xs py-4 flex items-center justify-center px-6 font-medium">
          {text}
        </span>
      ),
    },

    {
      title: <div style={{ textAlign: 'center' }}>Created On</div>,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: UserData, b: UserData) =>
        a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (text: string) => (
        <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Status</div>,
      dataIndex: 'isActive',
      key: 'isActive',
      sorter: (a: UserData, b: UserData) =>
        String(a.isActive).localeCompare(String(b.isActive)),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      render: (isActive: boolean) => (
        <span
          className="py-4 text-xs font-medium px-6 flex items-center justify-center"
          style={{ color: isActive ? '#3d2fff' : '#a92f30' }}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (record: UserData) => (
        <span className="text-xs py-4 p-6 font-medium flex items-center justify-center">
          <UserAction
            userId={record.id}
            userStatus={record.isActive ? 'Active' : 'Inactive'}
            handleEditUser={() => handleEditUser(record)}
            handleUserDetails={() => handleUserDetails(record)}
            handleExtraPermissions={() => handleExtraPermissions(record.id)}
            handleToggleUserStatus={() =>
              handleToggleUserStatus(record.id, record.isActive)
            }
          />
        </span>
      ),
    },
  ]

  const handleAddUser = async () => {
    setIsSubmitting(true)

    try {
      const values = await form.validateFields()
      const userData = {
        userName: values.userName,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        gender: values.gender,
        roleName: values.roleName,
        companyId: values.companyId,
      }
      const response = await axiosInstance.post('/Users/Create', userData)
      if (response.status === 200) {
        toast.success('User added successfully')
        setUserModalOpen(false)
        form.resetFields()
        fetchUserData()
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = (user: UserData) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
    fetchCompanies()
    editForm.setFieldsValue({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      gender: user.gender,
      roleName: user.roleName,
      companyId: user.companyId,
    })

    setIsViewOnly(false)
  }

  const handleUpdateUser = async (values: any) => {
    setIsEditSubmitting(true)
    try {
      const response = await axiosInstance.post('/Users/Update', {
        ...values,
        id: editingUser?.id,
      })
      if (response.status === 200) {
        toast.success('User updated successfully')
        setIsEditModalOpen(false)
        fetchUserData()
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user. Please try again.')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  useEffect(() => {
    if (userModalOpen) {
      fetchRoles()
    }
  }, [userModalOpen])

  return (
    <div className="px-4">
      <div className="flex items-center justify-between w-full cursor-pointer">
        <BackArrow
          handleBackButton={handleBackButton}
          ripplePosition={ripplePosition}
          title="User Management"
        />
        <div
          className="px-5 py-2.5 mb-5 border"
          onClick={() => setUserModalOpen(true)}
        >
          Add New User
        </div>
      </div>
      <div className="bg-gray-200 w-full md:p-8 p-4 pb-2 mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              className="text-black"
              size="large"
            />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No users found.</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ position: ['bottomRight'], pageSize: 100 }}
              scroll={{ x: 800 }}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isResolveModalOpen} onClose={handleModalClose}>
        <p className="text-center md:text-base text-sm">
          Are you sure you want to mark this as resolved?
        </p>
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            text="No, Go Back"
            shade="dark"
            buttonType="default"
            type="button"
            size="small"
            action={handleModalClose}
            className="gap-2 border border-black text-xs md:text-sm text-black w-max"
          />
          <Button
            text={isClosedLoading ? 'Processing...' : 'Yes, Proceed'}
            buttonType="secondary"
            isLoading={isClosedLoading}
            type="button"
            action={handleCloseIssue}
            size="small"
            className="w-max gap-2 bg-black text-xs md:text-sm text-white"
          />
        </div>
      </Modal>

      {/* ADD NEW USER */}

      <AddUserModal
        userModalOpen={userModalOpen}
        companies={companies}
        setUserModalOpen={setUserModalOpen}
        handleAddUser={handleAddUser}
        form={form}
        isSubmitting={isSubmitting}
        roles={roles}
      />

      {/* EDIT PROJECT */}

      <EditUserModal
        isEditModalOpen={isEditModalOpen}
        onOk={handleUpdateUser}
        setIsEditModalOpen={setIsEditModalOpen}
        form={editForm}
        companies={companies}
        roles={roles}
        isEditingUser={isEditSubmitting}
        isViewOnly={isViewOnly}
      />
    </div>
  )
}

export default UserManagementContent

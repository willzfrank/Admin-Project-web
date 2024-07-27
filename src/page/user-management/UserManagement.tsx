import React, { useState, useEffect } from 'react'
import { Button, Input, Form, message } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import SidebarLayout from '../../layouts/Sidebar'
import { useUsers } from '../../Hooks/useUsers'
import { CompanyData, UserData } from '../../types/global'
import {
  createUser,
  fetchClaims,
  fetchCompanies,
  fetchRoles,
  toggleUserStatus,
  updateUser,
  updateUserPermissions,
} from '../../api/api'
import UserTable from '../../components/UserTable'
import AddUserModal from '../../components/Modals/AddUserModal'
import EditUserModal from '../../components/Modals/EditUserFormModal'
import UserPermissionsModal from '../../components/Modals/UserPermissionModal'

const UserManagement: React.FC = () => {
  const { isLoading, data, setData } = useUsers()
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] =
    useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [permissionsOptions, setPermissionsOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)

  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [permissionsForm] = Form.useForm()
  const { data: companyData } = useUsers()

  console.log('companyData', companyData)

  useEffect(() => {
    fetchCompanies().then((response) => {
      if (response.status) {
        setCompanies(response.data)
      }
    })

    fetchRoles().then((response) => {
      if (response.status) {
        setRoles(response.data.map((role: { name: string }) => role.name))
      }
    })

    fetchClaims().then((response) => {
      if (response.status) {
        setPermissionsOptions(
          response.data.map((claim: string) => ({
            value: claim,
            label: claim,
          }))
        )
      }
    })
  }, [])

  console.log('companies', companies)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const userPayload = {
          ...values,
          gender: 'Male',
          userName: values.email,
          password: 'password',
        }

        setIsAddingUser(true)
        createUser(userPayload).then((response) => {
          if (response.status) {
            message.success('User created successfully')
            setIsModalVisible(false)
            form.resetFields()
            setData([...data, response.data])
          } else {
            message.error('Failed to create user')
          }
          setIsAddingUser(false)
        })
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo)
      })
  }

  const handleMoreDetails = (record: UserData) => {
    setEditingUser(record)
    editForm.setFieldsValue(record)
    setIsViewOnly(true)
    setIsEditModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleEdit = (record: UserData) => {
    setEditingUser(record)
    editForm.setFieldsValue(record)
    setIsViewOnly(false)
    setIsEditModalVisible(true)
  }

  const handleEditOk = () => {
    if (isViewOnly) {
      setIsEditModalVisible(false)
      return
    }

    editForm
      .validateFields()
      .then((values) => {
        const userPayload = {
          ...values,
          gender: 'Male',
          username: values.email,
          password: 'password',
          id: editingUser?.id,
        }

        setIsEditingUser(true)
        updateUser(userPayload)
          .then((response) => {
            if (response.status) {
              message.success('User updated successfully')
              setIsEditModalVisible(false)
              editForm.resetFields()
              setEditingUser(null)
              setData((prevData) =>
                prevData.map((user) =>
                  user?.id === response?.data?.id ? response.data : user
                )
              )
            } else {
              message.error('Failed to update user')
            }
            setIsEditingUser(false)
          })
          .catch((error) => {
            console.error('Update Failed:', error)
            setIsEditingUser(false)
          })
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo)
      })
  }

  const handleEditCancel = () => {
    setIsEditModalVisible(false)
    editForm.resetFields()
    setEditingUser(null)
  }

  const handleExtraPermissions = (record: UserData) => {
    setEditingUser(record)
    permissionsForm.setFieldsValue({
      userName: `${record.firstName} ${record.lastName}`,
      permissions: record.permissions || [],
    })
    setIsPermissionsModalVisible(true)
  }

  const handlePermissionsOk = () => {
    permissionsForm.validateFields().then((values) => {
      setIsUpdatingPermissions(true)
      updateUserPermissions(editingUser!?.id, values.permissions).then(
        (response) => {
          if (response.status) {
            message.success('Permissions updated successfully')
            setIsPermissionsModalVisible(false)
            permissionsForm.resetFields()
            setEditingUser(null)
            setData(
              data.map((user) =>
                user?.id === editingUser?.id
                  ? { ...user, permissions: values.permissions }
                  : user
              )
            )
          } else {
            message.error('Failed to update permissions')
          }
          setIsUpdatingPermissions(false)
        }
      )
    })
  }

  const handlePermissionsCancel = () => {
    setIsPermissionsModalVisible(false)
    permissionsForm.resetFields()
    setEditingUser(null)
  }

  const handleToggleStatus = (record: UserData) => {
    toggleUserStatus(record?.id).then((response) => {
      if (response.status) {
        message.success(
          `User ${record.isActive ? 'disabled' : 'enabled'} successfully`
        )
        setData(
          data.map((user) =>
            user?.id === record?.id
              ? { ...user, isActive: !user.isActive }
              : user
          )
        )
      } else {
        message.error('Failed to update user status')
      }
    })
  }

  const filteredData = data.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.companyName?.toLowerCase().includes(searchText.toLowerCase()) ??
        false)
  )

  return (
    <SidebarLayout>
      <div className="mt-10 px-6 md:px-0">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage system users and their access levels
          </p>
        </div>

        {/* Search and Add User */}
        <div className="flex justify-between flex-col px-2.5 md:px-0 md:flex-row  items-center mb-4">
          <Input
            placeholder="Search users"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4 md:mb-0 md:mr-4 w-full md:w-[300px]"
          />
          <Button
            type="primary"
            onClick={showModal}
            className="w-full md:w-auto"
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              borderRadius: 0,
            }}
          >
            <PlusOutlined /> Add New User
          </Button>
        </div>

        {/* User Table */}
        <UserTable
          data={filteredData}
          onEdit={handleEdit}
          onMoreDetails={handleMoreDetails}
          onExtraPermissions={handleExtraPermissions}
          onToggleStatus={handleToggleStatus}
        />
        {/* Modals */}
        <AddUserModal
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          form={form}
          companies={companies}
          roles={roles}
          isAddingUser={isAddingUser}
        />
        <EditUserModal
          visible={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          form={editForm}
          companies={companies}
          roles={roles}
          isEditingUser={isEditingUser}
          isViewOnly={isViewOnly}
        />
        <UserPermissionsModal
          visible={isPermissionsModalVisible}
          onOk={handlePermissionsOk}
          onCancel={handlePermissionsCancel}
          form={permissionsForm}
          permissionsOptions={permissionsOptions}
          isUpdatingPermissions={isUpdatingPermissions}
        />
      </div>
    </SidebarLayout>
  )
}

export default UserManagement

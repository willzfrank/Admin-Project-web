import React, { useState, useEffect, useCallback } from 'react'
import { Spin, Input, message } from 'antd'
import {
  LoadingOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import SidebarLayout from '../../layouts/Sidebar'
import axiosInstance from '../../components/util/AxiosInstance'
import RoleTable from '../../components/RoleTable'
import RoleModal from '../../components/Modals/RoleModal'
import PermissionModal from '../../components/Modals/PermissionModal'
import { RoleData, HttpResponse, RawRoleData } from '../../types/global'

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roles, setRoles] = useState<RoleData[]>([])
  const [searchText, setSearchText] = useState('')
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null)
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([])
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
  const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false)

  const fetchRoles = useCallback(async () => {
    try {
      const response: HttpResponse <RoleData[]> = await axiosInstance.get(
        '/Roles/List'
      )
      if (response.data.status && Array.isArray(response.data.data)) {
        const rolesData: RoleData[] = response.data.data.map(
          (role: RawRoleData) => ({
            ...role,
            key: role.id,
            // dateCreated: '01-JAN-2024 00:00 AM',
            permissions: [],
          })
        )
        setRoles(rolesData)
      } else {
        throw new Error('Failed to fetch roles data')
      }
    } catch (error) {
      setError('An error occurred while fetching roles')
      console.error('Error fetching roles:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchPermissions = useCallback(async () => {
    setIsLoadingPermissions(true)
    try {
      const response: HttpResponse <string[]> = await axiosInstance.get(
        '/Claims/List'
      )
      if (response.data.status && Array.isArray(response.data.data)) {
        setAvailablePermissions(response.data.data)
      } else {
        throw new Error('Failed to fetch permissions')
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      setIsLoadingPermissions(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [fetchRoles, fetchPermissions])

  const handlePermissions = async (roleName: string) => {
    const role = roles.find((r) => r.name === roleName)
    if (!role) return

    try {
      const response: HttpResponse <string[]> = await axiosInstance.get(
        `/Claims/GetByRole?roleName=${encodeURIComponent(roleName)}`
      )
      if (response.data.status && Array.isArray(response.data.data)) {
        setSelectedRole({ ...role, permissions: response.data.data })
        setIsPermissionModalVisible(true)
      } else {
        throw new Error('Failed to fetch role permissions')
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error)
      message.error('Error fetching role permissions')
    }
  }

  const handlePermissionUpdate = async (values: {
    roleName: string
    permissions: string[]
  }) => {
    setIsUpdatingPermissions(true)
    try {
      const response: HttpResponse <null> = await axiosInstance.post(
        '/Claims/AddToRole',
        {
          roleName: values.roleName,
          claims: values.permissions,
        }
      )

      if (response.data.status) {
        message.success(
          response.data.message ||
            `Permissions for "${values.roleName}" have been updated.`
        )
        setIsPermissionModalVisible(false)
        fetchRoles()
      } else {
        throw new Error(response.data.message || 'Failed to update permissions')
      }
    } catch (error) {
      console.error('Error updating permissions:', error)
      message.error('Failed to update permissions. Please try again.')
    } finally {
      setIsUpdatingPermissions(false)
    }
  }

  const handleDelete = (roleName: string) => {
    setRoles(roles.filter((role) => role.name !== roleName))
    message.success(`${roleName} role has been deleted.`)
  }

  const handleAddRole = () => setIsRoleModalVisible(true)

  const handleCreateRole = async (roleName: string) => {
    setIsCreatingRole(true)
    try {
      const response: HttpResponse <null> = await axiosInstance.get(
        `/Roles/Create?roleName=${encodeURIComponent(roleName)}`
      )
      if (response.data.status) {
        message.success(
          response.data.message || `New role "${roleName}" has been created.`
        )
        setIsRoleModalVisible(false)
        fetchRoles()
      } else {
        throw new Error(response.data.message || 'Failed to create new role')
      }
    } catch (error) {
      message.error('Failed to create new role. Please try again.')
    } finally {
      setIsCreatingRole(false)
    }
  }

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchText.toLowerCase())
  )

  console.log('selectedRole', selectedRole)

  return (
    <SidebarLayout>
      <div className="mt-10 px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Role Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage system roles, permissions, and user access levels
          </p>
        </div>
        <div className="px-5 flex justify-between items-start gap-5 md:items-center mb-4 md:flex-row flex-col">
          <Input
            placeholder="Search roles"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <button
            type="button"
            onClick={handleAddRole}
            style={{
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              borderRadius: 0,
              padding: '5px 10px',
            }}
          >
            <PlusOutlined /> Add New Role
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg h-[60vh] overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spin
                indicator={<LoadingOutlined spin />}
                className="text-black"
                size="large"
              />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <RoleTable
              data={filteredRoles}
              handlePermissions={handlePermissions}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
      <RoleModal
        isModalVisible={isRoleModalVisible}
        setIsModalVisible={setIsRoleModalVisible}
        handleProceed={handleCreateRole}
        isCreatingRole={isCreatingRole}
      />
      {selectedRole && (
        <PermissionModal
          isPermissionModalVisible={isPermissionModalVisible}
          setIsPermissionModalVisible={setIsPermissionModalVisible}
          selectedRole={selectedRole}
          availablePermissions={availablePermissions}
          isLoadingPermissions={isLoadingPermissions}
          handlePermissionUpdate={handlePermissionUpdate}
          isUpdatingPermissions={isUpdatingPermissions}
        />
      )}
    </SidebarLayout>
  )
}

export default Dashboard

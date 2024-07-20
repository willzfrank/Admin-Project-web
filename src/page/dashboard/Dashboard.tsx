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

interface RoleData {
  key: string
  roleName: string
  dateCreated: string
  permissions: string[]
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<RoleData[]>([])
  const [searchText, setSearchText] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null)
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([])
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
  const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false)

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/Roles/List')
      if (response.data.status && Array.isArray(response.data.data)) {
        const rolesData: RoleData[] = response.data.data.map(
          (roleName: string, index: number) => ({
            key: index.toString(),
            roleName,
            dateCreated: '01-JAN-2024 00:00 AM',
            permissions: [],
          })
        )
        setData(rolesData)
      } else {
        setError('Failed to fetch roles data')
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
      const response = await axiosInstance.get('/Claims/List')
      if (response.data.status && Array.isArray(response.data.data)) {
        setAvailablePermissions(response.data.data)
      } else {
        console.error('Failed to fetch permissions')
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
    const role = data.find((r) => r.roleName === roleName)
    if (role) {
      setSelectedRole(role)
      try {
        const response = await axiosInstance.get(
          `/Claims/GetByRole?roleName=${encodeURIComponent(roleName)}`
        )
        if (response.data.status && Array.isArray(response.data.data)) {
          setSelectedRole({
            ...role,
            permissions: response.data.data,
          })
          setIsPermissionModalVisible(true)
        } else {
          console.error('Failed to fetch role permissions')
        }
      } catch (error) {
        console.error('Error fetching role permissions:', error)
      }
    }
  }

  const handlePermissionUpdate = async (values: any) => {
    try {
      setIsUpdatingPermissions(true)
      const response = await axiosInstance.post('/Claims/AddToRole', {
        roleName: values.roleName,
        claims: values.permissions,
      })

      if (response.data.status) {
        message.success(
          response.data.message ||
            `Permissions for "${values.roleName}" have been updated.`
        )
        setIsPermissionModalVisible(false)
        fetchRoles() // Refresh the roles list
      } else {
        message.error(
          response.data.message ||
            'Failed to update permissions. Please try again.'
        )
      }
    } catch (error) {
      console.error('Error updating permissions:', error)
      message.error('Failed to update permissions. Please try again.')
    } finally {
      setIsUpdatingPermissions(false)
    }
  }

  const handleDelete = (roleName: string) => {
    setData(data.filter((role) => role.roleName !== roleName))
    message.success(`${roleName} role has been deleted.`)
  }

  const handleAddRole = () => {
    setIsModalVisible(true)
  }

  const handleProceed = async (roleName: string) => {
    try {
      setIsCreatingRole(true)
      const response = await axiosInstance.get(
        `/Roles/Create?roleName=${encodeURIComponent(roleName)}`
      )
      if (response.data.status) {
        message.success(
          response.data.message || `New role "${roleName}" has been created.`
        )
        setIsModalVisible(false)
        fetchRoles() // Refresh the roles list
      } else {
        message.error(
          response.data.message ||
            'Failed to create new role. Please try again.'
        )
      }
    } catch (error) {
      console.error('Error creating role:', error)
      message.error('Failed to create new role. Please try again.')
    } finally {
      setIsCreatingRole(false)
    }
  }

  const filteredData = data.filter((item) =>
    item.roleName.toLowerCase().includes(searchText.toLowerCase())
  )

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
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-start gap-5 md:items-center mb-4 md:flex-row flex-col">
            <Input
              placeholder="Search roles"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
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
              data={filteredData}
              handlePermissions={handlePermissions}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>
      <RoleModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleProceed={handleProceed}
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

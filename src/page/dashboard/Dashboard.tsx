import React, { useState, useEffect } from 'react'
import {
  Table,
  Spin,
  Button,
  Input,
  Space,
  Modal,
  message,
  Form,
  Select,
} from 'antd'
import {
  LoadingOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import SidebarLayout from '../../layouts/Sidebar'

// Define the interface for our data
interface RoleData {
  key: string
  roleName: string
  description: string
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
  const [form] = Form.useForm()
  const [permissionForm] = Form.useForm()

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setData([
        {
          key: '1',
          roleName: 'Owner',
          description: 'Full system access and control',
          dateCreated: '06-JUN-2024 11:05 PM',
          permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Users'],
        },
        {
          key: '2',
          roleName: 'Admin',
          description: 'System administration and user management',
          dateCreated: '01-MAR-2024 08:32 AM',
          permissions: ['Create', 'Read', 'Update', 'Delete'],
        },
        {
          key: '3',
          roleName: 'SysAdmin',
          description: 'Advanced system configuration and maintenance',
          dateCreated: '28-NOV-2023 10:16 AM',
          permissions: ['Read', 'Update', 'System Config'],
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handlePermissions = (roleName: string) => {
    const role = data.find((r) => r.roleName === roleName)
    if (role) {
      setSelectedRole(role)
      permissionForm.setFieldsValue({
        roleName: role.roleName,
        permissions: role.permissions,
      })
      setIsPermissionModalVisible(true)
    }
  }

  const handlePermissionUpdate = () => {
    permissionForm.validateFields().then((values) => {
      const updatedData = data.map((role) =>
        role.key === selectedRole?.key
          ? {
              ...role,
              roleName: values.roleName,
              permissions: values.permissions,
            }
          : role
      )
      setData(updatedData)
      message.success(`Role "${values.roleName}" has been updated.`)
      setIsPermissionModalVisible(false)
    })
  }

  const handleDelete = (roleName: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      content: `This will permanently delete the ${roleName} role.`,
      okText: 'Delete',
      okType: 'danger',
      okButtonProps: {
        style: {
          backgroundColor: 'red',
          borderColor: 'red',
          color: 'white',
        },
      },
      onOk() {
        setData(data.filter((role) => role.roleName !== roleName))
        message.success(`${roleName} role has been deleted.`)
      },
      onCancel() {},
    })
  }

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      sorter: (a: RoleData, b: RoleData) =>
        a.roleName.localeCompare(b.roleName),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      sorter: (a: RoleData, b: RoleData) =>
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
    },
    {
      title: () => <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (_: any, record: RoleData) => (
        <Space
          size="middle"
          direction="vertical"
          className="flex items-center justify-center"
        >
          <Button
            type="link"
            onClick={() => handlePermissions(record.roleName)}
          >
            Permissions
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.roleName)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(
    (item) =>
      item.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
  )

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleProceed = () => {
    form
      .validateFields()
      .then((values) => {
        // Here you would typically send this data to your backend
        const newRole: RoleData = {
          key: (data.length + 1).toString(),
          roleName: values.roleName,
          description: values.description,
          dateCreated: new Date().toLocaleString(),
          permissions: [], // Default empty permissions
        }
        setData([...data, newRole])
        message.success(`New role "${values.roleName}" has been created.`)
        setIsModalVisible(false)
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              // onClick={handleAddRole}
              onClick={showModal}
              style={{
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid black',
                borderRadius: 0,
              }}
            >
              Add New Role
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spin
                indicator={<LoadingOutlined spin />}
                className="text-blue-500"
                size="large"
              />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ position: ['bottomRight'], pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          )}
        </div>
      </div>
      {/* CREATE NEW ROLE MODAL */}
      <Modal
        title="Create New Role"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="roleName"
            label="Role Name"
            required
            rules={[{ required: true, message: 'Please input the role name!' }]}
            className="rounded-0"
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            required
            rules={[
              { required: true, message: 'Please input the role description!' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Provide role description" />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleCancel}
                style={{
                  borderColor: 'black',
                  color: 'black',
                  borderRadius: 0,
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleProceed}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: 0,
                }}
              >
                Proceed
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* PERMISSIONS MODAL */}
      <Modal
        title="Update Permissions"
        visible={isPermissionModalVisible}
        onCancel={() => setIsPermissionModalVisible(false)}
        footer={null}
      >
        <Form form={permissionForm} layout="vertical">
          <Form.Item
            name="roleName"
            label="Role Name"
            rules={[
              { required: true, message: 'Role name is required!' },
              {
                validator: (_, value) => {
                  if (
                    value &&
                    value !== selectedRole?.roleName &&
                    data.some((role) => role.roleName === value)
                  ) {
                    return Promise.reject(
                      new Error('Role name already exists!')
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input style={{ borderRadius: 0 }} />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select permissions!' }]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select multiple permissions"
              options={[
                { value: 'addUser ', label: 'add user ' },
                { value: 'editUser', label: 'edit user' },
                { value: 'create role', label: 'createRole' },
                { value: 'createPhase', label: 'create phase' },
                { value: 'editPhase', label: 'edit phase' },
                {
                  value: 'mark issue as resolved',
                  label: 'mark issue as resolved',
                },
                { value: 'reopen issue', label: 'reopen issue' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsPermissionModalVisible(false)}
                style={{
                  borderColor: 'black',
                  color: 'black',
                  borderRadius: 0,
                }}
              >
                Close
              </Button>
              <Button
                onClick={handlePermissionUpdate}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: 0,
                }}
              >
                Update
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </SidebarLayout>
  )
}

export default Dashboard

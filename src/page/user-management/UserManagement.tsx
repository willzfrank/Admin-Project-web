import React, { useState, useEffect } from 'react'
import {
  Table,
  Spin,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Select,
} from 'antd'
import {
  LoadingOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import SidebarLayout from '../../layouts/Sidebar'
import { ColumnsType } from 'antd/es/table'

interface UserData {
  key: string
  firstName: string
  lastName: string
  company: string
  role: string
  createdOn: string
  status: 'Active' | 'Inactive'
}

const users: UserData[] = [
  {
    key: '1',
    firstName: 'Clark',
    lastName: 'Kent',
    company: 'Default',
    role: 'Admin',
    createdOn: '06-JUN-2024 11:05 PM',
    status: 'Active',
  },
  {
    key: '2',
    firstName: 'Bruce',
    lastName: 'Wayne',
    company: 'Wayne Ent.',
    role: 'Owner',
    createdOn: '01-MAR-2024 08:32 AM',
    status: 'Active',
  },
  {
    key: '3',
    firstName: 'Mary',
    lastName: 'Jane',
    company: 'Star Labs Inc.',
    role: 'Supervisor',
    createdOn: '28-NOV-2023 10:16 AM',
    status: 'Inactive',
  },
]

const UserManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<UserData[]>(users)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [permissionsForm] = Form.useForm()
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] =
    useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Form values:', values)
        // Here you would typically send the data to your backend
        setIsModalVisible(false)
        form.resetFields()
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleMoreDetails = (record: UserData) => {
    console.log('More Details:', record)
  }

  const handleExtraPermissions = (record: UserData) => {
    setEditingUser(record)
    permissionsForm.setFieldsValue({
      userName: `${record.firstName} ${record.lastName}`,
    })
    setIsPermissionsModalVisible(true)
  }

  const handleToggleStatus = (record: UserData) => {
    const newData = data.map((item) => {
      if (item.key === record.key) {
        const newStatus: 'Active' | 'Inactive' =
          item.status === 'Active' ? 'Inactive' : 'Active'
        return { ...item, status: newStatus }
      }
      return item
    })
    setData(newData)
  }

  const handleEdit = (record: UserData) => {
    setEditingUser(record)
    editForm.setFieldsValue(record)
    setIsEditModalVisible(true)
  }

  const handleEditOk = () => {
    editForm
      .validateFields()
      .then((values) => {
        console.log('Edit Form values:', values)
        // Here you would typically send the updated data to your backend
        setIsEditModalVisible(false)
        editForm.resetFields()
        setEditingUser(null)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleEditCancel = () => {
    setIsEditModalVisible(false)
    editForm.resetFields()
    setEditingUser(null)
  }

  const handlePermissionsOk = () => {
    permissionsForm
      .validateFields()
      .then((values) => {
        console.log('Permissions Form values:', values)
        // Here you would typically send the updated permissions data to your backend
        setIsPermissionsModalVisible(false)
        permissionsForm.resetFields()
        setEditingUser(null)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handlePermissionsCancel = () => {
    setIsPermissionsModalVisible(false)
    permissionsForm.resetFields()
    setEditingUser(null)
  }

  const columns: ColumnsType<UserData> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      sorter: (a, b) =>
        new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime(),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: 'Active' | 'Inactive') => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: UserData) => (
        <Space
          direction="vertical"
          size="small"
          className="flex items-center justify-center"
        >
          <span
            className="cursor-pointer text-[#134f5c]"
            onClick={() => handleEdit(record)}
          >
            Edit
          </span>
          <span
            className="cursor-pointer text-[#7f6342]"
            onClick={() => handleMoreDetails(record)}
          >
            More Details
          </span>
          <span
            className="cursor-pointer text-[#4a8136]"
            onClick={() => handleExtraPermissions(record)}
          >
            Extra Permissions
          </span>
          <span
            className={`cursor-pointer ${
              record.status === 'Active' ? 'text-[#af3e2f]' : 'text-[#3c5fff]'
            }`}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'Active' ? 'Disable' : 'Enable'}
          </span>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.company.toLowerCase().includes(searchText.toLowerCase())
  )

  const companyOptions = [
    { value: 'Default', label: 'Default' },
    { value: 'Wayne Ent.', label: 'Wayne Enterprises' },
    { value: 'Star Labs Inc.', label: 'Star Labs Inc.' },
  ]

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Owner', label: 'Owner' },
    { value: 'Supervisor', label: 'Supervisor' },
  ]

  const permissionsOptions = [
    { value: 'Read', label: 'Read' },
    { value: 'Write', label: 'Write' },
    { value: 'Execute', label: 'Execute' },
    { value: 'Delete', label: 'Delete' },
  ]

  return (
    <SidebarLayout>
      <div className="mt-10 px-6 md:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            User Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage system users and their access levels
          </p>
        </div>
        <div className=" shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search users"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mb-4 md:mb-0 md:mr-4"
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
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="key"
              scroll={{ x: 1000 }}
              pagination={{ pageSize: 10 }}
              className="w-full"
            />
          )}
        </div>

        {/* Add User Modal */}
        <Modal
          title="Add User"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Save"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please input the first name!' },
                  ]}
                >
                  <Input placeholder="John" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please input the last name!' },
                  ]}
                >
                  <Input placeholder="Snow" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the email address!',
                    },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="john@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the phone number!',
                    },
                  ]}
                >
                  <Input placeholder="07012345678" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="Company"
                  rules={[
                    { required: true, message: 'Please select the company!' },
                  ]}
                >
                  <Select
                    placeholder="Select a company"
                    options={companyOptions}
                  />{' '}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[
                    { required: true, message: 'Please select the role!' },
                  ]}
                >
                  <Select placeholder="Select a role" options={roleOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          title="Edit User"
          visible={isEditModalVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          okText="Save"
          cancelText="Cancel"
        >
          <Form form={editForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please input the first name!' },
                  ]}
                >
                  <Input placeholder="John" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please input the last name!' },
                  ]}
                >
                  <Input placeholder="Snow" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the email address!',
                    },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="john@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the phone number!',
                    },
                  ]}
                >
                  <Input placeholder="07012345678" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="Company"
                  rules={[
                    { required: true, message: 'Please select the company!' },
                  ]}
                >
                  <Select
                    placeholder="Select a company"
                    options={companyOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[
                    { required: true, message: 'Please select the role!' },
                  ]}
                >
                  <Select placeholder="Select a role" options={roleOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Extra Permissions Modal */}
        <Modal
          title="User Permissions"
          visible={isPermissionsModalVisible}
          onOk={handlePermissionsOk}
          onCancel={handlePermissionsCancel}
          okText="Update"
          cancelText="Cancel"
          okButtonProps={{
            style: { backgroundColor: 'black', borderColor: 'black' },
          }}
          cancelButtonProps={{ style: { borderColor: 'black' } }}
        >
          <Form layout="vertical" form={permissionsForm}>
            <Form.Item
              name="userName"
              label="User Name"
              rules={[
                { required: true, message: 'Please enter the user name' },
              ]}
            >
              <Input placeholder="User Name" disabled />
            </Form.Item>
            <Form.Item
              name="permissions"
              label="Permissions"
              rules={[{ required: true, message: 'Please select permissions' }]}
            >
              <Select
                mode="multiple"
                options={permissionsOptions}
                placeholder="Select Permissions"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </SidebarLayout>
  )
}

export default UserManagement

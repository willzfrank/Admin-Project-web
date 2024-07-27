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
  message,
} from 'antd'
import {
  LoadingOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import SidebarLayout from '../../layouts/Sidebar'
import { ColumnsType } from 'antd/es/table'
import axiosInstance from '../../components/util/AxiosInstance'

interface UserData {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  imageUrl: string | null
  companyId: string | null
  companyName: string | null
  roleName: string
  isActive: boolean
  createdAt: string
  permissions?: string[]
}

interface CompanyData {
  id: string
  name: string
}

const UserManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<UserData[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [permissionsForm] = Form.useForm()
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] =
    useState(false)
  const [roles, setRoles] = useState<string[]>([])
  const [companies, setCompanies] = useState<CompanyData[]>([])
  const [permissionsOptions, setPermissionsOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [isMoreDetailsModalVisible, setIsMoreDetailsModalVisible] =
    useState(false)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false)

  const fetchCompanyDetails = async (
    companyId: string
  ): Promise<CompanyData | null> => {
    try {
      const response = await axiosInstance.get(
        `/Company/ViewById?CompanyId=${companyId}`
      )
      if (response.data.status) {
        return {
          id: response.data.data.id,
          name: response.data.data.name,
        }
      }
    } catch (error) {
      console.error('Error fetching company details:', error)
    }
    return null
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get('/Users/ViewAll')
      if (response.data.status) {
        const usersWithDetails = await Promise.all(
          response.data.data.map(async (user: UserData) => {
            const companyDetails = user.companyId
              ? await fetchCompanyDetails(user.companyId)
              : null
            const userPermissions = await fetchUserPermissions(user.id)
            return {
              ...user,
              companyName: companyDetails ? companyDetails.name : 'N/A',
              permissions: userPermissions,
            }
          })
        )
        setData(usersWithDetails)
      } else {
        message.error('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      message.error('An error occurred while fetching users')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserPermissions = async (userId: string) => {
    try {
      const response = await axiosInstance.get(
        `/Claims/GetByUser?userId=${userId}`
      )
      if (response.data.status) {
        return response.data.data
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error)
    }
    return []
  }

  const fetchRoles = async () => {
    try {
      const [rolesResponse, claimsResponse] = await Promise.all([
        axiosInstance.get('/Roles/List'),
        axiosInstance.get('/Claims/List'),
      ])
      if (rolesResponse.data.status) {
        setRoles(
          rolesResponse.data.data.map((role: { name: string }) => role.name)
        )
      }
      if (claimsResponse.data.status) {
        setPermissionsOptions(
          claimsResponse.data.data.map((claim: string) => ({
            value: claim,
            label: claim,
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching roles and claims:', error)
      message.error('An error occurred while fetching roles and claims')
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get('/Company/ViewAll')
      if (response.data.status) {
        setCompanies(response.data.data)
      } else {
        message.error('Failed to fetch companies')
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      message.error('An error occurred while fetching companies')
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setIsAddingUser(true)
        createUser(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const createUser = async (values: any) => {
    try {
      const response = await axiosInstance.post('/Users/Create', {
        userName: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: 'password',
        gender: 'male',
        roleName: values.roleName,
        companyId: values.companyId,
      })
      if (response.data.status) {
        message.success('User created successfully')
        setIsModalVisible(false)
        form.resetFields()
        fetchUsers()
      } else {
        message.error('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      message.error('An error occurred while creating the user')
    } finally {
      setIsAddingUser(false)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleMoreDetails = (record: UserData) => {
    setEditingUser(record)
    editForm.setFieldsValue({
      ...record,
      companyId: record.companyId,
      roleName: record.roleName,
    })
    setIsMoreDetailsModalVisible(true)
  }

  const handleMoreDetailsCancel = () => {
    setIsMoreDetailsModalVisible(false)
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

  const handleToggleStatus = async (record: UserData) => {
    try {
      const response = await axiosInstance.get(
        `/Users/Status/Toggle?userId=${record.id}`
      )
      if (response.data.status) {
        // If the API call is successful, update the local state
        const newData = data.map((item) => {
          if (item.id === record.id) {
            return { ...item, isActive: !item.isActive }
          }
          return item
        })
        setData(newData)
        message.success(
          `User ${record.isActive ? 'disabled' : 'enabled'} successfully`
        )
      } else {
        message.error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      message.error('An error occurred while updating user status')
    }
  }

  const handleEdit = (record: UserData) => {
    setEditingUser(record)
    editForm.setFieldsValue({
      ...record,
      companyId: record.companyId,
      roleName: record.roleName,
    })
    setIsEditModalVisible(true)
  }

  const handleEditOk = () => {
    editForm
      .validateFields()
      .then(async (values) => {
        setIsEditingUser(true)
        try {
          const response = await axiosInstance.post('/Users/Update', {
            userName: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            email: values.email,
            password: 'password',
            gender: 'Male',
            roleName: values.roleName,
            companyId: values.companyId,
            id: editingUser?.id,
          })

          if (response.data.status) {
            message.success('User updated successfully')
            setIsEditModalVisible(false)
            editForm.resetFields()
            setEditingUser(null)
            fetchUsers() // Refresh the user list
          } else {
            message.error('Failed to update user')
          }
        } catch (error) {
          console.error('Error updating user:', error)
          message.error('An error occurred while updating the user')
        } finally {
          setIsEditingUser(false)
        }
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

  const handlePermissionsOk = async () => {
    try {
      const values = await permissionsForm.validateFields()
      setIsUpdatingPermissions(true)
      const response = await axiosInstance.post('/Claims/AddToUser', {
        userId: editingUser?.id,
        claims: values.permissions,
      })
      if (response.data.status) {
        message.success('Permissions updated successfully')
        setIsPermissionsModalVisible(false)
        permissionsForm.resetFields()
        setEditingUser(null)
        fetchUsers()
      } else {
        message.error('Failed to update permissions')
      }
    } catch (error) {
      console.error('Error updating permissions:', error)
      message.error('An error occurred while updating permissions')
    } finally {
      setIsUpdatingPermissions(false)
    }
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
      dataIndex: 'companyId',
      key: 'companyId',
      render: (companyId) => {
        const company = companies.find((c) => c.id === companyId)
        return company ? company.name : 'N/A'
      },
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'Status',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
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
              record.isActive ? 'text-[#af3e2f]' : 'text-[#3c5fff]'
            }`}
            onClick={() => handleToggleStatus(record)}
          >
            {record.isActive ? 'Disable' : 'Enable'}
          </span>
        </Space>
      ),
    },
  ]

  const filteredData = data.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.companyName?.toLowerCase().includes(searchText.toLowerCase()) ??
        false)
  )

  useEffect(() => {
    fetchUsers()
    fetchRoles()
    fetchCompanies()
  }, [])

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
              className="mb-4 md:mb-0 md:mr-4 w-[300px]"
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
          okText={isAddingUser? 'Proceeding...' : 'Proceed'}
          // loading={isAddingUser}
          cancelText="Close"
          okButtonProps={{
            disabled: isAddingUser,
            loading: isAddingUser,
            style: {
              backgroundColor: 'black',
              borderColor: 'black',
              paddingLeft: '50px',
              paddingRight: '50px',
              borderRadius: '0px',
            },
          }}
          cancelButtonProps={{
            disabled: isAddingUser,
            style: {
              borderColor: 'black',
              paddingLeft: '50px',
              paddingRight: '50px',
              borderRadius: '0px',
            },
          }}
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
                  name="companyId"
                  label="Company"
                  rules={[
                    { required: true, message: 'Please select the company!' },
                  ]}
                >
                  <Select>
                    {companies.map((company) => (
                      <Select.Option key={company.id} value={company.id}>
                        {company.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="roleName"
                  label="Role"
                  rules={[
                    { required: true, message: 'Please select the role!' },
                  ]}
                >
                  <Select>
                    {roles.map((role) => (
                      <Select.Option key={role} value={role}>
                        {role}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        {/* Edit User / More Details Modal */}
        <Modal
          title={isEditModalVisible ? 'Edit User' : 'User Details'}
          visible={isEditModalVisible || isMoreDetailsModalVisible}
          onOk={isEditModalVisible ? handleEditOk : handleMoreDetailsCancel}
          onCancel={
            isEditModalVisible ? handleEditCancel : handleMoreDetailsCancel
          }
          okText={isEditModalVisible ? 'Save' : 'Close'}
          okButtonProps={{
            loading: isEditingUser,
            disabled: isEditingUser,
            style: {
              backgroundColor: 'black',
              borderColor: 'black',
              paddingLeft: '50px',
              paddingRight: '50px',
              borderRadius: '0px',
            },
          }}
          cancelButtonProps={{
            loading: isEditingUser,
            disabled: isEditingUser,
            style: {
              borderColor: 'black',
              paddingLeft: '50px',
              paddingRight: '50px',
              borderRadius: '0px',
            },
          }}
          cancelText="Cancel"
          footer={
            isEditModalVisible
              ? undefined
              : [
                  <Button
                    key="close"
                    onClick={handleMoreDetailsCancel}
                    className="border px-10 border-black rounded-none"
                  >
                    Close
                  </Button>,
                ]
          }
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
                  <Input placeholder="John" disabled={!isEditModalVisible} />
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
                  <Input placeholder="Snow" disabled={!isEditModalVisible} />
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
                  <Input
                    placeholder="john@example.com"
                    disabled={!isEditModalVisible}
                  />
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
                  <Input
                    placeholder="07012345678"
                    disabled={!isEditModalVisible}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyId"
                  label="Company"
                  rules={[
                    { required: true, message: 'Please select the company!' },
                  ]}
                >
                  <Select disabled={!isEditModalVisible}>
                    {companies.map((company) => (
                      <Select.Option key={company.id} value={company.id}>
                        {company.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="roleName"
                  label="Role"
                  rules={[
                    { required: true, message: 'Please select the role!' },
                  ]}
                >
                  <Select disabled={!isEditModalVisible}>
                    {roles.map((role) => (
                      <Select.Option key={role} value={role}>
                        {role}
                      </Select.Option>
                    ))}
                  </Select>
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
          okText={isUpdatingPermissions? 'Updating...' : 'Update'}

          cancelText="Cancel"
          okButtonProps={{
            loading: isUpdatingPermissions,
            disabled: isUpdatingPermissions,
            style: {
              backgroundColor: 'black',
              borderColor: 'black',
              paddingLeft: '50px',
              paddingRight: '50px',
              borderRadius: '0px',
            },
          }}
          cancelButtonProps={{
            loading: isUpdatingPermissions,
            disabled: isUpdatingPermissions,
            style: {
              borderColor: 'black',
              paddingLeft: '50px',
              paddingRight: '50px',
              borderRadius: '0px',
            },
          }}
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

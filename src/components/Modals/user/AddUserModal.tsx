import React from 'react'
import { Modal, Form, Input, Select, Row, Col } from 'antd'
import { CompanyData } from '../../../types/global'

interface AddUserModalProps {
  userModalOpen: boolean
  setUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  form: any
  companies: CompanyData[]
  roles: { id: string; name: string }[]
  isSubmitting: boolean
  handleAddUser: () => void
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  userModalOpen,
  setUserModalOpen,
  form,
  companies,
  handleAddUser,
  roles,
  isSubmitting,
}) => {
  return (
    <Modal
      title="Create User"
      visible={userModalOpen}
      onOk={handleAddUser}
      onCancel={() => setUserModalOpen(false)}
      okText={isSubmitting ? 'Proceeding...' : 'Proceed'}
      cancelText="Close"
      okButtonProps={{
        disabled: isSubmitting,
        loading: isSubmitting,
        style: {
          backgroundColor: 'black',
          borderColor: 'black',
          paddingLeft: '25px',
          paddingRight: '25px',
          borderRadius: '0px',
          color: 'white',
        },
      }}
      cancelButtonProps={{
        disabled: isSubmitting,
        style: {
          borderColor: 'black',
          paddingLeft: '25px',
          paddingRight: '25px',
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
                { required: true, message: 'Please input the email address!' },
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
                { required: true, message: 'Please input the phone number!' },
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
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select>
                {roles.map((role) => (
                  <Select.Option key={role.id} value={role.name}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="userName"
              label="Username"
              rules={[
                { required: true, message: 'Please input the username!' },
              ]}
            >
              <Input placeholder="johnsnow" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input the password!' },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select the gender!' }]}
            >
              <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddUserModal

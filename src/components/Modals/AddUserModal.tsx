import React from 'react'
import { Modal, Form, Input, Select, Row, Col } from 'antd'
import { CompanyData } from '../../types/global'

interface AddUserModalProps {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  form: any
  companies: CompanyData[]
  roles: string[]
  isAddingUser: boolean
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  visible,
  onOk,
  onCancel,
  form,
  companies,
  roles,
  isAddingUser,
}) => {
  return (
    <Modal
      title="Create User"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={isAddingUser ? 'Proceeding...' : 'Proceed'}
      cancelText="Close"
      okButtonProps={{
        disabled: isAddingUser,
        loading: isAddingUser,
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
        disabled: isAddingUser,
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
              rules={[{ required: true, message: 'Please select the role!' }]}
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
  )
}

export default AddUserModal

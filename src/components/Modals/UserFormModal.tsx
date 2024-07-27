import React from 'react'
import { Modal, Form, Row, Col, Input, Select } from 'antd'
import { UserFormProps } from '../../types/global'

const UserForm: React.FC<UserFormProps> = ({
  visible,
  onCreate,
  onCancel,
  roles,
  companies,
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      title="Add User"
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
      onCancel={onCancel}
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
              name="roleId"
              label="Role"
              rules={[{ required: true, message: 'Please select the role!' }]}
            >
              <Select>
                {roles.map((role) => (
                  <Select.Option key={role.id} value={role.id}>
                    {role.name}
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

export default UserForm

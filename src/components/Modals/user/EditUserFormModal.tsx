import React from 'react'
import { Modal, Form, Input, Select, Row, Col } from 'antd'
import { CompanyData } from '../../../types/global'

interface EditUserModalProps {
  isEditModalOpen: boolean
  onOk: (values: any) => void
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  form: any
  companies: CompanyData[]
  roles: { id: string; name: string }[]
  isEditingUser: boolean
  isViewOnly: boolean
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isEditModalOpen,
  onOk,
  setIsEditModalOpen,
  form,
  companies,
  roles,
  isEditingUser,
  isViewOnly,
}) => {

   const handleOk = () => {
     form.validateFields().then((values: any) => {
       onOk(values)
     })
   }
  return (
    <Modal
      title={isViewOnly ? 'User Details' : 'Edit User'}
      visible={isEditModalOpen}
      onOk={handleOk}
      onCancel={() => setIsEditModalOpen(false)}
      okText={isViewOnly ? 'Close' : isEditingUser ? 'Saving...' : 'Save'}
      cancelText={isViewOnly ? undefined : 'Cancel'}
      okButtonProps={{
        loading: isEditingUser,
        disabled: isEditingUser,
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
        style: {
          borderColor: 'black',
          paddingLeft: '25px',
          paddingRight: '25px',
          borderRadius: '0px',
        },
        hidden: isViewOnly,
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
              <Input placeholder="John" disabled={isViewOnly} />
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
              <Input placeholder="Snow" disabled={isViewOnly} />
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
                  type: 'email',
                  message: 'Please input a valid email address!',
                },
              ]}
            >
              <Input placeholder="john@example.com" disabled={isViewOnly} />
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
              <Input placeholder="07012345678" disabled={isViewOnly} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="companyId" label="Company">
              <Select disabled={isViewOnly}>
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
              <Select disabled={isViewOnly}>
                {roles.map((role) => (
                  <Select.Option key={role.id} value={role.name}>
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

export default EditUserModal

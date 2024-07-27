import React from 'react'
import { Modal, Form, Input, Select } from 'antd'

interface PermissionsModalProps {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  form: any
  permissionsOptions: { value: string; label: string }[]
  isUpdatingPermissions: boolean
}

const UserPermissionsModal: React.FC<PermissionsModalProps> = ({
  visible,
  onOk,
  onCancel,
  form,
  permissionsOptions,
  isUpdatingPermissions,
}) => {
  return (
    <Modal
      title="User Permissions"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={isUpdatingPermissions ? 'Updating...' : 'Update'}
      cancelText="Cancel"
      okButtonProps={{
        loading: isUpdatingPermissions,
        disabled: isUpdatingPermissions,
        style: {
          backgroundColor: 'black',
          borderColor: 'black',
          paddingLeft: '25px',
          paddingRight: '25px',
          borderRadius: '0px',
        },
      }}
      cancelButtonProps={{
        disabled: isUpdatingPermissions,
        style: {
          borderColor: 'black',
          paddingLeft: '25px',
          paddingRight: '25px',
          borderRadius: '0px',
        },
      }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="userName"
          label="User Name"
          rules={[{ required: true, message: 'Please enter the user name' }]}
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
  )
}

export default UserPermissionsModal

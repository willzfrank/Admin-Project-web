import React, { useEffect } from 'react'
import { Modal, Form, Checkbox } from 'antd'
import { PermissionsFormProps } from '../../types/global'

const UserPermissionModal: React.FC<PermissionsFormProps> = ({
  visible,
  onUpdate,
  onCancel,
  user,
  permissionsOptions,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ permissions: user.permissions })
    }
  }, [user, form])

  return (
    <Modal
      title="Manage Permissions"
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onUpdate(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
      onCancel={onCancel}
      okText="Update"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="permissions" label="Permissions">
          <Checkbox.Group
            options={permissionsOptions.map((p) => ({
              label: p.name,
              value: p.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserPermissionModal

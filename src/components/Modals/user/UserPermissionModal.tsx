import React, { useEffect } from 'react'
import { Modal, Form, Select, Input } from 'antd'
import { UserData } from '../../../types/global'

interface UserPermissionsModalProps {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  form: any
  permissionsOptions: string[]
  isUpdatingPermissions: boolean
  user: UserData | null
  userPermissions: string[]
}

const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  visible,
  onOk,
  onCancel,
  form,
  permissionsOptions,
  isUpdatingPermissions,
  user,
  userPermissions,
}) => {
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : ''

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ permissions: userPermissions })
    }
  }, [visible, userPermissions, form])

  return (
    <Modal
      title="User Permissions"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={isUpdatingPermissions ? 'Updating...' : 'Update'}
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
      <Form form={form} layout="vertical">
        <Form.Item name="fullName" label="User Name">
          <Input value={fullName} disabled placeholder={fullName} />
        </Form.Item>
        <Form.Item name="permissions" label="Permissions">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select permissions"
            optionFilterProp="children"
          >
            {permissionsOptions.map((permission) => (
              <Select.Option key={permission} value={permission}>
                {permission}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserPermissionsModal

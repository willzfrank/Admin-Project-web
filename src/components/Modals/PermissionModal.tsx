import React from 'react'
import { Modal, Checkbox, Spin, Form, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface PermissionModalProps {
  isPermissionModalVisible: boolean
  setIsPermissionModalVisible: (visible: boolean) => void
  selectedRole: any
  availablePermissions: string[]
  isLoadingPermissions: boolean
  handlePermissionUpdate: (values: any) => void
  isUpdatingPermissions: boolean
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  isPermissionModalVisible,
  setIsPermissionModalVisible,
  selectedRole,
  availablePermissions,
  isLoadingPermissions,
  handlePermissionUpdate,
  isUpdatingPermissions,
}) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.submit()
  }

  const handleCancel = () => {
    setIsPermissionModalVisible(false)
  }

  const onFinish = (values: any) => {
    handlePermissionUpdate(values)
  }

  return (
    <Modal
      title={`Manage Permissions for ${selectedRole?.roleName}`}
      visible={isPermissionModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isUpdatingPermissions}
      okButtonProps={{ disabled: isUpdatingPermissions }}
      cancelButtonProps={{ disabled: isUpdatingPermissions }}
    >
      {isLoadingPermissions ? (
        <div className="flex items-center justify-center h-64">
          <Spin
            indicator={<LoadingOutlined spin />}
            className="text-black"
            size="large"
          />
        </div>
      ) : (
        <Form
          form={form}
          initialValues={{
            roleName: selectedRole?.roleName,
            permissions: selectedRole?.permissions,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="roleName" hidden>
            <input type="hidden" />
          </Form.Item>
          <Form.Item name="permissions">
            <Checkbox.Group>
              {availablePermissions.map((permission) => (
                <Checkbox key={permission} value={permission}>
                  {permission}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default PermissionModal

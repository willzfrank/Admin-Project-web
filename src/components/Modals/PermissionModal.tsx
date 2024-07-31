import React, { useEffect } from 'react'
import { Modal, Select, Spin, Form, Button, Input } from 'antd'
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

  useEffect(() => {
    if (selectedRole) {
      form.setFieldsValue({
        roleName: selectedRole.name,
        permissions: selectedRole.permissions,
      })
    }
  }, [selectedRole, form])

  return (
    <Modal
      title={`Role Permissions for ${selectedRole?.name}`}
      visible={isPermissionModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancel}
          style={{
            borderColor: 'black',
            color: 'black',
            borderRadius: 0,
          }}
          className="px-10"
          disabled={isUpdatingPermissions}
        >
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={handleOk}
          style={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: 0,
          }}
          className="px-10"
          loading={isUpdatingPermissions}
        >
          {isUpdatingPermissions ? 'Updating...' : 'Update'}
        </Button>,
      ]}
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
            roleName: selectedRole?.name,
            permissions: selectedRole?.permissions,
          }}
          layout="vertical"
          onFinish={onFinish}
          className="pt-5"
        >
          <Form.Item
            name="roleName"
            label={
              <span>
                Role Name <span style={{ color: 'red' }}>*</span>
              </span>
            }
          >
            <Input value={selectedRole?.name} disabled />
          </Form.Item>
          <Form.Item
            name="permissions"
            label={
              <span>
                Permissions <span style={{ color: 'red' }}>*</span>
              </span>
            }
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              loading={isLoadingPermissions}
            >
              {availablePermissions.map((permission) => (
                <Select.Option key={permission} value={permission}>
                  {permission}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default PermissionModal

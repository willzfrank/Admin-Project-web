import React, { useState } from 'react'
import { Modal, Input, Button, Form } from 'antd'

interface RoleModalProps {
  isModalVisible: boolean
  setIsModalVisible: (visible: boolean) => void
  handleProceed: (roleName: string) => void
  isCreatingRole: boolean
}

const RoleModal: React.FC<RoleModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  handleProceed,
  isCreatingRole,
}) => {
  const [roleName, setRoleName] = useState<string>('')

  const handleOk = () => {
    handleProceed(roleName)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setRoleName('')
  }

  return (
    <Modal
      title="New Role"
      visible={isModalVisible}
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
          disabled={isCreatingRole}
          className="px-10"
        >
          Close
        </Button>,
        <Button
          key="proceed"
          type="primary"
          onClick={handleOk}
          style={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: 0,
          }}
          loading={isCreatingRole}
          className="px-10"
        >
          {isCreatingRole ? 'loading...' : 'Proceed'}
        </Button>,
      ]}
    >
      <Form layout="vertical" className="my-5">
        <Form.Item
          label={
            <span>
              Role Name <span style={{ color: 'red' }}>*</span>
            </span>
          }
        >
          <Input
            placeholder="Enter role name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RoleModal

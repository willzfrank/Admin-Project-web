import React, { useState } from 'react'
import { Modal, Input, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

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
      title="Create New Role"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isCreatingRole}
      okButtonProps={{ disabled: isCreatingRole }}
      cancelButtonProps={{ disabled: isCreatingRole }}
    >
      <Input
        placeholder="Enter role name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
      />
      {isCreatingRole && (
        <Spin
          indicator={<LoadingOutlined spin />}
          className="text-black"
          size="large"
        />
      )}
    </Modal>
  )
}

export default RoleModal

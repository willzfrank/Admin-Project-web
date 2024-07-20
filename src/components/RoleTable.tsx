import React from 'react'
import { Table, Space, Button } from 'antd'

interface RoleData {
  key: string
  roleName: string
  dateCreated: string
  permissions: string[]
}

interface RoleTableProps {
  data: RoleData[]
  handlePermissions: (roleName: string) => void
  handleDelete: (roleName: string) => void
}

const RoleTable: React.FC<RoleTableProps> = ({
  data,
  handlePermissions,
  handleDelete,
}) => {
  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName',
      sorter: (a: RoleData, b: RoleData) =>
        a.roleName.localeCompare(b.roleName),
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      sorter: (a: RoleData, b: RoleData) =>
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
    },
    {
      title: () => <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (_: any, record: RoleData) => (
        <Space
          size="middle"
          direction="vertical"
          className="flex items-center justify-center"
        >
          <Button
            type="link"
            onClick={() => handlePermissions(record.roleName)}
          >
            Permissions
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.roleName)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return <Table columns={columns} dataSource={data} />
}

export default RoleTable

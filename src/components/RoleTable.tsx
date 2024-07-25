import React from 'react'
import { Table, Space, Button } from 'antd'
import { RoleData } from '../types/global'

interface RoleTableProps {
  data: RoleData[]
  handlePermissions: (name: string) => void
  handleDelete: (name: string) => void
}

const RoleTable: React.FC<RoleTableProps> = ({
  data,
  handlePermissions,
  handleDelete,
}) => {
  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: RoleData, b: RoleData) => a.name.localeCompare(b.name),
    },
    // {
    //   title: 'Date Created',
    //   dataIndex: 'dateCreated',
    //   key: 'dateCreated',
    //   sorter: (a: RoleData, b: RoleData) =>
    //     new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
    // },
    {
      title: () => <div style={{ textAlign: 'center' }}>Action</div>,
      key: 'action',
      render: (_: any, record: RoleData) => (
        <Space
          size="middle"
          direction="vertical"
          className="flex items-center justify-center"
        >
          <Button type="link" onClick={() => handlePermissions(record.name)}>
            Permissions
          </Button>
          {/* <Button
            type="link"
            danger
            onClick={() => handleDelete(record.name)}
          >
            Delete
          </Button> */}
        </Space>
      ),
    },
  ]

  return <Table columns={columns} dataSource={data} />
}

export default RoleTable

import React from 'react'
import { Table, Tag, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { UserData } from '../types/global'

interface UserTableProps {
  data: UserData[]
  onEdit: (user: UserData) => void
  onMoreDetails: (user: UserData) => void
  onExtraPermissions: (user: UserData) => void
  onToggleStatus: (user: UserData) => void
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  onEdit,
  onMoreDetails,
  onExtraPermissions,
  onToggleStatus,
}) => {
  const columns: ColumnsType<UserData> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'Status',
      key: 'isActive',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: UserData) => (
        <Space
          direction="vertical"
          size="small"
          className="flex items-center justify-center"
        >
          <span
            className="cursor-pointer text-[#134f5c]"
            onClick={() => onEdit(record)}
          >
            Edit
          </span>
          <span
            className="cursor-pointer text-[#7f6342]"
            onClick={() => onMoreDetails(record)}
          >
            More Details
          </span>
          <span
            className="cursor-pointer text-[#4a8136]"
            onClick={() => onExtraPermissions(record)}
          >
            Extra Permissions
          </span>
          <span
            className={`cursor-pointer ${
              record.isActive ? 'text-[#af3e2f]' : 'text-[#3c5fff]'
            }`}
            onClick={() => onToggleStatus(record)}
          >
            {record.isActive ? 'Disable' : 'Enable'}
          </span>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      scroll={{ x: 1000 }}
      pagination={{ pageSize: 10 }}
      className="w-full"
    />
  )
}

export default UserTable

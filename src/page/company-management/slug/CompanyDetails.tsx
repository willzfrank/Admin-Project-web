import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table, Spin, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { LoadingOutlined } from '@ant-design/icons'
import axiosInstance from '../../../components/util/AxiosInstance'
import { formatDate } from '../../../components/util/formatdate'
import { useBackButton } from '../../../Hooks/useBackButton'
import BackArrow from '../../../components/commons/BackArrow'
import { ActivityLogEntry, User } from '../../../types/global'
import SidebarLayout from '../../../layouts/Sidebar'

const { Text } = Typography

const CompanyDetails = () => {
  const [data, setData] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ActivityLogEntry
    direction: 'asc' | 'desc'
  } | null>(null)
  const { companyId } = useParams<{ companyId: string }>()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (companyId) {
          const response = await axiosInstance.get(
            `/Changes/GetByCompany?CompanyId=${companyId}`
          )
          setData(response?.data?.data || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch activity log. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [companyId])

  const { handleBackButton, ripplePosition } = useBackButton()

  const handleSort = (key: keyof ActivityLogEntry) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sortedData = [...data].sort((a, b) => {
      if (a[key] === null) return 1
      if (b[key] === null) return -1
      if (a[key] === null && b[key] === null) return 0

      if (key === 'createdAt') {
        const dateA = new Date(a[key] as string)
        const dateB = new Date(b[key] as string)
        return direction === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      } else {
        return direction === 'asc'
          ? a[key]! > b[key]!
            ? 1
            : -1
          : a[key]! < b[key]!
          ? 1
          : -1
      }
    })
    setData(sortedData)
  }

  const getSortIcon = (key: keyof ActivityLogEntry) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUpOutlined />
    ) : (
      <ArrowDownOutlined />
    )
  }

  const formatUser = (user: User | null) => {
    if (!user) return 'N/A'
    const roleStyle =
      user.roleName === 'Owner' ? { color: 'blue' } : { color: 'black' }
    return (
      <span>
        <span style={{ color: 'black' }}>
          {user.firstName} {user.lastName}
        </span>
        <span style={roleStyle}> ({user.roleName})</span>
      </span>
    )
  }

  const columns = [
    {
      title: (
        <Text strong onClick={() => handleSort('createdAt')}>
          Date {getSortIcon('createdAt')}
        </Text>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => (
        <span className="text-xs md:text-sm">{formatDate(text)}</span>
      ),
    },
    {
      title: (
        <Text strong onClick={() => handleSort('summary')}>
          Summary {getSortIcon('summary')}
        </Text>
      ),
      dataIndex: 'summary',
      key: 'summary',
      render: (text: string) => (
        <span className="text-xs md:text-sm">{text}</span>
      ),
    },
    {
      title: (
        <Text strong onClick={() => handleSort('user')}>
          User {getSortIcon('user')}
        </Text>
      ),
      dataIndex: 'user',
      key: 'user',
      render: (user: User | null) => (
        <span className="text-xs md:text-sm">{formatUser(user)}</span>
      ),
    },
  ]

  return (
    <SidebarLayout>
      <div className="px-4">
        <BackArrow
          handleBackButton={handleBackButton}
          ripplePosition={ripplePosition}
          title="Company History"
        />
        <div className="bg-gray-200 w-full md:p-8 md:pb-0 mx-auto">
          <div className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spin
                  indicator={<LoadingOutlined spin />}
                  className="text-black"
                  size="large"
                />
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : data.length === 0 ? (
              <p className="text-center">
                No history log found for this company.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={{ position: ['bottomRight'], pageSize: 100 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}

export default CompanyDetails

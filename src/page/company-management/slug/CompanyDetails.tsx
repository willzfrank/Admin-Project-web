import { Table, Spin } from 'antd'
import SidebarLayout from '../../../layouts/Sidebar'
import { LoadingOutlined } from '@ant-design/icons'
import BackArrow from '../../../components/commons/BackArrow'
import { useBackButton } from '../../../Hooks/useBackButton'

type Props = {}

const columns = [
  {
    title: <div style={{ textAlign: 'center' }}>Date </div>,
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    sortDirections: ['ascend', 'descend'],
    render: (text: string) => (
      <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
        (text)
      </span>
    ),
  },
  {
    title: <div style={{ textAlign: 'center' }}>Summary</div>,
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b),
    sortDirections: ['ascend', 'descend'],
    render: (text) => <span>{text}</span>,
  },
  {
    title: <div style={{ textAlign: 'center' }}>User</div>,
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    sortDirections: ['ascend', 'descend'],
    render: (text: string) => (
      <span className="text-xs py-4 px-6 flex items-center justify-center font-medium">
        {text}
      </span>
    ),
  },
]

const CompanyDetailsPage = (props: Props) => {
  const { handleBackButton, ripplePosition } = useBackButton()
  return (
    <SidebarLayout>
      <div className="px-4">
        <BackArrow
          handleBackButton={handleBackButton}
          ripplePosition={ripplePosition}
          title="Company History"
        />
      </div>
      {/* <div className="bg-gray-200 w-full md:p-8 p-4 pb-2 mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spin
              indicator={<LoadingOutlined spin />}
              className="text-black"
              size="large"
            />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No company found.</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ position: ['bottomRight'], pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </div>
        )}
      </div> */}
    </SidebarLayout>
  )
}

export default CompanyDetailsPage

import { useState, useEffect } from 'react'
import { message } from 'antd'
import axiosInstance from '../components/util/AxiosInstance'

// Define the type for the initial state and data
type InitialStateType = any[] // You can be more specific if you know the data structure

interface FetchDataResult {
  data: InitialStateType
  isLoading: boolean
}

const useFetchData = (
  url: string,
  initialState: InitialStateType = []
): FetchDataResult => {
  const [data, setData] = useState<InitialStateType>(initialState)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(url)
        if (response.data.status) {
          setData(response.data.data)
        } else {
          message.error('Failed to fetch data')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        message.error('An error occurred while fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, isLoading }
}

export default useFetchData

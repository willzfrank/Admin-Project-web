// useUsers.ts
import { useState, useEffect } from 'react'
import { UserData } from '../types/global'
import {
  fetchUsers,
  fetchCompanyDetails,
  fetchUserPermissions,
} from '../api/api'

export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<UserData[]>([])

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetchUsers()
        if (response.status) {
          const usersWithDetails = await Promise.all(
            response.data.map(async (user: UserData) => {
              const companyDetails = user.companyId
                ? await fetchCompanyDetails(user.companyId)
                : null
              const userPermissions = await fetchUserPermissions(user.id)
              return {
                ...user,
                companyName: companyDetails ? companyDetails.name : 'N/A',
                permissions: userPermissions,
              }
            })
          )
          setData(usersWithDetails)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  return { isLoading, data, setData }
}

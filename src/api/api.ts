import axiosInstance from "../components/util/AxiosInstance"

export const fetchUsers = async () => {
  const response = await axiosInstance.get('/Users/ViewAll')
  return response.data
}

export const fetchCompanyDetails = async (companyId: string) => {
  const response = await axiosInstance.get(
    `/Company/ViewById?CompanyId=${companyId}`
  )
  return response.data
}

export const fetchUserPermissions = async (userId: string) => {
  const response = await axiosInstance.get(`/Claims/GetByUser?userId=${userId}`)
  return response.data
}

export const fetchRoles = async () => {
  const response = await axiosInstance.get('/Roles/List')
  return response.data
}

export const fetchClaims = async () => {
  const response = await axiosInstance.get('/Claims/List')
  return response.data
}

export const fetchCompanies = async () => {
  const response = await axiosInstance.get('/Company/ViewAll')
  return response.data
}

export const createUser = async (userData: any) => {
  const response = await axiosInstance.post('/Users/Create', userData)
  return response.data
}

export const updateUser = async (userData: any) => {
  const response = await axiosInstance.post('/Users/Update', userData)
  return response.data
}

export const toggleUserStatus = async (userId: string) => {
  const response = await axiosInstance.get(
    `/Users/Status/Toggle?userId=${userId}`
  )
  return response.data
}

export const updateUserPermissions = async (
  userId: string,
  claims: string[]
) => {
  const response = await axiosInstance.post('/Claims/AddToUser', {
    userId,
    claims,
  })
  return response.data
}

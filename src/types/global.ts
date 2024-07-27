import { AxiosResponse } from 'axios'

export type User = {
  id: string
  firstName: string
  lastName: string
  roleName: string
}

export interface UserData {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  imageUrl: string | null
  companyId: string | null
  companyName: string | null
  roleName: string
  isActive: boolean
  createdAt: string
  permissions?: string[]
}

export interface CompanyData {
  id: string
  name: string
}

export interface RoleData {
  key: string
  id: string
  name: string
  // dateCreated: string
  permissions: string[]
}

export interface UserFormProps {
  visible: boolean
  onCreate: (values: any) => void
  onCancel: () => void
  roles: { id: number; name: string }[]
  companies: { id: number; name: string }[]
}

export interface EditUserFormProps {
  visible: boolean
  onUpdate: (values: any) => void
  onCancel: () => void
  user: any
  roles: { id: number; name: string }[]
  companies: { id: number; name: string }[]
}

export interface PermissionsFormProps {
  visible: boolean
  onUpdate: (values: any) => void
  onCancel: () => void
  user: any
  permissionsOptions: { id: number; name: string }[]
}

export interface PermissionsFormProps {
  visible: boolean
  onUpdate: (values: any) => void
  onCancel: () => void
  user: any
  permissionsOptions: { id: number; name: string }[]
}

export interface RawRoleData {
  id: string
  name: string
  // Add other properties that come from the API, if any
}

export interface Response<T> {
  status: boolean
  message?: string
  data: T
}

export interface HttpResponse<T> extends AxiosResponse<Response<T>> {}

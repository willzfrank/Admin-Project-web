import { AxiosResponse } from 'axios'

export type User = {
  id: string
  firstName: string
  lastName: string
  roleName: string
}

export interface RoleData {
  key: string
  id: string
  name: string
  // dateCreated: string
  permissions: string[]
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

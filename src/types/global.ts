import { AxiosResponse } from 'axios'

export type User = {
  id: string
  firstName: string
  lastName: string
  roleName: string
}

export interface Response<T> {
  status: boolean
  message: string
  data: T
}

export interface HttpResponse<T> extends AxiosResponse<Response<T>> {}

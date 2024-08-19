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

export type TaskStatusType = 'Todo' | 'InProgress' | 'OnHold' | 'Done'

export type Project = {
  id: string
  name: string
  companyId: string
}

export type Phase = {
  code: string
  status: TaskStatusType
  projectId: string
  project: null | Project
  creatorId: string
  creator: null | User
  supervisorId: null | string
  supervisor: null | User
  name: string
  description: string
  id: string
  createdAt: string
  updatedAt: null | string
  issues: {
    total: number
    resolved: number
    unresolved: number
  }
}

export type SeverityType = 'Informational' | 'Warning' | 'Critical'

export type IssueStatusType = 'Unresolved' | 'Resolved'

export type statusType = 'Active' | 'Inactive'


export type ProjectStatusType = 'Todo' | 'InProgress' | 'OnHold' | 'Done'

export interface Issue {
  id: string
  createdAt: string
  name: string
  description: string
  phase: null | Phase
  severity: SeverityType
  status: IssueStatusType
  code: string
}

export type NewProjectData = {
  name: string
  description: string
  status: ProjectStatusType
  supervisorId?: string
  companyId: string
  documents: string[]
}

export interface ProjectData extends NewProjectData {
  code: string
  creatorId: string
  creator: string | null
  supervisor: string | null
  company: string | null
  id: string
  createdAt: string
  updatedAt: string | null
}

export interface Company {
  isActive: boolean
  documents: never[]
  code: string
  email: string
  phoneNumber: string
  creatorId: string
  name: string
  description: string
  id: string
  createdAt: string
  updatedAt: string
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

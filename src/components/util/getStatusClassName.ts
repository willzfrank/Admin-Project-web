import { ProjectStatusType } from "../../types/global"

export const getStatusClass = (status: ProjectStatusType): string => {
  switch (status) {
    case 'Todo':
      return 'text-black'
    case 'InProgress':
      return 'text-[#8375ff]'
    case 'OnHold':
      return 'text-[#ff878e]'
    case 'Done':
      return 'text-[#91a991]'
    default:
      return 'text-inherit'
  }
}

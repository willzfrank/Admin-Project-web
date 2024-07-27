import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from './constant'

interface CustomAxiosInstance extends AxiosInstance {
  isAuthError: (error: any) => boolean
}

const axiosInstance: CustomAxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authData = localStorage.getItem('auth')
    if (authData) {
      const { token } = JSON.parse(authData)
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error: Error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleError(error)
    return Promise.reject(error)
  }
)

function handleError(error: AxiosError) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        handleAuthError('Your session has expired. Please log in again.')
        break
      case 403:
        handleAuthError('You do not have permission to access this resource.')
        break
      case 404:
        toast.error('The requested resource was not found.')
        break
      case 500:
        toast.error(
          'An internal server error occurred. Please try again later.'
        )
        break
      default:
        toast.error('An error occurred. Please try again later.')
    }
  } else if (error.request) {
    toast.error(
      'No response received from the server. Please check your internet connection.'
    )
  } else {
    toast.error('An error occurred while setting up the request.')
  }
}

function handleAuthError(message: string) {
  // Clear local storage
  localStorage.removeItem('auth')
  localStorage.removeItem('user')

  toast.error(message, {
    duration: 5000,
    position: 'top-center',
  })

  // Only redirect if not already on the login page
  if (window.location.pathname !== '/login') {
    setTimeout(() => {
      window.location.replace('/login')
    }, 500)
  }
}

axiosInstance.isAuthError = (error: any): boolean => {
  return (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  )
}

export default axiosInstance

import { useNavigate } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { baseUrl } from '../../components/util/constant'
import axiosInstance from '../../components/util/AxiosInstance'

type Props = {}

const Login: React.FC<Props> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Function to handle login
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/Home/Authorize`, {
        username: email,
        password,
      })

      // Check the API response status
      if (response.data.Status === false) {
        // If status is false, show the error message from the response
        const errorMessage =
          response.data.Message || 'Login failed. Please try again.'
        toast.error(errorMessage)
      } else {
        // If status is true, proceed with login
        const { userId, token, companyId } = response.data.data

        // Check if the role is Supervisor
        if (companyId !== null) {
          toast.error(
            'You do not have the required permissions to access this application.'
          )
        } else {
          toast.success(response.data.message || 'Login successful')
          // Store userId, token, and companyId in local storage
          localStorage.setItem(
            'auth',
            JSON.stringify({ userId, token, companyId })
          )

          // Optionally fetch and store user details if needed
          await fetchAndStoreUserDetails(userId)

          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        }
      }
    } catch (error) {
      // Handle network or server errors
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch and store user details
  const fetchAndStoreUserDetails = async (userId: string) => {
    try {
      const userResponse = await axiosInstance.get(
        `${baseUrl}/Users/ViewById?Id=${userId}`
      )
      if (userResponse.data && userResponse.data.Status) {
        const user = userResponse.data.data
        localStorage.setItem('user', JSON.stringify(user))
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  return (
    <section className="bg-gray-50 h-screen w-screen  flex items-center justify-center  dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center w-full px-6 py-2 mx-auto md:h-screen lg:py-0">
        <a
          href="/dashboard"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Logo here
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 text-center md:text-2xl dark:text-white">
              Admin Sign-In
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {' '}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1.5 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-gray-800 focus:outline-none font-medium text-sm px-5 py-2.5 text-center bg-black"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign in'}{' '}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login

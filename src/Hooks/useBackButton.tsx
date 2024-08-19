import { MouseEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useBackButton = () => {
  const [ripplePosition, setRipplePosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (ripplePosition) {
      const timer = setTimeout(() => {
        setRipplePosition(null)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [ripplePosition])

  const handleBackButton = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setRipplePosition({ x, y })
    navigate(-1)
  }

  return { handleBackButton, ripplePosition }
}

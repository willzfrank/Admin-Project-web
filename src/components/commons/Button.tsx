'use client'

import { Icon } from '@iconify/react'
import { MouseEvent, useRef } from 'react'
import { Link } from 'react-router-dom'

function Button({
  text,
  icon,
  iconPosition = 'right',
  iconClass,
  className,
  link,
  size,
  type,
  buttonType = 'default',
  shade = 'dark',
  disabled,
  showRipple,
  isLoading,
  loadingText = 'Please wait',
  action,
}: {
  text?: string
  icon?: string
  onClick?: () => void
  iconClass?: string
  iconPosition?: 'left' | 'right'
  className?: string
  link?: string
  size: 'large' | 'medium' | 'small' | 'tiny'
  type?: 'button' | 'reset' | 'submit'
  buttonType?: 'default' | 'primary' | 'secondary'
  shade?: 'dark' | 'light'
  disabled?: boolean
  showRipple?: boolean
  isLoading?: boolean
  loadingText?: string
  action?: (e?: any) => void
}) {
  const shades = {
    dark: {
      primary:
        'bg-primary-main hover:bg-btnPrimaryHover active:bg-btnLightPrimaryActive disabled:bg-btnDisabledSec disabled:text-textDisabled',
      secondary:
        'bg-btnSecDisabled border-[1px] border-btnActiveSec hover:border-transparent active:bg-btnActiveBg disabled:bg-btnDisabledSec disabled:text-textDisabled',
      default: 'bg-white disabled:text-textDisabled',
    },
    light: {
      primary:
        'bg-btnDisabledSec hover:bg-btnPrimaryHoverBg active:bg-primary-lighter  disabled:bg-btnPrimaryDisabled disabled:text-textDisabled',
      secondary:
        'bg-btnActiveBg hover:bg-btnHoverSec active:bg-btnActiveSec disabled:bg-btnSecDisabled disabled:text-textDisabled',
      default: 'bg-white disabled:text-textDisabled',
    },
  }

  const height = {
    large: 'h-[52px] px-6 py-2',
    medium: 'h-12 px-6 py-2',
    small: 'h-10 px-4 py-2.5',
    tiny: 'h-8 px-4 py-1.5',
  }
  const bg: {
    default: string
    primary: string
    secondary: string
  } = {
    default: shades[shade].default,
    primary: shades[shade].primary,
    secondary: shades[shade].secondary,
  }

  const btn = useRef<HTMLButtonElement>(null)

  const ripples = (event: MouseEvent<HTMLButtonElement>) => {
    const circle = document.createElement('span')
    if (btn.current) {
      const diameter = Math.max(
        btn.current.clientWidth,
        btn.current.clientHeight
      )
      const radius = diameter / 2

      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${
        event.clientX - (btn.current.getBoundingClientRect().left + radius)
      }px`
      circle.style.top = `${
        event.clientY - (btn.current.getBoundingClientRect().top + radius)
      }px`
      circle.classList.add('custom-ripple')

      const ripple = btn.current.querySelector('.custom-ripple')

      if (ripple) {
        ripple.remove()
      }

      btn.current.appendChild(circle)
    }
  }

  const handler = (event: MouseEvent<HTMLButtonElement>) => {
    if (showRipple && !isLoading) ripples(event)

    if (action) action()
  }

  const button = (
    <button
      onClick={handler}
      ref={btn}
      className={`relative overflow-clip flex items-center justify-center outline-none 
                ${className} ${bg[buttonType]} ${height[size]} 
                 outline outline-[hidden] outline-0 ring-0 ${
                   isLoading && 'animate-pulse'
                 }`}
      type={type}
      disabled={disabled || isLoading}
    >
      {icon && iconPosition === 'left' && (
        <Icon icon={icon} className={iconClass} />
      )}

      {isLoading && iconPosition !== 'left' && (
        <div className="flex items-center justify-start grow mr-5">
          <Icon icon="uil:spinner" className={'w-6 h-6 animate-spin'} />
        </div>
      )}

      <div>{isLoading ? <span>{loadingText}</span> : <p>{text}</p>}</div>
      {isLoading && iconPosition !== 'right' && (
        <div className="flex items-center justify-start grow ml-5">
          <Icon icon="uil:spinner" className={'w-6 h-6 animate-spin'} />
        </div>
      )}

      {icon && iconPosition === 'right' && (
        <Icon icon={icon} className={iconClass} />
      )}
    </button>
  )

  return link ? (
    <Link to={link} className="outline-none">
      {button}
    </Link>
  ) : (
    button
  )
}

export default Button

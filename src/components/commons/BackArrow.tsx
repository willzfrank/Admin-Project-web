import { Icon } from '@iconify/react'

type RipplePosition = {
  x: number
  y: number
}

type Props = {
  ripplePosition?: RipplePosition | null
  handleBackButton?: (event: React.MouseEvent<HTMLDivElement>) => void
  title: string
}

const BackArrow = (props: Props) => {
  return (
    <div className="flex items-center gap-2.5 md:mt-0 mt-10 mb-10 ">
      <div
        className="flex items-center justify-center rounded-full bg-gray-100 w-[30px] h-[30px] md:h-[50px] md:w-[50px] cursor-pointer relative overflow-hidden"
        onClick={props.handleBackButton}
      >
        <Icon icon="ep:back" className="w-4 md:w-6  h-4 md:h-6" />
        {props.ripplePosition && (
          <span
            className="ripple absolute rounded-full bg-gray-300 opacity-50"
            style={{
              left: props.ripplePosition.x,
              top: props.ripplePosition.y,
              animation: 'ripple 0.6s linear',
            }}
          />
        )}
      </div>

      <h2 className="text-xl font-bold">{props.title}</h2>
    </div>
  )
}

export default BackArrow

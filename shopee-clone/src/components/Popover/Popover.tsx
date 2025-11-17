import React, { useRef, useState, useId, type ElementType } from 'react'
import { FloatingPortal, useFloating, arrow, shift, offset, type Placement } from '@floating-ui/react-dom-interactions'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode // ở ngoài truyền vào children và popover luôn
  className?: string
  as?: ElementType
  placement?: Placement
}

export default function Popover({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  placement = 'bottom-end'
}: Props) {
  const [open, setOpen] = useState(false)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    // arrow trong floating-ui là 1 middleware
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement // ở phía dưới nằm cuối cùng
  })

  const id = useId()

  // Custom cho nó nằm trong thẻ body và ngang cấp root
  const showPopover = () => {
    setOpen(true)
  }

  const hidePopover = () => {
    setOpen(false)
  }

  return (
    <div className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {/* Children là phần show lên -> phần svg */}
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              // Làm hiệu ứng
              initial={{ x: 0, transform: 'scale(0)' }}
              animate={{ x: 1, transform: 'scale(1)' }}
              exit={{ x: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='border-x-transparent border-t-transparent border-b-white border-11 absolute -translate-y-full'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
        {/* show tooltip */}
      </FloatingPortal>
    </div>
  )
}

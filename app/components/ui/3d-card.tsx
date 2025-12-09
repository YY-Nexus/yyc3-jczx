"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface Card3DProps {
  children: ReactNode
  className?: string
  backgroundGradient?: string
}

export function Card3D({
  children,
  className = "",
  backgroundGradient = "from-blue-100 via-purple-50 to-pink-50",
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth out the mouse tracking with springs
  const springConfig = { damping: 20, stiffness: 300 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Transform mouse position to rotation values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  // Handle mouse move on card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - rect.left) / width - 0.5
    const normalizedY = (e.clientY - rect.top) / height - 0.5

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative group perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`relative w-full h-full rounded-xl bg-gradient-to-br ${backgroundGradient} p-0.5 shadow-lg transition-all duration-300`}
        style={{
          rotateX: hovering ? rotateX : 0,
          rotateY: hovering ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            transform: "translateZ(2px)",
          }}
        />

        <div
          className="h-full w-full rounded-[10px] bg-white p-4 shadow-sm"
          style={{
            transform: "translateZ(1px)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

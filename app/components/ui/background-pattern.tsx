"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface BackgroundPatternProps {
  variant?: "default" | "gradient" | "dots" | "waves"
}

export function BackgroundPattern({ variant = "default" }: BackgroundPatternProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (variant === "dots") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
    )
  }

  if (variant === "waves") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z"
            fill="url(#gradient1)"
            animate={{
              d: [
                "M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z",
                "M0,50 C30,40 70,60 100,50 L100,100 L0,100 Z",
                "M0,50 C30,60 70,40 100,50 L100,100 L0,100 Z",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 10,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -inset-[100px] opacity-30 blur-3xl"
          animate={{
            background: [
              "radial-gradient(circle at calc(50% + 200px) calc(50% - 300px), rgba(79, 70, 229, 0.3) 0%, rgba(0, 0, 0, 0) 40%), radial-gradient(circle at calc(50% - 200px) calc(50% + 300px), rgba(236, 72, 153, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
              "radial-gradient(circle at calc(50% - 200px) calc(50% - 300px), rgba(79, 70, 229, 0.3) 0%, rgba(0, 0, 0, 0) 40%), radial-gradient(circle at calc(50% + 200px) calc(50% + 300px), rgba(236, 72, 153, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
              "radial-gradient(circle at calc(50% + 200px) calc(50% - 300px), rgba(79, 70, 229, 0.3) 0%, rgba(0, 0, 0, 0) 40%), radial-gradient(circle at calc(50% - 200px) calc(50% + 300px), rgba(236, 72, 153, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>
    )
  }

  // Default pattern
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <motion.div
          className="absolute -inset-[100px]"
          animate={{
            background: [
              `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 60%)`,
              `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.15) 0%, rgba(0, 0, 0, 0) 60%)`,
              `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 60%)`,
            ],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
    </div>
  )
}

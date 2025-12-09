"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface LogoProps {
  animated?: boolean
}

export function Logo({ animated = false }: LogoProps) {
  if (animated) {
    return (
      <div className="flex items-center space-x-2">
        <div className="relative w-16 h-16 overflow-visible">
          <motion.div
            animate={{
              rotateY: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <Image src="/images/logo.png" alt="YanYu Cloud³" width={64} height={64} className="object-contain" />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-blue-500 rounded-full opacity-30 z-0"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="relative w-10 h-10 overflow-hidden">
        <Image src="/images/logo.png" alt="YanYu Cloud³" width={40} height={40} className="object-contain" />
      </div>
      <div className="flex flex-col">
        <motion.span
          className="font-bold text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          style={{ backgroundSize: "200% auto" }}
        >
          言语云³
        </motion.span>
        <span className="text-xs text-muted-foreground leading-tight">YY C³-IC</span>
      </div>
    </Link>
  )
}

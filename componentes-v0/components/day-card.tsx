"use client"

import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { Coffee, Droplet, IceCream } from "lucide-react"

import { cn } from "@/lib/utils"

interface DayCardProps {
  date: Date
  onClick: () => void
  isDisabled?: boolean
}

export default function DayCard({ date, onClick, isDisabled = false }: DayCardProps) {
  // Mock data - in a real app, this would come from a database
  const hasSales = Math.random() > 0.5
  const isTroteDay = Math.random() > 0.7

  // Mock sales data
  const sodaCups = hasSales ? Math.floor(Math.random() * 20) : 0
  const sodaBottles = hasSales ? Math.floor(Math.random() * 10) : 0
  const popsicles = hasSales ? Math.floor(Math.random() * 15) : 0

  return (
    <motion.div
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={cn(
        "bg-white rounded-lg shadow-sm border p-2 sm:p-3 h-24 sm:h-32 cursor-pointer transition-colors text-xs sm:text-sm",
        isToday(date) && "border-emerald-500 border-2",
        isDisabled && "opacity-50 cursor-not-allowed bg-gray-50",
        hasSales && "bg-emerald-50",
      )}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <span className={cn("text-sm font-medium", isToday(date) && "text-emerald-600")}>
            {format(date, "dd", { locale: ptBR })}
          </span>
          {isTroteDay && (
            <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full">Trote</span>
          )}
        </div>

        {hasSales && (
          <div className="flex flex-col gap-1 mt-auto">
            {sodaCups > 0 && (
              <div className="flex items-center text-xs text-gray-600">
                <Droplet className="h-3 w-3 mr-1" />
                <span>{sodaCups} copos</span>
              </div>
            )}

            {sodaBottles > 0 && (
              <div className="flex items-center text-xs text-gray-600">
                <Coffee className="h-3 w-3 mr-1" />
                <span>{sodaBottles} garrafas</span>
              </div>
            )}

            {popsicles > 0 && (
              <div className="flex items-center text-xs text-gray-600">
                <IceCream className="h-3 w-3 mr-1" />
                <span>{popsicles} picolés</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { X, Coffee, Droplet, IceCream, Ticket, Heart, Mail, Plus, PieChart } from "lucide-react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Bar } from "react-chartjs-2"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface DayModalProps {
  date: Date
  onClose: () => void
  onSave: (sale: any) => void
}

interface SaleItem {
  id: string
  name: string
  icon: React.ReactNode
  count: number
  price: number
  isTroteItem?: boolean
}

// Product prices
const PRICES = {
  "soda-cup": 3.5,
  "soda-bottle": 5.0,
  popsicle: 2.5,
  bingo: 10.0,
  "love-chain": 2.0,
  "elegant-mail": 1.5,
}

export default function DayModal({ date, onClose, onSave }: DayModalProps) {
  const [isTroteDay, setIsTroteDay] = useState(false)
  const [customItemName, setCustomItemName] = useState("")
  const [customItemPrice, setCustomItemPrice] = useState("")

  // Initial sales items
  const [items, setItems] = useState<SaleItem[]>([
    {
      id: "soda-cup",
      name: "Refri (copo)",
      icon: <Droplet className="h-4 w-4" />,
      count: 0,
      price: PRICES["soda-cup"],
    },
    {
      id: "soda-bottle",
      name: "Refri (garrafa)",
      icon: <Coffee className="h-4 w-4" />,
      count: 0,
      price: PRICES["soda-bottle"],
    },
    { id: "popsicle", name: "Picolé", icon: <IceCream className="h-4 w-4" />, count: 0, price: PRICES["popsicle"] },
    {
      id: "bingo",
      name: "Cartela de Bingo",
      icon: <Ticket className="h-4 w-4" />,
      count: 0,
      price: PRICES["bingo"],
      isTroteItem: true,
    },
    {
      id: "love-chain",
      name: "Cadeia do Amor",
      icon: <Heart className="h-4 w-4" />,
      count: 0,
      price: PRICES["love-chain"],
      isTroteItem: true,
    },
    {
      id: "elegant-mail",
      name: "Correio Elegante",
      icon: <Mail className="h-4 w-4" />,
      count: 0,
      price: PRICES["elegant-mail"],
      isTroteItem: true,
    },
  ])

  const [customItems, setCustomItems] = useState<SaleItem[]>([])

  // Calculate total sales
  const totalSales = [...items, ...customItems].reduce((total, item) => {
    return total + item.count * item.price
  }, 0)

  // Prepare chart data
  const chartData = {
    labels: [...items, ...customItems].filter((item) => item.count > 0).map((item) => item.name),
    datasets: [
      {
        label: "Valor (R$)",
        data: [...items, ...customItems].filter((item) => item.count > 0).map((item) => item.count * item.price),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `R$ ${value}`,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const handleIncrement = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item)))
  }

  const handleDecrement = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id && item.count > 0 ? { ...item, count: item.count - 1 } : item)),
    )
  }

  const handleIncrementCustom = (id: string) => {
    setCustomItems((prev) => prev.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item)))
  }

  const handleDecrementCustom = (id: string) => {
    setCustomItems((prev) =>
      prev.map((item) => (item.id === id && item.count > 0 ? { ...item, count: item.count - 1 } : item)),
    )
  }

  const handleAddCustomItem = () => {
    if (customItemName.trim() && Number.parseFloat(customItemPrice) > 0) {
      const newItem: SaleItem = {
        id: `custom-${Date.now()}`,
        name: customItemName,
        icon: <Plus className="h-4 w-4" />,
        count: 0,
        price: Number.parseFloat(customItemPrice),
      }
      setCustomItems((prev) => [...prev, newItem])
      setCustomItemName("")
      setCustomItemPrice("")
    }
  }

  const handleSave = () => {
    // Prepare sales data
    const salesData = {
      date: format(date, "yyyy-MM-dd"),
      isTroteDay,
      items: [...items, ...customItems]
        .filter((item) => item.count > 0)
        .map((item) => ({
          id: item.id,
          name: item.name,
          count: item.count,
          price: item.price,
          total: item.count * item.price,
        })),
      totalAmount: totalSales,
    }

    onSave(salesData)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Switch id="trote-day" checked={isTroteDay} onCheckedChange={setIsTroteDay} />
            <Label htmlFor="trote-day">Dia de Trote</Label>
          </div>

          <Tabs defaultValue="items">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="items">Itens</TabsTrigger>
              <TabsTrigger value="chart">Gráfico</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-4">
              <h3 className="font-medium text-gray-700">Itens Vendidos</h3>

              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn("flex items-center justify-between py-2", item.isTroteItem && !isTroteDay && "hidden")}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <div>
                      <span>{item.name}</span>
                      <div className="text-xs text-gray-500">R$ {item.price.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDecrement(item.id)}
                      disabled={item.count === 0}
                    >
                      <span>-</span>
                    </Button>
                    <span className="w-8 text-center">{item.count}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleIncrement(item.id)}>
                      <span>+</span>
                    </Button>
                  </div>
                </div>
              ))}

              {customItems.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="font-medium text-gray-700">Outros Itens</h3>

                  {customItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <div>
                          <span>{item.name}</span>
                          <div className="text-xs text-gray-500">R$ {item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDecrementCustom(item.id)}
                          disabled={item.count === 0}
                        >
                          <span>-</span>
                        </Button>
                        <span className="w-8 text-center">{item.count}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleIncrementCustom(item.id)}
                        >
                          <span>+</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <Separator className="my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <Input
                    placeholder="Adicionar outro item..."
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Preço"
                    type="number"
                    min="0"
                    step="0.01"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleAddCustomItem}
                disabled={!customItemName.trim() || !(Number.parseFloat(customItemPrice) > 0)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Adicionar Item</span>
              </Button>
            </TabsContent>

            <TabsContent value="chart">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Resumo de Vendas</h3>
                  <PieChart className="h-5 w-5 text-gray-500" />
                </div>

                <div className="h-[40vh] max-h-[300px] mx-auto">
                  {totalSales > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div className="text-gray-500">
                        <PieChart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Adicione itens para visualizar o gráfico</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total de Vendas:</span>
                    <span className="font-bold">R$ {totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Itens Diferentes:</span>
                    <span className="font-bold">
                      {[...items, ...customItems].filter((item) => item.count > 0).length}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <Button variant="outline" className="mr-2" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={totalSales <= 0}>
            Salvar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

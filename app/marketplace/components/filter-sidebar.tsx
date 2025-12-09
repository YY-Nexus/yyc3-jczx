"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { categories } from "@/app/data/integrations"

interface FilterSidebarProps {
  onClose: () => void
}

export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handlePriceTypeChange = (type: string) => {
    setSelectedPriceTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const applyFilters = () => {
    // 构建查询参数
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","))
    }

    if (selectedPriceTypes.length > 0) {
      params.append("priceTypes", selectedPriceTypes.join(","))
    }

    if (ratingFilter > 0) {
      params.append("minRating", ratingFilter.toString())
    }

    if (priceRange[0] > 0 || priceRange[1] < 100) {
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())
    }

    // 跳转到搜索结果页面
    window.location.href = `/marketplace/search?${params.toString()}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card className="p-6 relative">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose} aria-label="关闭筛选">
          <X className="h-4 w-4" />
        </Button>

        <h3 className="text-lg font-semibold mb-4">高级筛选</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 类别筛选 */}
          <div>
            <h4 className="font-medium mb-2">类别</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.slice(1).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* 价格筛选 */}
          <div>
            <h4 className="font-medium mb-2">价格类型</h4>
            <div className="space-y-2 mb-4">
              {["免费", "免费增值", "付费"].map((type, index) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-type-${index}`}
                    checked={selectedPriceTypes.includes(type)}
                    onCheckedChange={() => handlePriceTypeChange(type)}
                  />
                  <Label htmlFor={`price-type-${index}`} className="text-sm cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>

            <h4 className="font-medium mb-2">
              价格范围 (¥{priceRange[0]} - ¥{priceRange[1]})
            </h4>
            <Slider value={priceRange} min={0} max={100} step={5} onValueChange={setPriceRange} className="mb-6" />
          </div>

          {/* 评分筛选 */}
          <div>
            <h4 className="font-medium mb-2">最低评分 ({ratingFilter}星)</h4>
            <Slider
              value={[ratingFilter]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={(value) => setRatingFilter(value[0])}
              className="mb-6"
            />

            <div className="flex justify-end mt-4">
              <Button onClick={applyFilters}>应用筛选</Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

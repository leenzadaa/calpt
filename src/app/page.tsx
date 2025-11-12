"use client"

import { useState, useEffect } from "react"
import { Plus, Target, TrendingUp, Apple, Coffee, Utensils, Cookie, ChevronDown, ChevronUp, Trash2, User, Crown, Camera, Upload, Loader2, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import Link from "next/link"

// Tipos
interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meal: "breakfast" | "lunch" | "dinner" | "snack"
  time: string
}

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Alimentos comuns portugueses
const commonFoods = [
  { name: "Pão de trigo (1 fatia)", calories: 80, protein: 3, carbs: 15, fat: 1 },
  { name: "Arroz branco cozido (100g)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Batata cozida (100g)", calories: 87, protein: 2, carbs: 20, fat: 0.1 },
  { name: "Frango grelhado (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Bacalhau cozido (100g)", calories: 82, protein: 18, carbs: 0, fat: 0.7 },
  { name: "Ovo cozido (1 unidade)", calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: "Queijo fresco (50g)", calories: 70, protein: 6, carbs: 2, fat: 4 },
  { name: "Iogurte natural (125g)", calories: 75, protein: 5, carbs: 7, fat: 3 },
  { name: "Banana (1 média)", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: "Maçã (1 média)", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: "Café com leite (200ml)", calories: 60, protein: 3, carbs: 5, fat: 3 },
  { name: "Pastel de nata (1 unidade)", calories: 200, protein: 3, carbs: 25, fat: 10 },
]

export default function CalorieTrackerApp() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = useState(false)
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: true,
  })

  // Form states
  const [selectedMeal, setSelectedMeal] = useState<string>("breakfast")
  const [foodName, setFoodName] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")

  // Photo analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<string>("")

  // Carregar dados do localStorage apenas no cliente
  useEffect(() => {
    setMounted(true)
    const savedFoods = localStorage.getItem("calorieTracker_foods")
    const savedGoals = localStorage.getItem("calorieTracker_goals")
    
    if (savedFoods) setFoods(JSON.parse(savedFoods))
    if (savedGoals) setDailyGoals(JSON.parse(savedGoals))
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("calorieTracker_foods", JSON.stringify(foods))
    }
  }, [foods, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("calorieTracker_goals", JSON.stringify(dailyGoals))
    }
  }, [dailyGoals, mounted])

  // Calcular totais
  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const addFood = () => {
    if (!foodName || !calories) return

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName,
      calories: Number(calories),
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      meal: selectedMeal as any,
      time: new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    }

    setFoods([...foods, newFood])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const deleteFood = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id))
  }

  const resetForm = () => {
    setFoodName("")
    setCalories("")
    setProtein("")
    setCarbs("")
    setFat("")
    setSelectedImage(null)
    setAnalysisResult("")
  }

  const selectCommonFood = (food: typeof commonFoods[0]) => {
    setFoodName(food.name)
    setCalories(food.calories.toString())
    setProtein(food.protein.toString())
    setCarbs(food.carbs.toString())
    setFat(food.fat.toString())
  }

  const toggleMeal = (meal: string) => {
    setExpandedMeals((prev) => ({ ...prev, [meal]: !prev[meal] }))
  }

  const getMealFoods = (meal: string) => foods.filter((f) => f.meal === meal)

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case "breakfast":
        return <Coffee className="w-5 h-5" />
      case "lunch":
        return <Utensils className="w-5 h-5" />
      case "dinner":
        return <Apple className="w-5 h-5" />
      case "snack":
        return <Cookie className="w-5 h-5" />
      default:
        return null
    }
  }

  const getMealName = (meal: string) => {
    switch (meal) {
      case "breakfast":
        return "Pequeno-almoço"
      case "lunch":
        return "Almoço"
      case "dinner":
        return "Jantar"
      case "snack":
        return "Lanches"
      default:
        return meal
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setAnalysisResult("")

    try {
      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: selectedImage }),
      })

      const data = await response.json()

      if (data.error) {
        setAnalysisResult("Erro ao analisar imagem. Tente novamente.")
        return
      }

      // Preencher formulário com dados analisados
      setFoodName(data.name || "")
      setCalories(data.calories?.toString() || "")
      setProtein(data.protein?.toString() || "")
      setCarbs(data.carbs?.toString() || "")
      setFat(data.fat?.toString() || "")
      setAnalysisResult(data.description || "Análise concluída!")
    } catch (error) {
      setAnalysisResult("Erro ao analisar imagem. Verifique sua conexão.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const caloriesRemaining = dailyGoals.calories - totals.calories
  const caloriesProgress = (totals.calories / dailyGoals.calories) * 100

  // Não renderizar até estar montado no cliente
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-xl">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/498c318c-7cdd-4455-b2d0-be15fb90cf5a.png" 
                  alt="CalPT Logo" 
                  className="w-6 h-6"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CalPT</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contador de Calorias com IA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Link href="/perfil">
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </Button>
              </Link>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 gap-2">
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Seja Premium</span>
                </Button>
              </Link>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Alimento</DialogTitle>
                    <DialogDescription>
                      Tire uma foto do prato ou adicione manualmente
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="photo" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="photo" className="gap-2">
                        <Camera className="w-4 h-4" />
                        Foto com IA
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Manual
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab de Foto com IA */}
                    <TabsContent value="photo" className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                        {selectedImage ? (
                          <div className="space-y-4">
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded-lg shadow-lg"
                            />
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedImage(null)
                                setAnalysisResult("")
                              }}
                            >
                              Remover Imagem
                            </Button>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                            <div className="space-y-3">
                              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                  Tire uma foto do prato
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  A IA irá analisar e calcular as calorias automaticamente
                                </p>
                              </div>
                              <Button type="button" variant="outline" className="gap-2">
                                <Upload className="w-4 h-4" />
                                Escolher Imagem
                              </Button>
                            </div>
                          </label>
                        )}
                      </div>

                      {selectedImage && !isAnalyzing && !analysisResult && (
                        <Button
                          onClick={analyzeImage}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          Analisar com IA
                        </Button>
                      )}

                      {isAnalyzing && (
                        <div className="text-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                            Analisando imagem com IA...
                          </p>
                        </div>
                      )}

                      {analysisResult && (
                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">{analysisResult}</p>
                        </div>
                      )}

                      {/* Formulário preenchido pela IA */}
                      {analysisResult && (
                        <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                          <div>
                            <Label htmlFor="meal-photo">Refeição</Label>
                            <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">Pequeno-almoço</SelectItem>
                                <SelectItem value="lunch">Almoço</SelectItem>
                                <SelectItem value="dinner">Jantar</SelectItem>
                                <SelectItem value="snack">Lanche</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="foodName-photo">Nome do Alimento</Label>
                            <Input
                              id="foodName-photo"
                              value={foodName}
                              onChange={(e) => setFoodName(e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="calories-photo">Calorias (kcal)</Label>
                              <Input
                                id="calories-photo"
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="protein-photo">Proteína (g)</Label>
                              <Input
                                id="protein-photo"
                                type="number"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="carbs-photo">Hidratos (g)</Label>
                              <Input
                                id="carbs-photo"
                                type="number"
                                value={carbs}
                                onChange={(e) => setCarbs(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="fat-photo">Gordura (g)</Label>
                              <Input
                                id="fat-photo"
                                type="number"
                                value={fat}
                                onChange={(e) => setFat(e.target.value)}
                              />
                            </div>
                          </div>

                          <Button
                            onClick={addFood}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600"
                          >
                            Adicionar à Refeição
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    {/* Tab Manual */}
                    <TabsContent value="manual" className="space-y-4">
                      {/* Alimentos Comuns */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Alimentos Comuns</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {commonFoods.map((food, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              className="justify-start text-left h-auto py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700"
                              onClick={() => selectCommonFood(food)}
                            >
                              <div className="text-xs">
                                <div className="font-medium">{food.name}</div>
                                <div className="text-gray-500 dark:text-gray-400">{food.calories} kcal</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Formulário */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="meal">Refeição</Label>
                          <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="breakfast">Pequeno-almoço</SelectItem>
                              <SelectItem value="lunch">Almoço</SelectItem>
                              <SelectItem value="dinner">Jantar</SelectItem>
                              <SelectItem value="snack">Lanche</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="foodName">Nome do Alimento</Label>
                          <Input
                            id="foodName"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            placeholder="Ex: Arroz com frango"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="calories">Calorias (kcal) *</Label>
                            <Input
                              id="calories"
                              type="number"
                              value={calories}
                              onChange={(e) => setCalories(e.target.value)}
                              placeholder="200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="protein">Proteína (g)</Label>
                            <Input
                              id="protein"
                              type="number"
                              value={protein}
                              onChange={(e) => setProtein(e.target.value)}
                              placeholder="20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="carbs">Hidratos (g)</Label>
                            <Input
                              id="carbs"
                              type="number"
                              value={carbs}
                              onChange={(e) => setCarbs(e.target.value)}
                              placeholder="30"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fat">Gordura (g)</Label>
                            <Input
                              id="fat"
                              type="number"
                              value={fat}
                              onChange={(e) => setFat(e.target.value)}
                              placeholder="10"
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={addFood} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600">
                        Adicionar à Refeição
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo de Calorias */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal de Calorias */}
            <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Resumo de Hoje</CardTitle>
                  <Dialog open={isGoalsDialogOpen} onOpenChange={setIsGoalsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        Definir Metas
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Metas Diárias</DialogTitle>
                        <DialogDescription>
                          Defina as suas metas nutricionais diárias
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Calorias (kcal)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.calories}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, calories: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Proteína (g)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.protein}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, protein: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Hidratos de Carbono (g)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.carbs}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, carbs: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <Label>Gordura (g)</Label>
                          <Input
                            type="number"
                            value={dailyGoals.fat}
                            onChange={(e) =>
                              setDailyGoals({ ...dailyGoals, fat: Number(e.target.value) })
                            }
                          />
                        </div>
                        <Button
                          onClick={() => setIsGoalsDialogOpen(false)}
                          className="w-full bg-gradient-to-r from-blue-500 to-cyan-600"
                        >
                          Guardar Metas
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {caloriesRemaining >= 0 ? caloriesRemaining : 0}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">calorias restantes</div>
                  <Progress value={Math.min(caloriesProgress, 100)} className="mt-4 h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dailyGoals.calories}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Meta</div>
                  </div>
                  <div className="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{totals.calories}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Consumidas</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.max(caloriesRemaining, 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Restantes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refeições */}
            <div className="space-y-4">
              {["breakfast", "lunch", "dinner", "snack"].map((meal) => {
                const mealFoods = getMealFoods(meal)
                const mealTotals = mealFoods.reduce(
                  (acc, food) => acc + food.calories,
                  0
                )

                return (
                  <Card key={meal} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => toggleMeal(meal)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg text-white">
                            {getMealIcon(meal)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{getMealName(meal)}</CardTitle>
                            <CardDescription>
                              {mealTotals} kcal • {mealFoods.length} alimento(s)
                            </CardDescription>
                          </div>
                        </div>
                        {expandedMeals[meal] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>

                    {expandedMeals[meal] && (
                      <CardContent>
                        {mealFoods.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <p>Nenhum alimento registado</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {mealFoods.map((food) => (
                              <div
                                key={food.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white">{food.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {food.time} • {food.calories} kcal
                                    {food.protein > 0 && ` • P: ${food.protein}g`}
                                    {food.carbs > 0 && ` • H: ${food.carbs}g`}
                                    {food.fat > 0 && ` • G: ${food.fat}g`}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteFood(food.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar - Macros */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-cyan-100 dark:border-cyan-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Macronutrientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Proteína */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proteína</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {totals.protein}g / {dailyGoals.protein}g
                    </span>
                  </div>
                  <Progress
                    value={(totals.protein / dailyGoals.protein) * 100}
                    className="h-2 bg-blue-100 dark:bg-blue-900"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.max(dailyGoals.protein - totals.protein, 0)}g restantes
                  </div>
                </div>

                {/* Hidratos */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hidratos</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {totals.carbs}g / {dailyGoals.carbs}g
                    </span>
                  </div>
                  <Progress
                    value={(totals.carbs / dailyGoals.carbs) * 100}
                    className="h-2 bg-orange-100 dark:bg-orange-900"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.max(dailyGoals.carbs - totals.carbs, 0)}g restantes
                  </div>
                </div>

                {/* Gordura */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gordura</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {totals.fat}g / {dailyGoals.fat}g
                    </span>
                  </div>
                  <Progress
                    value={(totals.fat / dailyGoals.fat) * 100}
                    className="h-2 bg-yellow-100 dark:bg-yellow-900"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.max(dailyGoals.fat - totals.fat, 0)}g restantes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">💡 Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-50">
                  Use a funcionalidade de foto com IA para registar as suas refeições de forma rápida e precisa!
                </p>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total de alimentos</span>
                  <span className="font-bold text-gray-900 dark:text-white">{foods.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Refeições registadas</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {["breakfast", "lunch", "dinner", "snack"].filter(
                      (meal) => getMealFoods(meal).length > 0
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progresso da meta</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {Math.min(Math.round(caloriesProgress), 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

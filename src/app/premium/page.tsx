"use client"

import { useState } from "react"
import { Check, Crown, Zap, TrendingUp, Calendar, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  color: string
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: "0€",
    period: "para sempre",
    description: "Perfeito para começar a sua jornada",
    color: "gray",
    features: [
      "Registo básico de alimentos",
      "Contador de calorias diário",
      "Base de dados de alimentos comuns",
      "Acompanhamento de macronutrientes",
      "Estatísticas básicas",
    ],
  },
  {
    id: "monthly",
    name: "Premium Mensal",
    price: "9,99€",
    period: "por mês",
    description: "Ideal para experimentar todas as funcionalidades",
    color: "blue",
    popular: true,
    features: [
      "Tudo do plano Gratuito",
      "Base de dados completa (50.000+ alimentos)",
      "Leitor de código de barras",
      "Planos de refeições personalizados",
      "Receitas saudáveis exclusivas",
      "Gráficos e relatórios avançados",
      "Acompanhamento de água e exercícios",
      "Sincronização entre dispositivos",
      "Suporte prioritário",
    ],
  },
  {
    id: "yearly",
    name: "Premium Anual",
    price: "79,99€",
    period: "por ano",
    description: "Melhor valor - poupe 33%",
    color: "cyan",
    features: [
      "Tudo do plano Premium Mensal",
      "2 meses grátis (equivalente a 9,99€/mês)",
      "Consulta nutricional online (1x/ano)",
      "Plano de treino personalizado",
      "Acesso antecipado a novas funcionalidades",
      "Badge exclusivo de membro anual",
      "Suporte VIP 24/7",
    ],
  },
]

export default function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handlePayment = (planId: string) => {
    // Aqui você integraria com um gateway de pagamento real
    // Por exemplo: Stripe, PayPal, MB Way, etc.
    alert(`Pagamento do plano ${planId} será processado. Integre com gateway de pagamento real.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Premium</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Desbloqueie todo o potencial</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Escolha o Plano Perfeito para Si
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Alcance os seus objetivos de saúde com ferramentas profissionais e suporte dedicado
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular
                  ? "border-4 border-blue-500 dark:border-blue-400 scale-105 md:scale-110"
                  : "border-2 border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${plan.color}-500 to-${plan.color}-600 flex items-center justify-center`}
                >
                  {plan.id === "free" && <Zap className="w-8 h-8 text-white" />}
                  {plan.id === "monthly" && <TrendingUp className="w-8 h-8 text-white" />}
                  {plan.id === "yearly" && <Crown className="w-8 h-8 text-white" />}
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</CardDescription>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePayment(plan.id)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                  } shadow-lg`}
                  disabled={plan.id === "free"}
                >
                  {plan.id === "free" ? "Plano Atual" : "Escolher Plano"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Porquê Escolher o CalPT Premium?
            </h3>
            <p className="text-blue-50 text-lg max-w-2xl mx-auto">
              Mais de 100.000 utilizadores já alcançaram os seus objetivos connosco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">Resultados Comprovados</h4>
              <p className="text-blue-50">
                Utilizadores Premium perdem em média 2x mais peso que utilizadores gratuitos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">Acompanhamento Contínuo</h4>
              <p className="text-blue-50">
                Relatórios semanais e mensais para acompanhar o seu progresso
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">Suporte Dedicado</h4>
              <p className="text-blue-50">
                Equipa de nutricionistas e especialistas disponível para ajudar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h3 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Perguntas Frequentes
        </h3>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posso cancelar a qualquer momento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Sim! Pode cancelar a sua subscrição a qualquer momento sem custos adicionais. O
                acesso Premium continuará até ao final do período pago.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Que métodos de pagamento aceitam?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Aceitamos cartões de crédito/débito, MB Way, PayPal e transferência bancária.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Existe período de teste gratuito?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Sim! Oferecemos 7 dias de teste gratuito do Premium para novos utilizadores.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

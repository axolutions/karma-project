"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  getInterpretation,
  getCategoryDisplayName,
  loadInterpretations,
  ensureSampleInterpretationsLoaded,
  forceLoadSampleInterpretations,
} from "@/lib/interpretations"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"

interface MatrixInterpretationsProps {
  karmicData: {
    karmicSeal: number
    destinyCall: number
    karmaPortal: number
    karmicInheritance: number
    karmicReprogramming: number
    cycleProphecy: number
    spiritualMark: number
    manifestationEnigma: number
  }
}

const MatrixInterpretations: React.FC<MatrixInterpretationsProps> = ({ karmicData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["karmicSeal"]))
  const [interpretationsLoaded, setInterpretationsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load interpretations on component mount
  useEffect(() => {
    console.log("MatrixInterpretations: Carregando interpretações...")
    try {
      // Forçar carregamento das interpretações de amostra primeiro para garantir
      // que temos um fallback disponível
      forceLoadSampleInterpretations()

      // Carregar interpretações do localStorage
      loadInterpretations()

      // Garantir que as interpretações de amostra estão disponíveis como backup
      ensureSampleInterpretationsLoaded()

      setInterpretationsLoaded(true)
      console.log("MatrixInterpretations: Interpretações carregadas com sucesso")
    } catch (err) {
      console.error("Erro ao carregar interpretações no componente:", err)
      setLoadError("Carregando interpretações alternativas...")

      // Tentar carregar interpretações de amostra como fallback
      try {
        forceLoadSampleInterpretations()
        ensureSampleInterpretationsLoaded()
        setInterpretationsLoaded(true)
        setLoadError(null)
        console.log("MatrixInterpretations: Fallback para interpretações de amostra carregado com sucesso")
      } catch (e) {
        console.error("Não foi possível carregar interpretações de amostra:", e)
      }
    }
  }, [])

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Verificar se temos dados kármicos válidos
  const hasValidData = karmicData && typeof karmicData === "object" && Object.keys(karmicData).length > 0

  // Se não tivermos dados válidos, exibir uma mensagem de erro
  if (!hasValidData) {
    console.error("Dados kármicos inválidos ou ausentes", karmicData)
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-red-50 border border-red-200 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-600 mb-2">Erro ao carregar interpretações</h2>
        <p className="text-red-500">Não foi possível carregar os dados das interpretações kármicas.</p>
        <p className="text-sm text-red-400 mt-2">Tente atualizar a página ou entre em contato com o suporte.</p>
      </div>
    )
  }

  // Se houver erro ao carregar interpretações
  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl font-medium text-yellow-600 mb-2">Aviso</h2>
        <p className="text-yellow-600">{loadError}</p>
        <p className="text-sm text-yellow-500 mt-2">Algumas interpretações podem não estar disponíveis.</p>
      </div>
    )
  }

  // Se as interpretações ainda não foram carregadas, mostrar um estado de carregamento
  if (!interpretationsLoaded) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-gray-50 border border-gray-200 rounded-md text-center">
        <h2 className="text-xl font-medium text-gray-600 mb-2">Carregando interpretações...</h2>
        <p className="text-gray-500">Aguarde enquanto carregamos suas interpretações kármicas.</p>
      </div>
    )
  }

  const interpretationItems = [
    { key: "karmicSeal", value: karmicData.karmicSeal },
    { key: "destinyCall", value: karmicData.destinyCall },
    { key: "karmaPortal", value: karmicData.karmaPortal },
    { key: "karmicInheritance", value: karmicData.karmicInheritance },
    { key: "karmicReprogramming", value: karmicData.karmicReprogramming },
    { key: "cycleProphecy", value: karmicData.cycleProphecy },
    { key: "spiritualMark", value: karmicData.spiritualMark },
    { key: "manifestationEnigma", value: karmicData.manifestationEnigma },
  ]

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#8B4513] mb-6 text-center">
        Interpretações da Sua Matriz Kármica
      </h2>

      <div className="space-y-2">
        {interpretationItems.map((item, index) => {
          const interpretation = getInterpretation(item.key, item.value)
          console.log(
            `Obtida interpretação para ${item.key}:${item.value}`,
            interpretation ? `Conteúdo: ${interpretation.content?.substring(0, 50)}...` : "Interpretação vazia",
          )

          const isExpanded = expandedSections.has(item.key)

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-[#f5f5dc] rounded-lg shadow-sm overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleSection(item.key)}
              >
                <h3 className="text-xl text-[#333333] font-semibold">
                  {getCategoryDisplayName(item.key)} {item.value}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="bg-[#8B4513] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {item.value}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-[#8B4513]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#8B4513]" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-3 border-t border-[#e2d1c3]">
                      {interpretation && interpretation.content ? (
                        <div
                          className="prose max-w-none text-[#333333] text-lg"
                          dangerouslySetInnerHTML={{ __html: interpretation.content }}
                        />
                      ) : (
                        <p className="text-[#8B4513] italic text-lg">
                          Interpretação não disponível para {getCategoryDisplayName(item.key)} com valor {item.value}.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default MatrixInterpretations


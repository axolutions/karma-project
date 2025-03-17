"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { getUserData, isLoggedIn, getCurrentUser, logout } from "@/lib/auth"
import { supabase } from "@/integrations/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, AlertTriangle, Heart, FileDown, LogOut } from "lucide-react"
import { generateInterpretationId } from "@/lib/interpretations"
import { useNavigate } from "react-router-dom"
import KarmicMatrix from "@/components/KarmicMatrix"
import { dispatch, toast } from "@/hooks/use-toast"

// Helper function to process content and wrap text in paragraph tags
const formatContentWithParagraphs = (content: string): string => {
  // Check if content already contains HTML paragraph tags
  if (content.includes("<p>") && content.includes("</p>")) {
    return content
  }

  // Split by newlines and wrap each segment in <p> tags
  return content
    .split("\n")
    .filter((line) => line.trim() !== "") // Remove empty lines
    .map((line) => `<p>${line}</p>`)
    .join("")
}

export default function LoveMatrixResult() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["introduction"]))
  const [interpretationsLoaded, setInterpretationsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [interpretations, setInterpretations] = useState<
    { id: string; title: string; content: string; key?: string; currentNumber?: number }[]
  >([])

  const [pdfMode, setPdfMode] = useState(false)

  const navigate = useNavigate()

  const karmicData = useMemo(() => {
    if (!userData) return

    console.log("MatrixResult2: Loading karmic data...", userData)

    return userData.karmic_numbers[0] as unknown as {
      karmicSeal: number
      destinyCall: number
      karmaPortal: number
      karmicInheritance: number
      karmicReprogramming: number
      cycleProphecy: number
      spiritualMark: number
      manifestationEnigma: number
    }
  }, [userData])

  const interpretationItems = useMemo(() => {
    if (!karmicData) return []

    console.log("MatrixResult2: Loading interpretation items...", karmicData)

    return [
      { key: "loveSpiritMark", value: karmicData.spiritualMark },
      { key: "loveReprogrammation", value: karmicData.karmicReprogramming },
      { key: "loveManifestation", value: karmicData.manifestationEnigma },
      { key: "loveKarmaHeranca", value: karmicData.karmicInheritance },
      { key: "loveEssence", value: karmicData.karmicSeal },
      { key: "loveDestiny", value: karmicData.destinyCall },
      { key: "loveCycles", value: karmicData.cycleProphecy },
      { key: "loveAffectiveKarmaPortal", value: karmicData.karmaPortal }, 
    ]
  }, [karmicData])

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

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    navigate('/');
  };

  const handleDownloadPDF = () => {
    if (!userData?.karmic_numbers) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Dados kármicos não disponíveis para download.",
        variant: "destructive",
      });
      return;
    }

    setPdfMode(true)
  }

  useEffect(() => {
    if (pdfMode) {
      dispatch({ type: "REMOVE_TOAST" });
      setTimeout(() => {
        window.print();
        setPdfMode(false);
      }, 1000);
    }
  }, [pdfMode])

  // Load interpretations on component mount
  useEffect(() => {
    console.log("MatrixResult2: Loading interpretations...")
    try {
      setInterpretationsLoaded(true)
      console.log("MatrixResult2: Interpretations loaded successfully")
    } catch (err) {
      console.error("Error loading interpretations:", err)
      setLoadError("Carregando interpretações alternativas...")
      try {
        setInterpretationsLoaded(true)
        setLoadError(null)
        console.log("MatrixResult2: Fallback interpretations loaded successfully")
      } catch (e) {
        console.error("Could not load sample interpretations:", e)
      }
    }
  }, [])

  useEffect(() => {
    // Either remove the function or uncomment its usage
    const loadUserData = async () => {
      try {
        // Check if user is logged in
        if (!isLoggedIn()) {
          console.error("User is not logged in")
          setError("Sessão expirada. Por favor, faça login novamente.")
          setLoading(false)
          return
        }

        // Get current user email
        const email = getCurrentUser()
        if (!email) {
          console.error("User email not found in localStorage")
          setError("Dados do usuário não encontrados.")
          setLoading(false)
          return
        }

        // Get user data by email
        const data = await getUserData(email)
        if (!data) {
          console.error("User data not found for email:", email)
          setError("Dados do usuário não encontrados. Por favor, faça login novamente.")
          setLoading(false)
          return
        }

        console.log("DATA", data)
        setUserData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error loading user data:", err)
        setError("Erro ao carregar dados. Por favor, recarregue a página.")
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Fetch karmic love data
  useEffect(() => {
    if (!interpretationsLoaded || loadError || !interpretationItems || interpretationItems.length === 0) return

    const fetchInterpretations = async () => {
      try {
        const results = []

        for (const item of interpretationItems) {
          const id = generateInterpretationId(item.key, item.value)
          const { data, error } = await supabase.from("karmic_love").select("*").eq("id", id).single()

          if (error) {
            console.error(`Error fetching karmic data for ${item.key}:`, error)
            // Add fallback content if database fetch fails
            results.push({
              id: item.key,
              title: "Interpretação não disponível",
              content: getFallbackContent(item.key, item.value),
              key: item.key,
              currentNumber: item.value, // added current number label
            })
            continue
          }

          if (data) {
            results.push({
              ...data,
              key: item.key,
              currentNumber: item.value, // added current number label
            })
          } else {
            // Add fallback content if no data found
            results.push({
              id: item.key,
              title: "Interpretação não encontrada",
              content: getFallbackContent(item.key, item.value),
              key: item.key,
              currentNumber: item.value, // added current number label
            })
          }
        }

        setInterpretations(results)
      } catch (err) {
        console.error("Error fetching interpretations:", err)
        setLoadError("Alguns dados de interpretação não puderam ser carregados.")

        // Add fallback interpretations
        const fallbackResults = interpretationItems.map((item) => ({
          id: item.key,
          title: "Interpretação não disponível",
          content: getFallbackContent(item.key, item.value),
          key: item.key,
          currentNumber: item.value, // added current number label
        }))
        setInterpretations(fallbackResults)
      }
    }

    fetchInterpretations()
  }, [interpretationsLoaded, loadError, interpretationItems])

  // Fallback content for each section if database fetch fails
  const getFallbackContent = (key: string, value: number): string => {
    const fallbackContents: Record<string, string> = {
      introduction:
        "Todos carregamos um mapa invisível, traçado por nossas experiências passadas. O amor que nos faz florescer é tão único quanto nossa alma...",
      loveCode: `O Número ${value} representa uma alma que busca um amor fluido, sem amarras...`,
      loveChallenges: "Reflita sobre seus relacionamentos passados...",
      loveAttraction: "Para alinhar sua energia e manifestar o amor certo, priorize...",
      lovePatterns: "Seus padrões de relacionamento são influenciados por experiências passadas...",
      loveCycles: "O amor também segue ciclos, como as estações do ano...",
      loveSpiritMark: "Sua marca espiritual nos relacionamentos revela sua verdadeira natureza...",
      loveSuccessEnigma: "O enigma da manifestação do amor está em equilibrar dar e receber...",
    }

    return fallbackContents[key] || "Conteúdo não disponível."
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-100">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-pink-400 border-dashed">
          <p className="text-pink-600 mb-3">Carregando sua matriz kármica do amor...</p>
          <div className="w-8 h-8 border-t-2 border-pink-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
          <Button onClick={() => navigate("/")} variant="link" className="mt-4 text-pink-600">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-100">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-pink-400 border-dashed">
          <p className="text-pink-600 mb-3">
            Não foi possível carregar os dados da matriz. Por favor, tente novamente.
          </p>
          <Button onClick={() => navigate("/")} variant="default" className="mt-4 bg-pink-600 hover:bg-pink-700">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-100">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-pink-400 border-dashed">
          <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-medium text-yellow-600 mb-2">Aviso</h2>
          <p className="text-yellow-600">{loadError}</p>
          <p className="text-sm text-yellow-500 mt-2">Algumas interpretações podem não estar disponíveis.</p>
          <Button onClick={() => navigate("/")} variant="default" className="mt-4 bg-pink-600 hover:bg-pink-700">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4 bg-pink-100 font-['Lora',serif] text-[#2A2A2A] leading-7 text-base">
      <div className="max-w-[900px] mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden border-2 border-dashed border-pink-300 relative">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white p-10 text-center relative">
          <h1 className="font-['Playfair_Display',serif] m-0 text-2xl font-bold uppercase text-shadow">
            MAPA DA MATRIZ NUMEROLÓGICA DO AMOR
          </h1>
          <p className="mt-2">A Herança Kármica dos Relacionamentos</p>
          {userData && (
            <>
              <p className="mt-2">Para: {userData.name || userData.email}</p>
              <p className="mt-2">Nascimento: {new Date(userData.birth).toLocaleDateString("pt-BR", {timeZone: "UTC"})}</p>
            </>
          )}
          
          <div className="flex space-x-3 w-full justify-center mt-4">
            <Button 
              onClick={handleDownloadPDF}
              className="karmic-button flex items-center"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Baixar Interpretações
            </Button>
            
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="karmic-button-outline flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <KarmicMatrix 
          karmicData={karmicData} 
          backgroundImage="/love_banner.png" 
          positions={{
            destinyCall: { top: "28%", left: "28%" },
            karmicSeal: { top: "21%", left: "50%" },        // selo_karmico - Número 6 movido para o centro alto
            karmaPortal: { top: "28%", left: "72.5%" },       // portal_karma

            karmicInheritance: { top: "50%", left: "20.5%" }, // heranca_karmica
            manifestationEnigma: { top: "50%", left: "79.5%" }, // enigma_manifestacao - Número 11 subido para o quadrado da direita

            spiritualMark: { top: "73%", left: "28%" },
            karmicReprogramming: { top: "79.5%", left: "50%" }, // codex_reprogramacao
            cycleProphecy: { top: "73%", left: "72.5%" },
          }}
        />

        <div className="p-6">
          {interpretations.map((interpretation, index) => {
            const isExpanded = expandedSections.has(interpretation.key || `section-${index}`) || pdfMode

            return (
              <div key={interpretation.key || `section-${index}`} className="mb-6">
                {/* Section header with diamond icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-pink-200 rounded-lg p-3 cursor-pointer flex items-center"
                  onClick={() => toggleSection(interpretation.key || `section-${index}`)}
                >
                  <div className="text-pink-600 mr-2">◆</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-medium text-pink-800">
                      {interpretation.title}
                    </h2>
                    <p className="text-sm text-pink-600">
                      Número Atual: {interpretation.currentNumber}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-pink-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-pink-600" />
                  )}
                </motion.div>

                {/* Section content */}
                <AnimatePresence>
                  {(isExpanded) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border border-dashed border-pink-200 rounded-lg mt-2 bg-white">
                        <div
                          className="prose max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: formatContentWithParagraphs(interpretation.content),
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {/* Love affirmation card */}
          <div className="mt-8 p-5 bg-gradient-to-r from-pink-100 to-pink-50 rounded-lg border border-pink-200 shadow-sm">
            <h3 className="text-center text-pink-700 font-medium mb-3 flex items-center justify-center">
              <Heart className="h-5 w-5 mr-2 text-pink-500" /> Afirmação para Atrair o Amor
            </h3>
            <p className="text-center italic text-pink-800">
              "Eu estou aberto(a) para receber o amor que me faz florescer. Libero padrões do passado e abraço novas
              possibilidades."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-5 text-gray-600 text-sm border-t-2 border-dashed border-pink-300 bg-pink-50 relative">
          <p>Matriz Numerológica do Amor - {new Date().getFullYear()}</p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mt-4 text-pink-600 border-pink-300 hover:bg-pink-50 hover:text-pink-700"
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    </div>
  )
}


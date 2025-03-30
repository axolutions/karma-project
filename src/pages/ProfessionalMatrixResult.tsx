import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { getUserData, isLoggedIn, getCurrentUser, logout } from "@/lib/auth"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, AlertTriangle, FileDown, LogOut, ArrowLeft } from "lucide-react"
import { generateInterpretationId } from "@/lib/interpretations"
import KarmicMatrix from "@/components/KarmicMatrix"
import { dispatch, toast } from "@/hooks/use-toast"
import KarmicProfessionalEnding from "@/components/KarmicProfessionalEnding"
import KarmicProfessionalIntroduction from "@/components/KarmicProfessionalIntroduction"

// Helper function to process content and wrap text in paragraph tags
const formatContentWithParagraphs = (content: string): string => {
  // Check if content already contains HTML paragraph tags
  if (content.includes('<p>') && content.includes('</p>')) {
    return content;
  }
  
  // Split by newlines and wrap each segment in <p> tags
  return content
    .split('\n')
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => `<p>${line}</p>`)
    .join('');
};

export default function ProfessionalMatrixResult() {
  const [userData, setUserData] = useState<Awaited<ReturnType<typeof getUserData>>>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["professionalPurpose", "professionalIntro", "professionalEnding"]))
  const [interpretationsLoaded, setInterpretationsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [interpretations, setInterpretations] = useState<{id: string, title: string, content: string}[]>([])

  const [pdfMode, setPdfMode] = useState(false)

  const karmicData = useMemo(() => {
    if (!userData) return;

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
    };
  }, [userData])

  // Define interpretation items similar to MatrixInterpretations.tsx
  // This allows for easy editing of keys later
  const interpretationItems = useMemo(() => {
    if (!karmicData) return;

    console.log("MatrixResult2: Loading interpretation items...", karmicData)

    return [
        { key: "professionalPropose", value: karmicData.karmicSeal },
        { key: "realizationProfessional", value: karmicData.destinyCall },
        { key: "professionalChallenges", value: karmicData.karmaPortal },
        { key: "professionalKarmicHeranca", value: karmicData.karmicInheritance },
        { key: "professionalSuccess", value: karmicData.karmicReprogramming },
        { key: "professionalCycles", value: karmicData.cycleProphecy },
        { key: "professionalSpiritMark", value: karmicData.spiritualMark },
        { key: "professionalSuccessEnigma", value: karmicData.manifestationEnigma },
    ]
  }, [karmicData])

  const navigate = useNavigate()

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

  useEffect(() => {
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
  
  // Fetch karmic professional data
  useEffect(() => {
    if (loadError || !interpretationItems) return

    const fetchInterpretations = async () => {
      try {
        const results = []
        
        for (const item of interpretationItems) {
          const id = generateInterpretationId(item.key, item.value)
          const { data, error } = await supabase
            .from("karmic_professional")
            .select("*")
            .eq("id", id)
            .single()
            
          if (error) {
            console.error(`Error fetching karmic data for ${item.key}:`, error)
            continue
          }
          
          if (data) {
            results.push({
              ...data,
              key: item.key
            })
          }
        }
        
        setInterpretations(results)
        setInterpretationsLoaded(true)
      } catch (err) {
        console.error("Error fetching interpretations:", err)
        setLoadError("Alguns dados de interpretação não puderam ser carregados.")
      }
    }

    fetchInterpretations()
  }, [loadError, interpretationItems])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] to-[#FAEBD7]">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-[#1E3A5F] border-dashed">
          <p className="text-[#1E3A5F] mb-3">Carregando sua matriz kármica...</p>
          <div className="w-8 h-8 border-t-2 border-[#1E3A5F] border-solid rounded-full animate-spin mx-auto mb-3"></div>
          <Button onClick={() => navigate("/")} variant="link" className="mt-4 text-[#1E3A5F]">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] to-[#FAEBD7]">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-[#1E3A5F] border-dashed">
          <p className="text-[#1E3A5F] mb-3">Não foi possível carregar os dados da matriz. Por favor, tente novamente.</p>
          <Button onClick={() => navigate("/")} variant="default" className="mt-4 bg-[#1E3A5F] hover:bg-[#2B5A8A]">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] to-[#FAEBD7]">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-[#1E3A5F] border-dashed">
          <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-medium text-yellow-600 mb-2">Aviso</h2>
          <p className="text-yellow-600">{loadError}</p>
          <p className="text-sm text-yellow-500 mt-2">Algumas interpretações podem não estar disponíveis.</p>
          <Button onClick={() => navigate("/")} variant="default" className="mt-4 bg-[#1E3A5F] hover:bg-[#2B5A8A]">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (interpretationsLoaded && interpretations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDF5E6] to-[#FAEBD7]">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-[#1E3A5F] border-dashed">
          <p className="text-[#1E3A5F] mb-3">Nenhum dado kármico encontrado. Por favor, entre em contato com o suporte.</p>
          <Button onClick={() => navigate("/")} variant="default" className="mt-4 bg-[#1E3A5F] hover:bg-[#2B5A8A]">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  return pdfMode ? (
    <div className="min-h-screen py-4 px-4 bg-blue-50 font-['Lora',serif] text-[#2A2A2A] leading-7 text-base print-friendly">
      <div className="max-w-[900px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-2 border-dashed border-blue-300">
        {/* Header com gradiente para PDF - Reduzido em altura */}
        <div style={{background: "linear-gradient(to right, #1e40af, #3b82f6)"}} className="text-white py-3 px-6 text-center">
          <h1 className="font-['Playfair_Display',serif] m-0 text-2xl font-bold uppercase">
            MATRIZ KÁRMICA PROFISSIONAL
          </h1>
          <p className="mt-1 mb-0">Revelando seu Caminho Profissional Kármico</p>
          {userData && (
            <div className="text-sm mt-1">
              <span>Para: {userData.name || userData.email} | </span>
              <span>Nascimento: {new Date(userData.birth).toLocaleDateString("pt-BR", {timeZone: "UTC"})}</span>
            </div>
          )}
        </div>

        {/* Matriz visual - Integrada na mesma página */}
        <div className="p-4 bg-blue-50">
          <KarmicMatrix 
            karmicData={karmicData} 
            backgroundImage="/professional_banner.png" 
            positions={{
              destinyCall: { top: "25%", left: "24.7%" },
              karmicSeal: { top: "19%", left: "50.5%" },
              karmaPortal: { top: "25%", left: "76.5%" },
              karmicInheritance: { top: "50.5%", left: "19%" },
              manifestationEnigma: { top: "50.5%", left: "82.5%" },
              spiritualMark: { top: "76.5%", left: "24.7%" },
              karmicReprogramming: { top: "82%", left: "50.5%" },
              cycleProphecy: { top: "76.5%", left: "76.5%" },
            }}
          />
        </div>

        {/* Introdução profissional - Mais compacta */}
        <div className="px-4 pt-2 pb-4 bg-blue-50">
          <KarmicProfessionalIntroduction />
        </div>

        {/* Interpretações */}
        <div className="p-6">
          {interpretations.map((interpretation, index) => (
            <div key={interpretation.id} className="mb-6 page-break-inside-avoid">
              <div className="bg-[#ecf4ff] rounded-lg p-3 flex items-center mb-2 shadow-sm">
                <div className="flex-1">
                  <h3 className="text-xl text-[#333333] font-semibold">
                    {interpretation.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 border border-dashed border-blue-200 rounded-lg bg-white">
                <div
                  className="prose max-w-none text-[#333333] text-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: formatContentWithParagraphs(interpretation.content) 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Conclusão profissional */}
        <div className="p-4 bg-blue-50">
          <KarmicProfessionalEnding />
        </div>

        {/* Footer */}
        <div className="text-center p-4 text-gray-600 text-sm border-t-2 border-dashed border-blue-300 bg-blue-50">
          <p>Matriz Kármica Profissional - {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen py-6 px-4 bg-blue-50 font-['Lora',serif] text-[#2A2A2A] leading-7 text-base">
      <div className="max-w-[900px] mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden border-2 border-dashed border-blue-300 relative">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-10 text-center relative">
          <h1 className="font-['Playfair_Display',serif] m-0 text-2xl font-bold uppercase text-shadow">
            MATRIZ KÁRMICA PROFISSIONAL
          </h1>
          <p className="mt-2">Revelando seu Caminho Profissional Kármico</p>
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
              onClick={() => navigate("/escolher-mapa")}
              variant="outline"
              className="karmic-button-outline flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Seleção
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
          backgroundImage="/professional_banner.png" 
          positions={{
            destinyCall: { top: "25%", left: "24.7%" },
            karmicSeal: { top: "19%", left: "50.5%" },        // selo_karmico - Número 6 movido para o centro alto
            karmaPortal: { top: "25%", left: "76.5%" },       // portal_karma

            karmicInheritance: { top: "50.5%", left: "19%" }, // heranca_karmica
            manifestationEnigma: { top: "50.5%", left: "82.5%" }, // enigma_manifestacao - Número 11 subido para o quadrado da direita

            spiritualMark: { top: "76.5%", left: "24.7%" },
            karmicReprogramming: { top: "82%", left: "50.5%" }, // codex_reprogramacao
            cycleProphecy: { top: "76.5%", left: "76.5%" },
          }}
        />

        {/* Introdução profissional com toggle */}
        <div className="p-6">
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#ecf4ff] rounded-lg p-3 cursor-pointer flex items-center"
              onClick={() => toggleSection("professionalIntro")}
            >
              <div className="flex-1">
                <h2 className="text-xl text-[#333333] font-semibold">
                  Introdução à Matriz Kármica Profissional
                </h2>
              </div>
              {expandedSections.has("professionalIntro") ? (
                <ChevronUp className="h-5 w-5 text-[#1E3A5F]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#1E3A5F]" />
              )}
            </motion.div>

            <AnimatePresence>
              {expandedSections.has("professionalIntro") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border border-dashed border-blue-200 rounded-lg mt-2 bg-white">
                    <KarmicProfessionalIntroduction />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-10">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {interpretations.map((interpretation, index) => {
                const item = { key: interpretation.id, title: interpretation.title };
                const isExpanded = expandedSections.has(item.key) || pdfMode;
                
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-[#ecf4ff] rounded-lg shadow-sm overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer"
                      onClick={() => toggleSection(item.key)}
                    >
                      <h3 className="text-xl text-[#333333] font-semibold">
                        {interpretation.title}
                      </h3>
                      <div className="flex items-center space-x-3">
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
                            <div
                              className="prose max-w-none text-[#333333] text-lg"
                              dangerouslySetInnerHTML={{ 
                                __html: formatContentWithParagraphs(interpretation.content) 
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Conclusão profissional com toggle */}
        <div className="p-6">
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#ecf4ff] rounded-lg p-3 cursor-pointer flex items-center"
              onClick={() => toggleSection("professionalEnding")}
            >
              <div className="flex-1">
                <h2 className="text-xl text-[#333333] font-semibold">
                  Conclusão e Próximos Passos Profissionais
                </h2>
              </div>
              {expandedSections.has("professionalEnding") ? (
                <ChevronUp className="h-5 w-5 text-[#1E3A5F]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#1E3A5F]" />
              )}
            </motion.div>

            <AnimatePresence>
              {expandedSections.has("professionalEnding") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border border-dashed border-blue-200 rounded-lg mt-2 bg-white">
                    <KarmicProfessionalEnding />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center p-5 text-gray-600 text-sm border-t-2 border-dashed border-[#1E3A5F] bg-[#FDF5E6] relative before:content-[''] before:absolute before:top-[-10px] before:left-1/2 before:transform before:translate-x-[-50%] before:w-[30px] before:h-[1px] before:bg-[#D4A017]">
          <p>Código do Propósito Profissional 2025</p>
          <Button onClick={() => navigate("/")} variant="outline" className="mt-4 text-[#1E3A5F] border-[#1E3A5F]">
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    </div>
  )
}


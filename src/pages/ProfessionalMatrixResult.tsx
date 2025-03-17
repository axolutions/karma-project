import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { getUserData, isLoggedIn, getCurrentUser } from "@/lib/auth"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { generateInterpretationId } from "@/lib/interpretations"
import KarmicMatrix from "@/components/KarmicMatrix"

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["professionalPurpose"]))
  const [interpretationsLoaded, setInterpretationsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [interpretations, setInterpretations] = useState<{id: string, title: string, content: string}[]>([])

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
    if (!interpretationsLoaded || loadError || !interpretationItems) return

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
      } catch (err) {
        console.error("Error fetching interpretations:", err)
        setLoadError("Alguns dados de interpretação não puderam ser carregados.")
      }
    }

    fetchInterpretations()
  }, [interpretationsLoaded, loadError, interpretationItems])

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

  if (interpretations.length === 0) {
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

  return (
    <div
      className="min-h-screen py-6 px-4 bg-gradient-to-br from-[#FDF5E6] to-[#FAEBD7] font-['Lora',serif] text-[#2A2A2A] leading-7 text-base"
      style={{
        backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%231E3A5F" fillOpacity="0.03" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,90.7C960,96,1056,96,1152,85.3C1248,75,1344,64,1392,58.7L1440,53.3V320H1392H1344H1248H1152H1056H960H864H768H672H576H480H384H288H192H96H48H0V64Z"%3E%3C/path%3E%3Ctext x="50" y="100" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E1%3C/text%3E%3Ctext x="150" y="150" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E2%3C/text%3E%3Ctext x="250" y="200" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E3%3C/text%3E%3Ctext x="350" y="250" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E4%3C/text%3E%3Ctext x="450" y="200" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E5%3C/text%3E%3Ctext x="550" y="150" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E6%3C/text%3E%3Ctext x="650" y="100" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E7%3C/text%3E%3Ctext x="750" y="150" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E8%3C/text%3E%3Ctext x="850" y="200" fontSize="20" fill="%231E3A5F" opacity="0.03"%3E9%3C/text%3E%3C/svg%3E')`,
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-[900px] mx-auto bg-white rounded-[20px] shadow-lg overflow-hidden border-2 border-dashed border-[#1E3A5F] relative">
        <div className="bg-gradient-to-br from-[#1E3A5F] via-[#2B5A8A] to-[#ECF4FF] text-white p-10 text-center relative">
          <h1 className="font-['Playfair_Display',serif] m-0 text-2xl font-bold uppercase text-shadow">
            Código do Propósito Profissional
          </h1>
          {userData && (
            <p className="mt-2">Para: {userData.name || userData.email}</p>
          )}
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

        <div className="p-10">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {interpretations.map((interpretation, index) => {
                const item = { key: interpretation.id, title: interpretation.title };
                const isExpanded = expandedSections.has(item.key);
                
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


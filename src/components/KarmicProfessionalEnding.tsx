"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { ENDING } from "@/lib/default-interpretations-professional"

interface KarmicProfessionalEndingProps {
  userName?: string
}

const KarmicProfessionalEnding: React.FC<KarmicProfessionalEndingProps> = ({ userName }) => {
  // Function to format the ending text with proper HTML
  const formatEnding = () => {
    // Split the text by newlines
    const paragraphs = ENDING.split("\n")

    // Track if we're inside a list item section
    let inListSection = false
    let currentExercise = ""
    let currentStep = ""

    // Process the paragraphs to create HTML elements
    return paragraphs.map((paragraph, index) => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return null

      // Format main heading
      if (paragraph.includes("Conclusão do Mapa Kármico Profissional 2025")) {
        return (
          <h2 key={index} className="text-2xl font-serif text-[#8B4513] mb-3">
            {paragraph}
          </h2>
        )
      }

      // Format subheading
      if (paragraph.includes("Agora que você conhece seus códigos kármicos profissionais")) {
        return (
          <h3 key={index} className="text-xl font-serif text-[#8B4513] mb-4">
            {paragraph}
          </h3>
        )
      }

      // Format section titles
      if (paragraph.includes("🔥") || paragraph.includes("✨ Sua Jornada Profissional Começa Agora! ✨") || paragraph.includes("💼") || paragraph.includes("🌟")) {
        return (
          <h3 key={index} className="text-lg font-serif text-[#8B4513] font-medium mt-6 mb-3">
            {paragraph}
          </h3>
        )
      }

      // Format exercise headings (1️⃣, 2️⃣, etc.)
      if (paragraph.match(/^[1-4]️⃣/)) {
        currentExercise = paragraph.replace(/^[1-4]️⃣\s*/, "")
        inListSection = true
        return (
          <h4 key={index} className="text-[#8B4513] font-serif font-medium text-lg mt-5 mb-2 flex items-center">
            <span className="mr-2">{paragraph.match(/^[1-4]️⃣/)?.[0]}</span>
            <span>{currentExercise}</span>
          </h4>
        )
      }

      // Format objective lines (✍, ✂, 🌱, 🔮)
      if (paragraph.match(/^[✍✂🌱🔮]/u)) {
        const symbol = paragraph.match(/^[✍✂🌱🔮]/u)?.[0] || ""
        const text = paragraph.replace(/^[✍✂🌱🔮]\s*/u, "")
        return (
          <div key={index} className="flex items-start mb-3 ml-4">
            <span className="mr-2">{symbol}</span>
            <span className="italic text-[#8B4513]">{text}</span>
          </div>
        )
      }

      // Format "Como fazer" lines (📌)
      if (paragraph.match(/^📌/)) {
        currentStep = paragraph.replace(/^📌\s*/, "")
        return (
          <div key={index} className="flex items-start mb-2 ml-4">
            <span className="mr-2">📌</span>
            <span className="font-medium">{currentStep}</span>
          </div>
        )
      }

      // Format list items in exercise sections
      if (inListSection && paragraph.trim() && !paragraph.match(/^[1-4]️⃣|^[✍✂🌱🔮]|^📌/u)) {
        // Check if this is the end of a list section
        if (
          paragraph.includes("Após uma semana") ||
          paragraph.includes("Faça esse exercício") ||
          paragraph.includes("Pratique a gratidão") ||
          paragraph.includes("Confie no processo")
        ) {
          inListSection = false
          return (
            <p key={index} className="mb-4 ml-4">
              {paragraph}
            </p>
          )
        }

        // Otherwise, it's a list item
        return (
          <div key={index} className="flex items-start mb-2 ml-10">
            <span className="mr-2">•</span>
            <span>{paragraph}</span>
          </div>
        )
      }

      // Format final paragraphs
      if (
        paragraph.includes("O Mapa Kármico Profissional 2025 não é apenas um guia") ||
        paragraph.includes("Seja qual for o seu caminho") ||
        paragraph.includes("Agora é com você!") ||
        paragraph.includes("Que seu ano seja repleto")
      ) {
        return (
          <p key={index} className="mb-4 text-center">
            {paragraph}
          </p>
        )
      }

      // Format regular paragraphs
      return (
        <p key={index} className="mb-4">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto my-8"
    >
      <div className="bg-[#ecf4ff] rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#e2d1c3]">
          <h3 className="text-xl text-[#333333] font-semibold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#8B4513]" />
            Próximos Passos na Sua Jornada Kármica Profissional
          </h3>
        </div>

        <div className="p-6">
          <div className="prose max-w-none text-[#333333]">
            {formatEnding()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default KarmicProfessionalEnding

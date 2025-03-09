"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { INTRODUCTION } from "@/lib/default-interpretations"

interface KarmicIntroductionProps {
  userName?: string
}

const KarmicIntroduction: React.FC<KarmicIntroductionProps> = ({ userName }) => {
  // Function to format the introduction text with proper HTML
  const formatIntroduction = () => {
    // Split the text by newlines
    const paragraphs = INTRODUCTION.split("\n")

    // Process the paragraphs to create HTML elements
    return paragraphs.map((paragraph, index) => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return null

      // Format headings
      if (paragraph.includes("Mapa Kármico Pessoal 2025") && index === 0) {
        return (
          <h2 key={index} className="text-2xl font-serif text-[#8B4513] mb-3">
            {paragraph}
          </h2>
        )
      }

      if (paragraph.includes("A Chave para Decifrar")) {
        return (
          <h3 key={index} className="text-xl font-serif text-[#8B4513] mb-4">
            {paragraph}
          </h3>
        )
      }

      // Format section titles
      if (
        paragraph.includes("🚨") ||
        paragraph.includes("🔮") ||
        paragraph.includes("✨") ||
        paragraph.includes("💫")
      ) {
        return (
          <h3 key={index} className="text-lg font-serif text-[#8B4513] font-medium mt-6 mb-3">
            {paragraph}
          </h3>
        )
      }

      // Format list items
      if (paragraph.includes("✔") || paragraph.includes("✅")) {
        const symbol = paragraph.includes("✔") ? "✔" : "✅"
        const text = paragraph.replace(symbol, "")

        return (
          <div key={index} className="flex items-start mb-2 ml-4">
            <span className="mr-2">{symbol}</span>
            <span>{text}</span>
          </div>
        )
      }

      // Format disclaimer
      if (paragraph.includes("A  Matriz Kármica Pessoal é criada com carinho")) {
        return (
          <div key={index} className="mt-8 text-sm text-[#666666] border-t border-[#e2d1c3] pt-4">
            <p>{paragraph}</p>
          </div>
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
      <div className="bg-[#f5f5dc] rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-[#e2d1c3]">
          <h3 className="text-xl text-[#333333] font-semibold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#8B4513]" />
            Bem-vindo{userName ? `, ${userName}` : ""} à sua Matriz Kármica Pessoal
          </h3>
        </div>

        <div className="p-6">
          <div className="prose max-w-none text-[#333333]">
            {formatIntroduction()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default KarmicIntroduction


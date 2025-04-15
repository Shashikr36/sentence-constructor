"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface Question {
  questionId: string
  question: string
  options: string[]
  correctAnswer: string[]
}

interface SentenceGameProps {
  question: Question
  onSubmit: (questionId: string, userAnswer: (string | null)[], isCorrect: boolean) => void
  questionNumber: number
  totalQuestions: number
}

export function SentenceGame({ question, onSubmit, questionNumber, totalQuestions }: SentenceGameProps) {
  const [selectedWords, setSelectedWords] = useState<(string | null)[]>(Array(4).fill(null))
  const [availableOptions, setAvailableOptions] = useState<string[]>([...question.options])
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true)

  // Split the question into parts by the blank placeholders
  const questionParts = question.question.split("_____________")

  // Reset state when question changes
  useEffect(() => {
    setSelectedWords(Array(4).fill(null))
    setAvailableOptions([...question.options])
    setTimeLeft(30)
    setIsTimerActive(true)
  }, [question])

  // Timer logic
  useEffect(() => {
    if (!isTimerActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, question])

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false)
    // Auto-submit when time is up
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(question.correctAnswer)
    onSubmit(question.questionId, selectedWords, isCorrect)
  }, [onSubmit, question, selectedWords])

  const handleWordSelect = (word: string) => {
    const firstEmptyIndex = selectedWords.findIndex((item) => item === null)
    if (firstEmptyIndex !== -1) {
      const newSelectedWords = [...selectedWords]
      newSelectedWords[firstEmptyIndex] = word
      setSelectedWords(newSelectedWords)

      // Remove the word from available options
      setAvailableOptions(availableOptions.filter((option) => option !== word))
    }
  }

  const handleBlankClick = (index: number) => {
    if (selectedWords[index] !== null) {
      // Return the word to available options
      setAvailableOptions([...availableOptions, selectedWords[index] as string])

      // Remove the word from selected words
      const newSelectedWords = [...selectedWords]
      newSelectedWords[index] = null
      setSelectedWords(newSelectedWords)
    }
  }

  const handleSubmit = () => {
    setIsTimerActive(false)
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(question.correctAnswer)
    onSubmit(question.questionId, selectedWords, isCorrect)
  }

  const allBlanksAreFilled = selectedWords.every((word) => word !== null)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-sm">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge
            variant={timeLeft <= 10 ? "destructive" : "outline"}
            className={`text-sm ${timeLeft <= 10 ? "animate-pulse" : ""}`}
          >
            {timeLeft} seconds left
          </Badge>
        </div>
        <Progress value={(timeLeft / 30) * 100} className="h-2" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {/* Sentence with blanks */}
          <div className="text-lg leading-relaxed">
            {questionParts.map((part, index) => (
              <span key={index}>
                {part}
                {index < questionParts.length - 1 && (
                  <span
                    onClick={() => handleBlankClick(index)}
                    className={`inline-block min-w-[120px] px-3 py-1 mx-1 border-b-2 text-center cursor-pointer transition-colors ${
                      selectedWords[index]
                        ? "bg-gray-100 border-gray-400 hover:bg-gray-200"
                        : "border-dashed border-gray-400"
                    }`}
                  >
                    {selectedWords[index] || ""}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Word options */}
          <div className="flex flex-wrap gap-2 justify-center">
            {availableOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="px-4 py-2 text-base"
                onClick={() => handleWordSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="h-4 w-4 mr-1" />
          Click on a filled blank to remove the word
        </div>
        <Button onClick={handleSubmit} disabled={!allBlanksAreFilled}>
          Next Question
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { SentenceGame } from "@/components/sentence-game"
import { FeedbackScreen } from "@/components/feedback-screen"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Define types for our data structure
interface Question {
  questionId: string
  question: string
  questionType: string
  answerType: string
  options: string[]
  correctAnswer: string[]
}

interface GameData {
  testId: string
  questions: Question[]
}

interface UserAnswer {
  questionId: string
  userAnswer: (string | null)[]
  isCorrect: boolean
}

export default function Home() {
  const [data, setData] = useState<GameData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameCompleted, setGameCompleted] = useState<boolean>(false)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, you would fetch from an actual API endpoint
        // For this example, we'll use the provided JSON data directly
        const mockData = {
          status: "SUCCESS",
          data: {
            testId: "oihq2eo9h1029921-210-20112",
            questions: [
              {
                questionId: "b28af948-db8b-465e-92e6-3d42534c4533",
                question:
                  "The company's _____________ approach to product development _____________ customer feedback at every stage, _____________ user satisfaction and _____________ a loyal consumer base.",
                questionType: "text",
                answerType: "options",
                options: ["Incorporated", "User-centric", "Enhancing", "Cultivating"],
                correctAnswer: ["User-centric", "Incorporated", "Enhancing", "Cultivating"],
              },
              {
                questionId: "6e6534ea-260a-4c26-96fd-f830b27601fb",
                question:
                  "The _____________ musical performance _____________ elements from various genres, _____________ the audience with its unique sound and _____________ critical acclaim from industry experts.",
                questionType: "text",
                answerType: "options",
                options: ["Captivating", "Eclectic", "Garnering", "Blended"],
                correctAnswer: ["Eclectic", "Blended", "Captivating", "Garnering"],
              },
              {
                questionId: "7186e3da-0384-460a-af19-5a3984758e78",
                question:
                  "The scientist's _____________ research on quantum computing _____________ new possibilities for data processing, _____________ traditional limitations and _____________ the way for groundbreaking technological advancements.",
                questionType: "text",
                answerType: "options",
                options: ["Pioneering", "Paving", "Overcoming", "Opened up"],
                correctAnswer: ["Pioneering", "Opened up", "Overcoming", "Paving"],
              },
              {
                questionId: "10cbe3c2-13bb-4973-a794-18bf309b0791",
                question:
                  "The _____________ implementation of machine learning algorithms in medical diagnostics _____________ early detection of diseases, _____________ treatment outcomes and _____________ the workload of healthcare professionals.",
                questionType: "text",
                answerType: "options",
                options: ["Improving", "Reducing", "Enabled", "Revolutionary"],
                correctAnswer: ["Revolutionary", "Enabled", "Improving", "Reducing"],
              },
              {
                questionId: "71ffe41e-8732-48e6-87f2-f84ea07eb060",
                question:
                  "The _____________ security breach at the tech giant _____________ millions of users' data, _____________ concerns about online privacy and _____________ calls for stricter regulations.",
                questionType: "text",
                answerType: "options",
                options: ["Raising", "Massive", "Prompting", "Compromised"],
                correctAnswer: ["Massive", "Compromised", "Raising", "Prompting"],
              },
              {
                questionId: "48b9b4bd-5c2c-4c25-92c0-ce453b14e8d7",
                question:
                  "The _____________ educational reform _____________ a more inclusive curriculum, _____________ equal opportunities for all students and _____________ the overall quality of public schooling.",
                questionType: "text",
                answerType: "options",
                options: ["Comprehensive", "Enhancing", "Implemented", "Promoting"],
                correctAnswer: ["Comprehensive", "Implemented", "Promoting", "Enhancing"],
              },
              {
                questionId: "ed5e6e2d-8408-406e-be32-777ac26460e2",
                question:
                  "The company's _____________ commitment to sustainability _____________ eco-friendly practices across all departments, _____________ its carbon footprint and _____________ a model for corporate responsibility.",
                questionType: "text",
                answerType: "options",
                options: ["Implemented", "Setting", "Unwavering", "Reducing"],
                correctAnswer: ["Unwavering", "Implemented", "Reducing", "Setting"],
              },
              {
                questionId: "936eccaa-2f3b-4322-a3d3-ceabf2219dc5",
                question:
                  "The _____________ implementation of artificial intelligence in healthcare _____________ patient outcomes, _____________ the workload of medical professionals and _____________ new avenues for personalized treatment.",
                questionType: "text",
                answerType: "options",
                options: ["Opening", "Improved", "Gradual", "Reducing"],
                correctAnswer: ["Gradual", "Improved", "Reducing", "Opening"],
              },
              {
                questionId: "d78effdf-88ab-4667-8115-3bfb2baa0a24",
                question:
                  "The _____________ festival _____________ artists from diverse backgrounds, _____________ cultural exchange and _____________ a platform for emerging talents to showcase their work.",
                questionType: "text",
                answerType: "options",
                options: ["Providing", "Brought together", "Promoting", "International"],
                correctAnswer: ["International", "Brought together", "Promoting", "Providing"],
              },
              {
                questionId: "2d08ec76-a253-4f34-bc45-e12ef21b78fb",
                question:
                  "The _____________ implementation of smart city technologies _____________ urban efficiency and sustainability, _____________ quality of life for residents and _____________ a model for future urban development.",
                questionType: "text",
                answerType: "options",
                options: ["Enhancing", "Improved", "Providing", "Widespread"],
                correctAnswer: ["Widespread", "Improved", "Enhancing", "Providing"],
              },
            ],
          },
          message: "Questions fetched successfully",
        }

        setData(mockData.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handleSubmitAnswer = (questionId: string, userAnswer: (string | null)[], isCorrect: boolean) => {
    setUserAnswers((prev) => [...prev, { questionId, userAnswer, isCorrect }])

    if (currentQuestionIndex < (data?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setGameCompleted(true)
    }
  }

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setGameCompleted(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-gray-700" />
        <p className="mt-4 text-lg text-gray-700">Loading questions...</p>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Sentence Construction Challenge</h1>
          <p className="text-gray-600 mb-8 text-center">
            Complete sentences by placing the correct words in the blanks. You have 30 seconds for each question.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p>10 challenging questions</p>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p>30-second timer for each question</p>
            </div>
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p>Detailed feedback at the end</p>
            </div>
          </div>
          <Button onClick={handleStartGame} className="w-full py-6 text-lg">
            Start Challenge
          </Button>
        </div>
      </div>
    )
  }

  if (gameCompleted) {
    return <FeedbackScreen userAnswers={userAnswers} questions={data?.questions || []} onRestart={handleRestartGame} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {data && (
        <SentenceGame
          question={data.questions[currentQuestionIndex]}
          onSubmit={handleSubmitAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={data.questions.length}
        />
      )}
    </div>
  )
}

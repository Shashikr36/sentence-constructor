"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Trophy, ArrowRight } from "lucide-react"

interface Question {
  questionId: string
  question: string
  options: string[]
  correctAnswer: string[]
}

interface UserAnswer {
  questionId: string
  userAnswer: (string | null)[]
  isCorrect: boolean
}

interface FeedbackScreenProps {
  userAnswers: UserAnswer[]
  questions: Question[]
  onRestart: () => void
}

export function FeedbackScreen({ userAnswers, questions, onRestart }: FeedbackScreenProps) {
  const [activeTab, setActiveTab] = useState<string>("summary")

  // Calculate score
  const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length
  const score = (correctAnswers / questions.length) * 10
  const scorePercentage = (correctAnswers / questions.length) * 100

  // Get feedback message based on score
  const getFeedbackMessage = () => {
    if (scorePercentage >= 90) return "Excellent! You have a strong command of sentence construction."
    if (scorePercentage >= 70) return "Good job! You have a solid understanding of sentence construction."
    if (scorePercentage >= 50)
      return "Not bad! With a bit more practice, you'll improve your sentence construction skills."
    return "Keep practicing! Sentence construction takes time to master."
  }

  // Get question by ID
  const getQuestionById = (id: string) => {
    return questions.find((q) => q.questionId === id)
  }

  // Format sentence with answers for display
  const formatSentence = (question: Question, answers: (string | null)[]) => {
    const parts = question.question.split("_____________")
    const formattedSentence = []

    for (let i = 0; i < parts.length - 1; i++) {
      formattedSentence.push(parts[i])
      formattedSentence.push(
        <span key={`answer-${i}`} className="font-medium">
          {answers[i]}
        </span>,
      )
    }
    formattedSentence.push(parts[parts.length - 1])

    return formattedSentence
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Your Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-yellow-500" />
              </div>
              <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-lg px-4 py-1">
                {score.toFixed(1)}/10
              </Badge>
            </div>
            <p className="text-lg text-gray-700 text-center max-w-md">{getFeedbackMessage()}</p>
          </div>

          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Detailed Review</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-2xl font-bold">{correctAnswers}</p>
                    <p className="text-gray-500">Correct Answers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-2xl font-bold">{questions.length - correctAnswers}</p>
                    <p className="text-gray-500">Incorrect Answers</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Question Performance</h3>
                  <div className="space-y-2">
                    {userAnswers.map((answer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>Question {index + 1}</span>
                        {answer.isCorrect ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Incorrect
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              {userAnswers.map((answer, index) => {
                const question = getQuestionById(answer.questionId)
                if (!question) return null

                return (
                  <Card key={index} className={answer.isCorrect ? "border-green-200" : "border-red-200"}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Question {index + 1}</h3>
                        {answer.isCorrect ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Incorrect
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!answer.isCorrect && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Your Answer:</p>
                            <p className="text-gray-700">{formatSentence(question, answer.userAnswer)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Correct Answer:</p>
                            <p className="text-gray-700">{formatSentence(question, question.correctAnswer)}</p>
                          </div>
                        </>
                      )}
                      {answer.isCorrect && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Your Answer:</p>
                          <p className="text-gray-700">{formatSentence(question, answer.userAnswer)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} className="gap-2">
            Try Again <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

type Question = {
  id: string
  text: string
}

export function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [text, setText] = useState('')
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      toast.error('Failed to fetch questions')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentQuestion) {
      await updateQuestion()
    } else {
      await createQuestion()
    }
    setIsOpen(false)
    await fetchQuestions()
  }

  const createQuestion = async () => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        throw new Error('Failed to create question')
      }
      toast.success('Question created successfully')
    } catch (error) {
      toast.error('Failed to create question')
    }
  }

  const updateQuestion = async () => {
    try {
      const response = await fetch(`/api/questions?id=${currentQuestion?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        throw new Error('Failed to update question')
      }
      toast.success('Question updated successfully')
    } catch (error) {
      toast.error('Failed to update question')
    }
  }

  const deleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/questions?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete question')
      }
      toast.success('Question deleted successfully')
      await fetchQuestions()
    } catch (error) {
      toast.error('Failed to delete question')
    }
  }

  const openDialog = (question?: Question) => {
    if (question) {
      setCurrentQuestion(question)
      setText(question.text)
    } else {
      setCurrentQuestion(null)
      setText('')
    }
    setIsOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    setQuestionToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (questionToDelete) {
      await deleteQuestion(questionToDelete)
      setIsDeleteDialogOpen(false)
      setQuestionToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => openDialog()} 
        className="group transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
      >
        <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Add New Question
      </Button>
      <ul className="space-y-4">
        {questions.map((question) => (
          <li 
            key={question.id} 
            className="bg-white  p-4 rounded-lg shadow-md flex items-center justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
          >
            <p className="text-lg flex-grow">{question.text}</p>
            <div className="flex space-x-2 ml-4">
              <Button 
                variant="outline" 
                onClick={() => openDialog(question)} 
                className="p-2 hover:bg-gray-100  transition-colors duration-300"
              >
                <FaEdit className="w-4 h-4" />
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => openDeleteDialog(question.id)} 
                className="p-2 hover:bg-red-600 transition-colors duration-300"
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            <DialogDescription>
              {currentQuestion ? 'Edit the question text below.' : 'Enter the text for the new question.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="text">Question Text</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter question text"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">{currentQuestion ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
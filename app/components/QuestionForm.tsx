'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required").max(500, "Question text must be less than 500 characters"),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

export function QuestionForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(data: QuestionFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      toast.success("Question created successfully!");
      form.reset();
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error("Failed to create question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Input placeholder="Enter your question" {...field} />
              </FormControl>
              <FormDescription>
                Enter the question you want to ask about the property.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Question"}
        </Button>
      </form>
    </Form>
  );
}
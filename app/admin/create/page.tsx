"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import axios from 'axios'
import toast from "react-hot-toast"



const createQuestion =()=>{


    const formSchema = z.object({
        question:z.string().min(1,{
            message:"Please insert at least 1 character"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            question:""
        }
    })

    const onSubmit = async (values:z.infer<typeof formSchema>)=>{

        console.log(values)
        try{
            const response = await axios.post('/api/questions',values)
            console.log(response)
            toast.success("Question created")

        }catch(err){
            console.log(err)
        }
    }


    return(
        <div className="flex justify-center items-center h-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="question"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="text-lg">Add a question for our users</FormLabel>
                                <FormControl>
                                    <Input placeholder="Add a question" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center pt-6 justify-center">
                        <Button type="submit" className="w-full bg-red-700 text-white">Add question</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default createQuestion
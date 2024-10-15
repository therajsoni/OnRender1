import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from './ui/textarea'
import { useSelector } from 'react-redux'




const ExploreAdd = () => {

  const { user } = useSelector((store) => store.auth);
  const [undoAvailable, setUndoAvailable] = useState(true);

const id = user?._id;

    const [data,setData] = useState({
        title : '',
        description : '',
        text : ''
    })
    
    const [open,setOpen] =  useState(false)
    const [undo,setUndo] = useState(false);

    const [loading,setLoading] = useState(false);

    const handleChangeInput = (e) => {
        setData({
            ...data,[e.target.name]: e.target.value
        })
    } 
    
    console.log(data);

    const handleSelectChange = (value) => {
        setData({
            ...data,description : value
        })
    } 



    const handleToSubmit = async(e) => {
     setLoading(true)   
    
    const res = await axios.post(`https://instagram-9h25.onrender.com/api/v1/user/${id}/addblog`,data,{
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    
    if(res?.data.success){
      toast.success('okay');
      setLoading(false)
      // setBlogs((prevBlogs) => [...(prevBlogs || []), res.data.blog]);
      setData({
        title : '',
        description : '',
        text : ''
      })
    }
    else{
        setLoading(false)
       toast.error('no')
    }  
    }

    const handleUndoBlog = () => {
      setOpen(true);
    }

    const handleEvent = () => {
      setOpen(false);

      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => {
            if (undoAvailable) {
              handleUndoBlog();
            }
          },
          disabled: !undoAvailable // Disable the button based on undo availability
        },
      });
  
      // Set timeout to disable the undo action after 10 seconds
      setTimeout(() => {
        setUndoAvailable(false);
      }, 10000); // 10 seconds
    }



    return (
      <div className='flex flex-col items-start p-4 ml-[190px]'>
      <h1 className='text-xl font-extrabold mb-4'>MY BLOG</h1>
      <div className='flex justify-center mb-4'>
        <div className="bg-yellow-700 rounded-sm opacity-70 max-w-fit">
          <div onClick={() => setOpen(true)} className='text-white rounded-2xl border-2 border-dashed whitespace-nowrap p-4'>
            <p className="whitespace-nowrap">Create Blog</p>
          </div>
        </div>
      </div>
      {open && (
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Create your Blog</CardTitle>
            <CardDescription>{"Deploy blog"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="title" className="m-1">Title</Label>
                  <Input id="title" className="m-1" name='title' value={data.title} placeholder='Enter Title' type='text' onChange={handleChangeInput} />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="description" className="m-1">Subject</Label>
                  <Select className="m-1" onValueChange={handleSelectChange} value={data.description}>
                    <SelectTrigger id="description">
                      <SelectValue placeholder='Select description' />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="text" className="m-1">Content</Label>
                  <Textarea
                    className="m-1"
                    name='text'
                    value={data.text}
                    placeholder='Enter your content'
                    onChange={handleChangeInput}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between flex-col">
            <Button className="w-full my-1" onClick={handleToSubmit}>
              {loading ? "Loading..." : "Deploy"}
            </Button>
            <Button className="w-full my-1" onClick={handleEvent}>Cancel</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default ExploreAdd
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { formatDistanceToNow,format } from 'date-fns';
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
import { Textarea } from './ui/textarea'
import { toast } from 'sonner';



const ExploreAllData = () => {

const [data,setData] = useState([]);
const [loading,setLoading] = useState(false);

const { user } = useSelector((store) => store.auth);

const id = user?._id;
// console.log("here : "+ id);

useEffect(()=>{
    const fetchAllBlogData = async() => {
        try {
          const response = await fetch(`https://instagram-9h25.onrender.com/api/v1/user/${user?._id}/getblog`, {
            method: "GET",
          });
          const allData = await response.json();          
            console.log(allData);            
            setData(allData.blogs); 
          } catch (error) {
            console.error("Error fetching blog data:", error);
          }
        };
   
      fetchAllBlogData();
  
},[]);

console.log(data);



const deleteHandle = async(blogId) => {
  setLoading(true)
  const res = await fetch(`https://instagram-9h25.onrender.com/api/v1/user/deleteblog/${blogId}`,{
    method : "DELETE",
  })  
  if(res?.ok){
    setLoading(false)
    toast.success('ok');
    setData((prevData) => prevData.filter((blog)=> blog._id !== blogId))
  }
  else{
    setLoading(false)
    toast.error('not ok')
  }

}   

useEffect(()=>{

},[])


  return (
<div className={`mb-9 mt-6 grid grid-cols-1 gap-4 ${data.length > 0 ? 'ml-0 md:ml-[390px]' : ''}`}>
  {data && data.length > 0 ? (
    data.map((i, index) => (
      <div key={index} className='w-full'>
        <Card className="w-full max-w-[350px] mx-auto">
          <CardHeader>
            <CardTitle>{i.title}</CardTitle>
            <CardDescription>
              <p className="text-gray-500 text-sm">
                {`Created ${formatDistanceToNow(new Date(i.createdAt))} ago `}<span className='text-green-900 opacity-50'>({format(new Date(i.createdAt), 'dd/MM/yyyy')})</span>
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Area</Label>
                  <Input readOnly id="name" name='title' value={i.title} placeholder={i.description} type='text' />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">According</Label>
                  <Textarea
                    name='text'
                    value={i.text}
                    placeholder={i.text}
                    readOnly
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="w-full" onClick={() => deleteHandle(i._id)}>
              {loading ? "Loading" : "Delete"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    ))
  ) : (
    <p>No blogs found</p>
  )}
</div>
  )
}

export default ExploreAllData

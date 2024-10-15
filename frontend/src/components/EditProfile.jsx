import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading]= useState(false);
  const [ input, setInput ] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({
        ...input,
        profilePhoto: file,
      });
    }
  };

  const selectChangeHandler = (value) => {
    console.log("hello",value);
    
    setInput({
      ...input,
      gender: value,
    });
  };


  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio",input?.bio);
    formData.append("gender",input.gender)
    if(input.profilePhoto){
      formData.append("profilePhoto",input?.profilePhoto)
    }   
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit',formData,{
        headers : {
          'Content-Type' : 'multipart/form-data'
        },
        withCredentials : true
      });
      if(res.data.success){
        const updatedUserData = {
          ...user,
          bio : res.data.user?.bio,
          profilePicture : res.data.user?.profilePicture
          ,gender : res.data.user?.gender
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`)
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.res.data.message)
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl pl-10 mx-auto">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold  text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={user?.author?.profilePicture}
                alt="post_image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h1 className="font-bold text-sm">{user?.username}</h1>
            <span className="text-gray-600">{user?.bio || "Bio here..."}</span>
          </div>
          <input ref={imageRef}  onChange={fileChangeHandler} type="file" className="hidden" />
          <Button
            onClick={() => imageRef?.current.click()}
            className="bg-[#2b2b85f6] h-8 hover:bg-[#282863]"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea name="bio" value={input.bio} className="focus-visiable:ring-transparent" onChange={(e)=>setInput({...input,bio:e.target.value})} />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>

          <Select defaultValue = {input.gender} onValueChange={selectChangeHandler} >
            <SelectTrigger className="w-full">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <>
              <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            </>
          ) : (
            <>
              <Button className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]" onClick={editProfileHandler}>
                Submit
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;

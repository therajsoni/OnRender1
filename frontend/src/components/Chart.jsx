// Chart.js
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const options = ["natural", "business", "media", "social", "education", "sports"];

function Chart({ title, description, text }) {
  const user = useSelector((store) => store.auth);
  const userId = user?._id;
  const [blogdata, setblogdata] = useState({
    title: title,
    description: description,
    text: text,
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setblogdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setblogdata((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleDeploy = async () => {
    try {
      const response = await axios.post(
        `https://instagram-9h25.onrender.com/api/v1/user/${userId}/addblog`,
        blogdata
      );
      toast.success("Blog has been created successfully!");
      console.log(response.data); // Server response का लॉग
    } catch (error) {
      toast.error("Failed to create blog. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <Card className="max-h-fit max-w-fit">
      <CardHeader>
        <CardTitle>Create BLOG</CardTitle>
        <CardDescription>Deploy your new Blog in one-moment</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                name="title"
                placeholder="Name of your project"
                value={blogdata.title}
                onChange={handleChangeInput}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">According</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              name="text"
              placeholder="Message"
              value={blogdata.text}
              onChange={handleChangeInput}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="bg-gray-900 text-white"
          onClick={handleDeploy}
        >
          DEPLOY
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Chart;

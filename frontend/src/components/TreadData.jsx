// TreadData.js
import React, { useEffect, useState } from 'react'
import Chart from './Chart';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TreadData = () => {
  const user = useSelector((store) => store.auth);
  const userId = user?._id;
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    const dataget = async () => {
      try {
        const response = await axios.get(`https://instagram-9h25.onrender.com/api/v1/user/${userId}/getblog`);
        setBlog(response?.data?.blogs);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (userId) dataget(); 
  }, [userId]);

  return (
    <div>
      {blog && blog.length > 0 && blog.map((i, index) => (
        <Chart key={index} title={i.title} description={i.description} text={i.text} />
      ))}
    </div>
  );
};

export default TreadData;

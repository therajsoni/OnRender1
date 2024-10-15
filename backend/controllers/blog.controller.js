// blog.controller.js
import Blog from "../models/blog.model.js";

export async function createBlog(req, res) {
    try {
        const userid = req.params.id;
        const { title, description, text } = req.body;
        if (!title || !description || !text) {
            return res.status(400).json({
                success: false,
                message: "Blog not created. All fields are required."
            });
        }

        await Blog.create({
            title, description, text, id: userid
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Blog not created due to server error"
        });
    }
}

export async function getAllBlogs(req, res) {
    try {
        const blogs = await Blog.find({ id: req.params.id });
        return res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
}


export const deleteOneBlog = async(req,res) => {
    try {
        
        const a = await Blog.find({_id:req.params.id});
        if(!a){
            return res.status(500).json({
                success: false,
                message: "Failed to find blog"
            });
        }

        await Blog.findByIdAndDelete({_id:req.params.id});
        return res.status(200).json({
            success: true,
            message: "delete blog"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to deleted blog"
        });
    }
}
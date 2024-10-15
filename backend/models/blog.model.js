import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String, 
        required : true,
    },
    text : {
        type : String,
        required : true,
    },
    id : {
        type : mongoose.Schema.Types.ObjectId
        ,ref : 'user'
    },
    createdAt: { type: Date, default: Date.now }
})

const Blog = mongoose.models.Blog || mongoose.model("Blog",schema);

export default Blog;
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";


// ------------------------------------------------------

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing , please check!",
                success: false,
            });
        }

        // if (typeof password !== 'string') {
        //   return res.status(400).json({ message: 'Password must be a string' });
        // }
    

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try with new email and username",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        

        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

// ----------------------------------------------------------------

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing , please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPosswordMatch = await bcrypt.compare(password, user.password);

        if (!isPosswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = jwt.sign(
          {
              userId: user._id,
          },
          process.env.SECRET_KEY,
          {
              expiresIn: "1d",
          }
      );



      // populate  each post in the posts array    
      const populatedPosts = await Promise.all(
        user.posts.map(async(postId) => {
          const post = await Post.findById(postId);
          if(post.author.equals(user._id)){
            return post;
          }
          return null;
        })
      )                                                 

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        };

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user,
            });
    } catch (error) {
        console.log(error);
    }
};


export const logout = async (_, res) => {
    try {
      return res.cookie("token", "", { maxAge: 0 }).json({
        message: "Logged out Successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getProfile = async (req, res) => {
    try {
      const userId = req.params.id;
    
    
      
    // previos
      let user = await User.findById(userId).populate({
        path : 'posts',createdAt : -1
      }).populate('bookmarks');

      //new add
      // let user = await User.findById(mongoose.Types.ObjectId(userId))
      // .populate({
      //   path: 'posts',
      //   options: { sort: { createdAt: -1 } }
      // })
      // .populate('bookmarks');
  
      
      return res.status(200).json({
        user,
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  export const editProfile = async(req,res) => {
    try {
        const userId = req.id;
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;
        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({
                message : 'User not found',
                success : false
            })
        }
        if(bio)user.bio = bio;
        if(gender)user.gender = gender;
        if(profilePicture)user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message : 'Profile Updated.',
            success : true,
            user
        })


    } catch (error) {
        console.log(error);        
    }
  }

  export const getSuggestedUsers = async (req, res) => {
    try {
      const suggestedUsers = await User.find({
        _id: { $ne: req.id },
      }).select("-password");
  
      if (!suggestedUsers) {
        return res.status(400).json({
          message: "Currently don't have any users",
        });
      }
  
      return res.status(200).json({
        success: true,
        users: suggestedUsers,
      });
    } catch (error) {
      console.log(error);
    }
  };


  export const followOrUnfollow = async (req, res) => {
    try {
      const followkrneWala = req.id; // raj
      const jiskoFollowkrunga = req.params.id; //  raj 2.0
      if (followkrneWala === jiskoFollowkrunga) {
        return res.status(400).json({
          message: "You cannot follow/unfollow yorself",
          success: false,
        });
      }
      const user = await User.findById(followkrneWala);
      const targetUser = await User.findById(jiskoFollowkrunga);
  
      if (!user || !targetUser ) {
        return res.status(400).json({
          message: "User not found",
          success: false,
        });
      }
      // now mai check krunga ki follow karna hai ya unfollow
  
      const isFollowing = user.following.includes(jiskoFollowkrunga);
      if (isFollowing) {
        // unFollow logic lagega
        await Promise.all([
          User.updateOne(
            {
              _id: followkrneWala,
            },
            { $pull: { following: jiskoFollowkrunga } }
          ),
          User.updateOne(
            {
              _id: jiskoFollowkrunga,
            },
            { $pull: { following: followkrneWala } }
          ),
        ]);
  
        return res.status(200).json({
          message: "unfollowed successfullly ",
          success: true,
        });
      } else {
        // follow logic legaga
        await Promise.all([
          User.updateOne(
            {
              _id: followkrneWala,
            },
            { $push: { following: jiskoFollowkrunga } }
          ),
          User.updateOne(
            {
              _id: jiskoFollowkrunga,
            },
            { $push: { following: followkrneWala } }
          ),
        ]);
  
        return res.status(200).json({
          message: "followed successfullly ",
          success: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


export const getAllUser = async(req,res) => {
const allUser =await User.find({  _id: { $ne: req.id }})
return res.status(200).json({allUser : allUser,success : true});
}

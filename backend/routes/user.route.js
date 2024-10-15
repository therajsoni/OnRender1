import express from "express";
import { editProfile, followOrUnfollow, getAllUser, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { createBlog, deleteOneBlog, getAllBlogs } from "../controllers/blog.controller.js";
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuthenticated,getProfile);
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePhoto'),editProfile);
router.route('/suggested').get(isAuthenticated,getSuggestedUsers);
router.route('/followorunfollow/:id').get(isAuthenticated,getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated,followOrUnfollow);

router.route('/getalluser/:id').get(getAllUser)

router.route('/:id/addBlog').post(createBlog);
router.route('/:id/getblog').get(getAllBlogs);
router.route('/deleteblog/:id').delete(deleteOneBlog)

export default router;

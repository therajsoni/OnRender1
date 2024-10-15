import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Menu as MenuIcon } from 'lucide-react';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // For hamburger menu

    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === "Search") {
            navigate("/searchPage");
        } else if (textType === "Explore") {
            navigate("/explore");
        }
        setSidebarOpen(false); // Close sidebar after navigation on mobile
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
    <div>
        {/* Hamburger Menu for 763px and below */}
        <div className="md:hidden flex items-center p-4">
            <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuIcon className="h-6 w-6" />
            </Button>
        </div>

        {/* Sidebar */}
        <div className={`fixed top-0 z-30 left-0 px-4 border-r border-gray-300 w-[70%] sm:w-[25%] md:w-[20%] lg:w-[14%] xl:w-[12%] h-screen bg-white ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div 
                                    onClick={() => sidebarHandler(item.text)} 
                                    key={index} 
                                    className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-2 my-2 sm:p-3 sm:my-3'
                                >
                                    <span className='min-w-1'>{item.icon}</span>
                                    <span>{item.text}</span>
                                    {item.text === "Notifications" && likeNotification.length > 0 && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div>
                                                    {likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                        likeNotification.map((notification) => (
                                                            <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                <Avatar>
                                                                    <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                    <AvatarFallback>CN</AvatarFallback>
                                                                </Avatar>
                                                                <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>

        {/* Fullscreen sidebar overlay for mobile */}
        {sidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}>
            </div>
        )}
    </div>
);
}

export default LeftSidebar;

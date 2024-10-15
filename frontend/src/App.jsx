import React, { useEffect } from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client' 
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoute from './components/ProtectedRoute'
import SearchPage from './components/Search'
import Tread from './components/Tread'
import Explore from './components/Explore'

const browserRouter = createBrowserRouter([
  {
    path : '/',
    element : <ProtectedRoute>
       <MainLayout/>
       </ProtectedRoute>,
    children : [
      {
        path : '/',
        element : <ProtectedRoute>
          <Home/>
          </ProtectedRoute>
          
      },
      {
        path : '/profile/:id',
        element : <ProtectedRoute>
          <Profile/>
          </ProtectedRoute>
          
      },
      {
        path : '/account/edit',
        element : <ProtectedRoute>
          <EditProfile/>
          </ProtectedRoute>
          
      },
      {
        path : '/chat',
        element : <ProtectedRoute>
          <ChatPage/>
          </ProtectedRoute>
          
      },
      {
        path : '/searchPage',
        element : <SearchPage/>
      },
      {
        path : '/explore',
        element : <Explore/>
      }
    ]
  },
  {
    path : '/login',
    element : <Login/>
  },
  {
    path:"/signup",
    element : <Signup/>
  }
])

export default function App() {
  const {user} = useSelector(store => store.auth);
  const {socket} = useSelector(store => store.socketio);
  const dispatch = useDispatch();

useEffect(()=>{

  if(user){
const socketio  = io(`http://localhost:8000`,{
  query : {
    userId : user?._id
  },
  transports : ['websocket']
});
dispatch(setSocket(socketio));
// listen all the events
// getOnlineUsers
socketio.on('getOnlineUsers',(onlineUsers)=>{
  dispatch(setOnlineUsers(onlineUsers));
})

console.log("online :");


console.log(setOnlineUsers);

socketio.on('notification',(notification)=>{
  dispatch(setLikeNotification(notification));
})

return () => {
  socketio.close();
  dispatch(setSocket(null));
}
  }
  else if(socket){
    socket.close();
    dispatch(setSocket(null));
  }
},[user,dispatch]);

  return (
    <>
   <RouterProvider router={browserRouter}/>
    </>
  )
}

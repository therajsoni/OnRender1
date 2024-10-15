import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-scroll';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
  const { suggestedUsers, loading, error } = useSelector((store) => store.auth);
  const [isFollowing, setIsFollowing] = useState({}); // To manage follow state for users

  // Optional: useEffect to initialize following state based on suggested users
  useEffect(() => {
    const initialFollowingState = suggestedUsers.reduce((acc, user) => {
      acc[user._id] = false; // Assuming initially no user is followed
      return acc;
    }, {});
    setIsFollowing(initialFollowingState);
  }, [suggestedUsers]);

  const handleFollow = (userId) => {
    // Implement follow functionality here (e.g., API call)
    setIsFollowing((prev) => ({
      ...prev,
      [userId]: !prev[userId], // Toggle follow state
    }));
  };

  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm mb-4'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
      {loading && <p>Loading suggested users...</p>}
      {error && <p className="text-red-500">Error loading suggested users: {error}</p>}
      {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
        suggestedUsers.map((user) => (
          <div key={user._id} className='flex justify-between items-center mb-2'>
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className='font-semibold text-sm'>
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
              </div>
            </div>
            <div>
              <span
                className={`text-xs font-bold cursor-pointer hover:text-[#3495d6] ${isFollowing[user._id] ? 'text-gray-500' : 'text-[#3BADF8]'}`}
                onClick={() => handleFollow(user._id)}
                role="button"
                aria-label={isFollowing[user._id] ? "Unfollow user" : "Follow user"}
              >
                {isFollowing[user._id] ? 'Following' : 'Follow'}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className='text-gray-500'>No suggested users available.</p>
      )}
    </div>
  );
};

export default SuggestedUsers;

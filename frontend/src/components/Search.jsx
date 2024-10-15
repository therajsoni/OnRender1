import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const { user } = useSelector((store) => store.auth);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`https://instagram-9h25.onrender.com/api/v1/user/getalluser/${user?._id}`);
        const usernameAll = response.data.allUser;

        const usernames = usernameAll.map((user1) => ({ username: user1.username, _id: user1._id }));
        setSuggestions(usernames);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      }
    };

    if (user?._id) {
      fetchAllUsers();
    }
  }, [user?._id]);

  const handleToProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.username && suggestion.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative w-full max-w-md mx-auto sm:ml-[260px] sm:w-[calc(100%-260px)] md:ml-[42rem] md:w-[calc(100%-42rem)]">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="w-full p-4  pr-10 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          aria-label="Search users"
          aria-describedby="search-suggestions"
        />
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow mt-1 z-10">
          {error && <p className="p-2 text-red-500">{error}</p>}
          {query && filteredSuggestions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto" aria-live="polite" id="search-suggestions">
              {filteredSuggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  className="p-2 cursor-pointer hover:bg-gray-200 transition duration-150 ease-in-out"
                  onClick={() => {
                    setQuery(suggestion.username);
                    handleToProfile(suggestion._id);
                  }}
                >
                  {suggestion.username}
                </li>
              ))}
            </ul>
          ) : (
            query && <p className="p-2 text-gray-500">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

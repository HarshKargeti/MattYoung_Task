import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_NASA_API_KEY;
console.log(process.env.REACT_APP_NASA_API_KEY);

const Home = ({ user }) => {

  const [photo, setPhoto] = useState("");

    useEffect(() => {
        const fetchPhoto = async() => {
            await axios(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
            .then((result) => {
                console.log(result.data.url)
                setPhoto(result.data)
            })
        } 
        fetchPhoto(); 
    }, [])

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };
  return (
    <div style={{ textAlign: "center", margin: "3rem" }}>
      <h1>Dear {user?.email}</h1>

      <p>
        You are viewing this page because you are logged in or you just signed
        up
      </p>

      <div>
        <button
          onClick={logout}
          style={{
            color: "red",
            border: "1px solid gray",
            backgroundColor: "white",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div>
            <h1>{photo.title}</h1> 
            <img src = {photo.url} alt={photo.title}/>
        </div>
    </div>
    
  );
};

export default Home;

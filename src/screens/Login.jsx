import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import './css/Login.css';


const Login = () => {
  const { handleGoogle, loading, error } = useFetch(
    `${process.env.REACT_APP_BASE_URL}/login`
  );

  useEffect(() => {
    const google = window.google;
    if (google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(document.getElementById("loginDiv"), {
        // type: "standard",
        theme: "filled_black",
        // size: "small",
        text: "signin_with",
        shape: "pill",
      });

      
    }
  }, [handleGoogle]);

  
  const onSubmit = () => {
    
  
    const email = document.getElementById('email').value;
    const password = (document.getElementById('password')).value;
    const data = {
      
      email: email,
      password: password,
    }
    const url = `${process.env.REACT_APP_BASE_URL}/signup`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ data: data }),
    })
    
    .then((res)=>{
      if (data?.email) {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.reload();
      }
      
    })
    
    .catch((err)=>{
      console.log(err);
    })

    
  }


  return (
    <>
      <nav style={{ padding: "2rem" }}>
        <Link to="/">Go Back</Link>
      </nav>
      <header style={{ textAlign: "center" }}>
        <h1>Login to continue</h1>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? <div>Loading....</div> : <div id="loginDiv"></div>}
      </main>

      <section id="logIn">
        <div id="log">
            
                
                <div class="form-group">
                    <label htmlFor="email">Email: </label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" />
                </div>
                <div class="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="phone" name="phone" id="password" placeholder="Enter your password" />
                </div>
               
                <button class="btnsubmit" onClick={() => onSubmit()}>Submit</button>
                
           
        </div>
    </section>

      <footer></footer>
    </>
  );
};

export default Login;

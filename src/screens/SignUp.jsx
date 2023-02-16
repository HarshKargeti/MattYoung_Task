import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import './css/SignUp.css';

const SignUp = () => {
  const { handleGoogle, loading, error } = useFetch(
    `${process.env.REACT_APP_BASE_URL}/signup`
  );

 

  const onSubmit = () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = (document.getElementById('password')).value;
    const data = {
      firstName: firstName,
      lastName: lastName,
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
      if (data?.firstName) {
        const data2 ={
          firstName,lastName,email
        }
        console.log(data2)
        localStorage.setItem("user", JSON.stringify(data2));
        window.location.reload();
      }
      
    })
    
    .catch((err)=>{
      console.log(err);
    })
  }
  
console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
  useEffect(() => {
    /* global google */
    const google = window.google;
    if (google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogle,
      });

      google.accounts.id.renderButton(document.getElementById("signUpDiv"), {
        // type: "standard",
        theme: "filled_black",
        // size: "small",
        text: "continue_with",
        shape: "pill",
      });

      // google.accounts.id.prompt()
    }
  }, [handleGoogle]);

  return (
    <>
      <nav style={{ padding: "2rem" }}>
        <Link to="/">Go Back</Link>
      </nav>
      <header style={{ textAlign: "center" }}>
        <h1>Register to continue</h1>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {error && <p style={{ color: "white" }}>{error}</p>}
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div id="signUpDiv" data-text="signup_with"></div>
        )}
        <br></br>
        OR
        <section id="signUp">
        <div id="sign">
            
                <div class="form-group">
                    <label htmlFor="name">First Name: </label>
                    <input type="text" name="firstName" id="firstName" placeholder="Enter your name" />
                </div>
                <div class="form-group">
                    <label htmlFor="Last name">Last Name: </label>
                    <input type="text" name="lastName" id="lastName" placeholder="Enter your name" />
                </div>
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
      </main>
      <footer></footer>
    </>
  );
};

export default SignUp;

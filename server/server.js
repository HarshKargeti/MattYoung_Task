const express = require("express");
const app = express();
require("dotenv/config");
const bcrypt = require('bcrypt');
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

require("./db/conn");
const Contact = require("./models/contactus");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);
app.use(express.json());



// This function is used verify a google account

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
console.log(GOOGLE_CLIENT_ID);
console.log(process.env.JWT_SECRET);
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

app.post("/signup", async (req, res) => {
  try {

    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);

      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;


      const data = new Contact({
        firstName : profile.name,
        email: profile.email
      })
      const contact = await data.save()
      
      res.status(201).json({
        message: "Signup was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, "myScret", {
            expiresIn: "1d",
          }),
        },
      });
    }
    else{
      const profile = (req.body.data);
      let encryptedPassword = bcrypt.hashSync(profile.password, 10);
      const data = new Contact({
        firstName : profile.firstName,
        email: profile.email,
        password: encryptedPassword
      })
      
      const contact = await data.save()
      res.status(201).json({
        message: "Signup was successful",
        user: {
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          picture: "",
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, "myScret", {
            expiresIn: "1d",
          }),
        },
      });
     
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "An error occured. Registration failed.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      const existsInDB = await Contact.findOne({email:profile.email})
      if (!existsInDB) {
        return res.status(400).json({
          message: "You are not registered. Please sign up",
        });
      }

      res.status(201).json({
        message: "Login was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }


    else{
      const profile = (req.body.data);
      console.log(profile);

      const existsInDB = await Contact.findOne({email:profile.email})
      if (!existsInDB) {
        return res.status(400).json({
          message: "You are not registered. Please sign up",
        });
      }
     
     
      const match = bcrypt.compare(profile.password, existsInDB.password);

       if(match) {
         //login
         res.status(201).json({
          message: "Login was successful",
          user: {
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            }),
          },
        });
        }
       
    }




  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});

console.log(DB)

app.listen("5152", () => console.log("Server running on port 5152"));

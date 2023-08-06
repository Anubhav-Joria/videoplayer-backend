const express = require("express");
const bcrypt = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
const { Users } = require("../Model/schemas");

const dummyInitialData = {
  "categories": [
    {
      "name": "Education",
      "id": 2
    },
    {
      "name": "Chess",
      "id": 4
    },
    {
      "name": "Dance",
      "id": 6
    }
  ],
  "cards": [
    {
      "name": "React Tutorials",
      "link": "https://www.youtube.com/watch?v=-mJFZp84TIY",
      "category": "Education",
      "id": 1
    },
    {
      "name": "Famous Wedding Show - Quick Style",
      "link": "https://www.youtube.com/watch?v=ardtvdR28SQ",
      "category": "Dance",
      "id": 7
    },
    {
      "name": "Gravity",
      "link": "https://www.youtube.com/watch?v=uzjA5d0QXv8",
      "category": "Education",
      "id": 10
    }
    
  ]
}

authRouter.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    res.status(404).send({ message: "Please fill all the required fields" });
  }

  try {
    const userExist = await Users.findOne({ email });
    if (userExist) {
      res.status(200).send({ message: "User Already Exist" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new Users({
        name,
        email,
        password: hashedPassword,
        data: dummyInitialData
      });
      await user.save();
      try {
        const userExist = await Users.findOne({ email: email });
        if (userExist) {
          const isAuthenticated = await bcrypt.compare(
            password,
            userExist.password
          );
          if (isAuthenticated) {
            const token = jwt.sign(
              { userId: userExist._id, email: userExist.email },
              SECRET_KEY,
              { expiresIn: "2h" }
            );
            res.cookie("jwt-token", token, { httpOnly: true });
            res.status(200).send({ message: "Login successful", token: token, email: userExist.email });
          } else {
            res.status(400).send({ message: "Password did not match" });
          }
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (err) {
        res.status(400).send({ message: err.message });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404).send({ message: "please enter email and password" });
  } else {
    try {
      const userExist = await Users.findOne({ email: email });
      if (userExist) {
        const isAuthenticated = await bcrypt.compare(
          password,
          userExist.password
        );
        if (isAuthenticated) {
          const token = jwt.sign(
            { userId: userExist._id, email: userExist.email },
            SECRET_KEY,
            { expiresIn: "2h" }
          );
          res.status(200).send({ message: "Login successful", token: token, email: userExist.email });
        } else {
          res.status(400).send({ message: "Password did not match" });
        }
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
});

const tokenValidationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

authRouter.get("/api/protected", tokenValidationMiddleware, (req, res) => {
  res.json({ user: req.user });
});

authRouter.post("/api/logout", function (req, res) {
  // Clear the user's session
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      // Redirect the user to the login page
      res.redirect("/login");
    }
  });
});

authRouter.get("/api/getUser", async (req, res) => {
  const id = req.query.id;
  try {
    const user = await Users.findOne({ _id: id });
    res.status(200).send({ user });
  } catch (err) {
    res.status(400).send({ message: "cannot get the user data" });
  }
});

authRouter.post("/api/changeData", (req, res) => {
  const newName = req.body.name;
  const newPassword = req.body.password;
  const id = req.body.id;

  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(200).send({ message: "Invalid" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.findOneAndUpdate(
      { _id: id },
      {
        name: newName,
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Name changed successfully" });
  });
});

module.exports = authRouter;

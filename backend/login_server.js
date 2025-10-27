const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const usersFilePath = "users.json";

// Helper function to read users
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
};

// Helper function to save users
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing to users.json:", error);
  }
};

// Login route
app.post("/login", (req, res) => {
  const { identifier, password } = req.body;
  const users = getUsers();

  const user = users.find(
    (u) =>
      (u.email === identifier || u.roll === identifier) &&
      u.password === password
  );

  if (user) {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.json({ success: false, message: "Invalid credentials." });
  }
});

// Register route
app.post("/register", (req, res) => {
  const { fullname, roll, batch, course, email, password } = req.body;
  
  if (!fullname || !roll || !batch || !course || !email || !password) {
     return res.json({ success: false, message: "All fields are required." });
  }
  
  const users = getUsers();

  const existingUser = users.find(u => u.email === email || u.roll === roll);
  if (existingUser) {
    return res.json({ success: false, message: "User with this email or roll number already exists." });
  }

  const newUser = {
    id: Date.now().toString(),
    fullname,
    roll,
    batch,
    course,
    email,
    password
  };

  users.push(newUser);
  saveUsers(users);
  
  res.json({ success: true, message: "Registration successful! You can now log in." });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
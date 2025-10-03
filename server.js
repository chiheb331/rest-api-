
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config({ path: "./config/.env" });

const app = express();

app.use(express.json());

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connected..."))
.catch(err => console.error(" MongoDB connection error:", err));

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

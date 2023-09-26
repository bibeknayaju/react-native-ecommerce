const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require("./models/user");
const Order = require("./models/Order");

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://bibeknayaju:bibek@cluster0.ihqppyy.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("CONNECTED TO MONGODB");
  })
  .catch((error) => {
    console.log("ERROR RIGHT MONGODB CONNECTION", error);
  });

// for generating the secret key
const generateSecreteKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecreteKey();

// function to send the email
const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sthaict@gmail.com",
      pass: "tnvjwuqfowyctrnq",
    },
  });

  // compose the email
  const mailOption = {
    from: "sthaict@gmail.com",
    to: email,
    subject: "For verification process demo",
    text: `Please click in the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };

  // send the email
  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("ERROR IN SENDING THE EMAIL", error);
    throw error; // Re-throw the error to be caught later
  }
};

// for registering the user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking if the user is already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // if not then create a new user
    const newUser = new User({ email, name, password });

    // generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // save the user
    await newUser.save();

    // send the verification email to the user
    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("ERROR IN REGISTERING THE USER", error.message);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find the user with the given verification token
    const user = await User.findOne({ verificationToken: token });

    // Log the user data for debugging purposes
    console.log("User data:", user);

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email Verification Failed:", error);
    res.status(500).json({ message: "Email Verification Failed" });
  }
});

// endpoint for the login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // checking the user is exits or now
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check the password
    if (user.password !== password) {
      return res.status(401).json({ message: "INVALID PASSWORD" });
    }

    // generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.log("ERROR ON LOGIN", error.message);
    res.status(500).json({ message: "INVALID EMAIL OR PASSWORD" });
  }
});

// endpoint of the addresses
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    // find the user by the userID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found brother" });
    }

    // else add the new address to the user's addresses array
    user.addresses.push(address);

    // save the updated user to the db
    await user.save();

    // sending the good response to frontend
    res.status(200).json({ message: "address created successfully" });
  } catch (error) {
    console.log("ERROR ON THE BACKEND OF THE ADDRESS", error.message);
    res.status(500).json({ message: "Error adding the address" });
  }
});

// endpoint to get all the address of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found brother" });
    }

    const addresses = user.addresses;
    res.status(200).json(addresses);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "error retrieving the addreses of the user" });
  }
});

//endpoint to store all the orders
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    //create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});
//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

app.listen(port, () => {
  console.log("SERVER STARTED");
});

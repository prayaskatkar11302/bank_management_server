import User from "../Modals/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      confirmpassword,
      transactionPin,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmpassword ||
      !transactionPin
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      phone,
      address,
      profileImage: req.file
        ? req.file.filename
        : "",
      password: hashPassword,
      transactionPin: Number(transactionPin),
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!email||!password){
            res.status(400).json({message:"All fill the brackets"})
        }

        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({message:"User Not Found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.status(400).json({message:"Password is Invalid"})
        }

        //generate token

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.SECRET_KEY,
            {expiresIn: "1d"}
        )

        res.status(201).json({message:"Login Successfull",token:token,user:user})


    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(req.body);
    console.log(req.file);

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // Update image if uploaded
    if (req.file) {
      user.profileImage = req.file.filename;
    }

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
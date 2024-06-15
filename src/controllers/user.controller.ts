import { Request, Response } from "express";
import Member from "../models/member.model";
import { IMember } from "../interfaces/member.interface";

const createUser = async (req: Request, res: Response) => {
  const user = {
    membername: req.body.membername,
    name: req.body.name,
    YOB: req.body.YOB,
    password: req.body.password,
    isAdmin: req.body.isAdmin || false
  };
  user.YOB = parseInt(user.YOB, 10);

  if (isNaN(user.YOB)) {
    return res.status(400).json({ message: "Year of Birth must be a number!" });
  }
  try {
    // Check if membername already exists
    const existingUser: IMember = await Member.findOne({
      membername: user.membername
    });

    if (existingUser) {
      return res.status(400).json({ message: "Membername already exists!" });
    }

    // Create a new user instance
    const newUser = new Member(user);

    // Save the member to the database
    await newUser.save();

    // Respond with success message or redirect to login
    res.status(201).json({ message: "Register successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad request!" });
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: IMember[] = await Member.find().exec();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  createUser,
  getAllUsers
};

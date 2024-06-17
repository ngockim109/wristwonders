import { Request, Response } from "express";
import Member from "../models/member.model";
import { IMember } from "../interfaces/member.interface";
import { BadRequestError } from "../errors/badRequestError";

const createUser = async (req: Request, res: Response) => {
  const user = {
    membername: req.body.membername,
    name: req.body.name,
    YOB: req.body.YOB,
    password: req.body.password,
    isAdmin: req.body.isAdmin || false
  };
  const YOBString = req.body.YOB;
  const yob = Number(YOBString);

  if (isNaN(yob)) {
    throw new BadRequestError("Year of birth must be a number!", user);
  }
  try {
    // Check if membername already exists
    const existingUser: IMember = await Member.findOne({
      membername: user.membername
    });

    if (existingUser) {
      throw new BadRequestError("Membername already exists!", existingUser);
    }

    // Create a new user instance
    const newUser = new Member(user);

    // Save the user to the database
    await newUser.save();

    // Respond with success message or redirect to login
    res.status(201).json({ message: "Create member successfully!" });
  } catch (error) {
    console.log(error);
    res.redirect("/wristwonders/error/500");
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: IMember[] = await Member.find().exec();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.redirect("/wristwonders/error/500");
  }
};

export default {
  createUser,
  getAllUsers
};

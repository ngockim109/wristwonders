import { Request, Response } from "express";
import Member from "../models/member.model";
import { IMember } from "../interfaces/member.interface";

const createMember = async (req: Request, res: Response) => {
  const member = {
    membername: req.body.membername,
    name: req.body.name,
    YOB: req.body.YOB,
    password: req.body.password,
    isAdmin: false
  };
  member.YOB = parseInt(member.YOB, 10);

  if (isNaN(member.YOB)) {
    return res.status(400).json({ message: "Year of Birth must be a number!" });
  }
  try {
    // Check if membername already exists
    const existingMember: IMember = await Member.findOne({
      membername: member.membername
    });

    if (existingMember) {
      return res.status(400).json({ message: "Membername already exists!" });
    }

    // Create a new member instance
    const newMember = new Member(member);

    // Save the member to the database
    await newMember.save();

    // Respond with success message or redirect to login
    res.status(201).json({ message: "Register successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad request!" });
    res.status(500).json({ message: "Server error" });
  }
};

const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members: IMember[] = await Member.find({ isAdmin: false }).exec();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  createMember,
  getAllMembers
};

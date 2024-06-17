import { Request, Response } from "express";
import Member from "../models/member.model";
import { IMember } from "../interfaces/member.interface";
import { ACCESS_TOKEN_EXPIRATION, createAccessToken } from "../utils/jwt";

const createMember = async (req: Request, res: Response) => {
  const member = {
    membername: req.body.membername,
    name: req.body.name,
    YOB: req.body.YOB,
    password: req.body.password,
    isAdmin: false
  };
  console.log(req.body);
  const YOBString = req.body.YOB;
  const yob = Number(YOBString);
  console.log(yob);
  if (isNaN(yob)) {
    return res.status(400).json({ message: "Year of birth must be a number!" });
  }
  try {
    // Check if membername already exists
    const existingMember: IMember = await Member.findOne({
      membername: member.membername,
      YOB: yob
    });

    if (existingMember) {
      return res.status(400).json({ message: "Membername already exists!" });
    }

    // Create a new member instance
    const newMember = new Member(member);

    // Save the member to the database
    const mem = await newMember.save();

    // Save token
    const token = createAccessToken({ member_id: mem._id });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXPIRATION * 1000
    });
    // Respond with success message or redirect to login
    res
      .status(201)
      .json({ member: mem.name, message: "Registered successfully" });
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

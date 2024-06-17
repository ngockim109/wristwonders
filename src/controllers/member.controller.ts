import { Request, Response } from "express";
import Member from "../models/member.model";
import { IMember } from "../interfaces/member.interface";
import { ACCESS_TOKEN_EXPIRATION, createAccessToken } from "../utils/jwt";
import { BadRequestError } from "../errors/badRequestError";

const createMember = async (req: Request, res: Response) => {
  if (!res.locals.member) {
    const member = {
      membername: req.body.membername,
      name: req.body.name,
      YOB: req.body.YOB,
      password: req.body.password,
      isAdmin: false
    };
    const YOBString = req.body.YOB;
    const yob = Number(YOBString);

    if (isNaN(yob)) {
      throw new BadRequestError("Year of birth must be a number!", member);
    }
    try {
      // Check if membername already exists
      const existingMember: IMember = await Member.findOne({
        membername: member.membername,
        YOB: yob
      });

      if (existingMember) {
        throw new BadRequestError("Membername already exists!", existingMember);
      }

      // Create a new member instance
      const newMember = new Member(member);

      // Save the member to the database
      const mem = await newMember.save();

      // Save token
      const token = createAccessToken({ member_id: mem._id });
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION * 1000
      });
      // Respond with success message or redirect to login
      res.redirect("/wristwonders");
    } catch (error) {
      console.log(error);
      res.redirect("/wristwonders/error/500");
    }
  } else res.redirect("/wristwonders");
};

const getAllMembers = async (req: Request, res: Response) => {
  try {
    const members: IMember[] = await Member.find({ isAdmin: false }).exec();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.redirect("/wristwonders/error/500");
  }
};

const getMember = async (req: Request, res: Response) => {
  try {
    const memberLocals = res.locals.member;
    const member: IMember = await Member.findById(memberLocals._id).exec();
    const { membername, name, YOB } = member;
    const newMember = { membername, name, YOB };
    res.render("profile", { member: newMember, title: "Profile" });
  } catch (error) {
    console.error(error);
    res.redirect("/wristwonders/error/500");
  }
};

export default {
  createMember,
  getAllMembers,
  getMember
};

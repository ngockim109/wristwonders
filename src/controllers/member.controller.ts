import { Request, Response, NextFunction } from "express";
import { IMember } from "../interfaces/member.interface";
import { ACCESS_TOKEN_EXPIRATION } from "../utils/jwt";
import MemberService from "../services/member.service";
import { Unauthenticated } from "../errors/unauthenticatedError";
import { BadRequestError } from "../errors/badRequestError";

// Member register account
const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.member) {
    const member = {
      membername: req.body.membername,
      name: req.body.name,
      YOB: req.body.YOB,
      password: req.body.password,
      isAdmin: false
    };
    const YOBString = req.body.YOB;
    try {
      const token = await MemberService.createMemberHandler(YOBString, member);
      if (token) {
        res.cookie("access_token", token, {
          httpOnly: true,
          maxAge: ACCESS_TOKEN_EXPIRATION * 1000
        });
        res.status(201).json({ message: "Member created successfully" });
      }
    } catch (error) {
      next(error);
    }
  } else
    throw new BadRequestError(
      "Already logged in! If you want to login another account, please logout!"
    );
};

// Get all member who is not admin
const getAllMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members: IMember[] = await MemberService.getAllMembersHandler();
    // const transformedMembers = members.map((member: IMember & { _id: Types.ObjectId }) => ({
    //   ...member.toObject(), // Convert to plain object
    //   _id: member._id.toString() // Convert _id to string
    // }));
    res
      .status(200)
      .json({ message: "Get all members successfully!", data: members });
  } catch (error) {
    next(error);
  }
};

// Get member from locals but just get membername, name, YOB
const getMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberLocals = res.locals.member;
    const member: IMember = await MemberService.getMemberHandler(
      memberLocals._id
    );
    const { membername, name, YOB, isAdmin } = member;
    const newMember = { membername, name, YOB, isAdmin };
    res
      .status(200)
      .json({ message: "Get member successfully!", data: newMember });
  } catch (error) {
    next(error);
  }
};
// Get admin from locals but just get membername, name, YOB
const getAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberLocals = res.locals.member;
    const member: IMember = await MemberService.getMemberHandler(
      memberLocals._id
    );
    const { membername, name, YOB, isAdmin } = member;
    const newMember = { membername, name, YOB, isAdmin };
    res
      .status(200)
      .json({ message: "Get admin profile successfully!", data: newMember });
  } catch (error) {
    next(error);
  }
};

// Update member profile (name and YOB)
const getUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.member) {
      const { membername, name, YOB, isAdmin } = res.locals.member;
      const newMember = { membername, name, YOB, isAdmin };
      res.status(200).json({
        message: "Update member profile successfully!",
        data: newMember
      });
    } else {
      return next(new Unauthenticated());
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberLocals = res.locals.member;
    const updateData = {
      name: req.body.name,
      YOB: req.body.YOB
    };
    console.log(updateData, memberLocals);
    if (
      updateData.name === memberLocals.name &&
      Number(updateData.YOB) === Number(memberLocals.YOB)
    ) {
      throw new BadRequestError(
        "The new information cannot be the same as the old one!"
      );
    } else {
      const updatedMember = await MemberService.updateProfileHandler(
        memberLocals._id,
        updateData
      );
      const { membername, name, YOB, isAdmin } = updatedMember;
      const newMember = { membername, name, YOB, isAdmin };
      if (updatedMember) {
        res.status(200).json({
          message: "Profile updated successfully!",
          data: newMember
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// Update member password
const getUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.member) {
      const { membername, name, YOB, isAdmin } = res.locals.member;
      const newMember = { membername, name, YOB, isAdmin };
      res.status(200).json({
        message: "Get update password successfully!",
        data: newMember
      });
    } else {
      return next(new Unauthenticated());
    }
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberLocals = res.locals.member;
    const newPassword = req.body.password;
    const oldPassword = req.body.oldPassword;
    const confirmPassword = req.body.confirmPassword;

    const updateMember = await MemberService.updatePasswordHandler(
      memberLocals._id,
      oldPassword,
      newPassword,
      confirmPassword
    );
    if (updateMember) {
      res.clearCookie("access_token");
      res.status(200).json({
        message: "Password updated successfully! Please login again."
      });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createMember,
  getAllMembers,
  getMember,
  updateProfile,
  updatePassword,
  getUpdateProfile,
  getUpdatePassword,
  getAdminProfile
};

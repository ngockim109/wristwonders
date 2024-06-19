import { Request, Response, NextFunction } from "express";
import { IMember } from "../interfaces/member.interface";
import { ACCESS_TOKEN_EXPIRATION } from "../utils/jwt";
import MemberService from "../services/member.service";
import { Unauthenticated } from "../errors/unauthenticatedEror";

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
        res.redirect("/wristwonders");
      }
    } catch (error) {
      next(error);
    }
  } else res.redirect("/wristwonders");
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
    res.render("members", { members: members, title: "Members" });
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
    const { membername, name, YOB } = member;
    const newMember = { membername, name, YOB };
    res.render("members/profile", { member: newMember, title: "Profile" });
  } catch (error) {
    next(error);
  }
};

// Update member profile (name and YOB)
const getUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.member) {
      const { membername, name, YOB } = res.locals.member;
      const newMember = { membername, name, YOB };
      res.render("members/profile/update_profile", {
        title: "Update profile",
        member: newMember
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

    const updatedMember = await MemberService.updateProfileHandler(
      memberLocals._id,
      updateData
    );
    const { membername, name, YOB } = updatedMember;
    const newMember = { membername, name, YOB };
    if (updatedMember) {
      res.render("members/profile/update_profile", {
        member: newMember,
        title: "Update profile",
        message: "Update profile successfully!"
      });
    }
  } catch (error) {
    next(error);
  }
};

// Update member password
const getUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.member) {
      const { membername, name, YOB } = res.locals.member;
      const newMember = { membername, name, YOB };
      res.render("members/profile/update_password", {
        title: "Change password",
        member: newMember
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

    const updateMember = await MemberService.updatePasswordHandler(
      memberLocals._id,
      oldPassword,
      newPassword
    );
    const { membername, name, YOB } = memberLocals;
    const newMember = { membername, name, YOB };
    if (updateMember) {
      res.render("members/profile/update_password", {
        member: newMember,
        title: "Change password",
        message: "Update password successfully!"
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
  getUpdatePassword
};

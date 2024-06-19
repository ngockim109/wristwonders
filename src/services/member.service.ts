import { IMember } from "./../interfaces/member.interface";
import Member from "../models/member.model";
import { BadRequestError } from "../errors/badRequestError";
import { compareHashPassword, createAccessToken } from "../utils/jwt";

export default class MemberService {
  static async getAllMembersHandler() {
    const members = await Member.find({ isAdmin: false }).exec();
    return members;
  }

  static async getMemberHandler(memberId: string) {
    const member = await Member.findById(memberId).exec();
    if (!member) {
      throw new BadRequestError("Member not found!");
    }
    return member;
  }

  static async createMemberHandler(YOBString: string, member: IMember) {
    const yob = Number(YOBString);
    const { membername, name, YOB } = member;
    const memberObject = { membername, name, YOB };
    if (isNaN(yob)) {
      throw new BadRequestError("Year of birth must be a number!", {
        member: memberObject
      });
    }
    // Check if membername already exists
    const existingMember: IMember = await Member.findOne({
      membername: member.membername
    });

    if (existingMember) {
      throw new BadRequestError("Membername already exists!", {
        member: member
      });
    } else {
      // Create a new member instance
      const newMember = new Member(member);

      // Save the member to the database
      const mem = await newMember.save();

      // Save token
      const token = createAccessToken({ member_id: mem._id });
      return token;
    }
  }
  static async updateProfileHandler(
    memberId: string,
    updateData: Partial<IMember>
  ) {
    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    const { membername, name, YOB } = updatedMember;
    const newMember = { membername, name, YOB };
    if (!updatedMember) {
      throw new BadRequestError("Member not found!", {
        member: newMember
      });
    }

    return updatedMember;
  }
  static async updatePasswordHandler(
    memberId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (oldPassword === newPassword) {
      throw new BadRequestError(
        "Your new password must be different from the old one!"
      );
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestError(
        "The new password and confirmation password do not match!"
      );
    }

    const member = await Member.findById(memberId);
    const { membername, name, YOB } = member;
    const newMember = { membername, name, YOB };
    if (!member) {
      throw new BadRequestError("Member not found!", {
        member: newMember
      });
    }
    const passwordCorrect = await compareHashPassword(
      oldPassword,
      member.password
    );

    if (!passwordCorrect) {
      throw new BadRequestError("Old password is incorrect!", {
        member: newMember
      });
    }
    member.password = newPassword;
    await member.save();

    return member;
  }
}

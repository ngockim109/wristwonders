import { IMember } from "./../interfaces/member.interface";
import Member from "../models/member.model";
import { BadRequestError } from "../errors/badRequestError";

export default class UserService {
  static async getAllUsersHandler() {
    const members = await Member.find().exec();
    return members;
  }

  static async getUserHandler(memberId: string) {
    const user = await Member.findById(memberId).exec();
    return user;
  }
  static async deleteUserHandler(memberId: string) {
    const existingMember = await Member.findById(memberId);
    if (existingMember) {
      const deletedMember = await Member.findByIdAndDelete(memberId);
      return deletedMember;
    } else {
      throw new BadRequestError("Member does not exists!");
    }
  }

  static async createUserHandler(YOBString: string, user: IMember) {
    const yob = Number(YOBString);

    if (isNaN(yob)) {
      throw new BadRequestError("Year of birth must be a number!");
    }
    if (user.password.length < 8) {
      throw new BadRequestError("Password must be at least 8 characters!");
    }
    if (/\s/.test(user.membername)) {
      throw new BadRequestError("Membername must not contain spaces!");
    }
    try {
      // Check if membername already exists
      const existingUser: IMember = await Member.findOne({
        membername: user.membername
      });

      if (existingUser) {
        throw new BadRequestError("Membername already exists!");
      }

      // Create a new user instance
      const newUser = new Member(user);

      // Save the user to the database
      const newUserCreated = await newUser.save();
      return newUserCreated;
    } catch (error) {
      console.log(error);
    }
  }
}

import { IMember } from "./../interfaces/member.interface";
import Member from "../models/member.model";

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
      return { user: deletedMember };
    } else {
      return { error: "Member does not exists!" };
    }
  }

  static async createUserHandler(YOBString: string, user: IMember) {
    const yob = Number(YOBString);

    if (isNaN(yob)) {
      return { error: "Year of birth must be a number!" };
    }
    if (user.password.length < 8) {
      return { error: "Password must be greater than 8 characters!" };
    }
    try {
      // Check if membername already exists
      const existingUser: IMember = await Member.findOne({
        membername: user.membername
      });

      if (existingUser) {
        return { error: "Membername already exists!" };
      }

      // Create a new user instance
      const newUser = new Member(user);

      // Save the user to the database
      const newUserCreated = await newUser.save();
      return { user: newUserCreated };
    } catch (error) {
      console.error(error);
    }
  }
}

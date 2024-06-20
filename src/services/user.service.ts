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

  static async createUserHandler(YOBString: string, user: IMember) {
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
      return await newUser.save();
    } catch (error) {
      console.error(error);
    }
  }
}

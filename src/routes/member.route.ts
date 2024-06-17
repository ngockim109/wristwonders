import express, { Request, Response } from "express";
import memberController from "../controllers/member.controller";

const memberRoute = express.Router();

memberRoute.get("/", memberController.getAllMembers);
memberRoute.get("/profile", memberController.getMember);

export default memberRoute;

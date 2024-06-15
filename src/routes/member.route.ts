import express, { Request, Response } from "express";
import memberController from "../controllers/member.controller";

const memberRoute = express.Router();

memberRoute.get("/", memberController.getAllMembers);

export default memberRoute;

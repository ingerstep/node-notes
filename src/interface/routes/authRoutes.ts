import { Router } from "express";

import { AuthController } from "../controllers/AuthController";
import { LoginUser } from "../../use-cases";
import { AuthService } from "..";
import { KnexPgUserRepository } from "../../infrastructure";

export const authRoutes = Router();

const userRepository = new KnexPgUserRepository();
const loginUser = new LoginUser(userRepository, new AuthService());
const authService = new AuthService();
const authController = new AuthController(loginUser, authService, userRepository);

authRoutes.post("/signup", async (req, res) => await authController.register(req, res));
authRoutes.post("/login", async (req, res) => await authController.login(req, res));

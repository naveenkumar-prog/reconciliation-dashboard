import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { prisma } from "../utils/prisma";
import { generateToken } from "../utils/jwt";


export const signup = async (
  req: Request,
  res: Response
) => {

  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hash
    }
  });

  res.json(user);
};


export const login = async (
  req: Request,
  res: Response
) => {

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const valid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!valid) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const token = generateToken(user.id);

  res.json({
    token
  });
};
import {Router, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";
import {authMiddleware, AuthUser} from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

router.post("/login", async (req: Request, res: Response) => {
  const {username, password} = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: {username, password},
    });
    if (!user || user.password !== password) {
      return res.status(404).send({success: false});
    }
    const token = jwt.sign(
      {id: user?.id, username: user?.username},
      JWT_SECRET,
      {expiresIn: "1h"}
    );
    res.cookie("token", token, {httpOnly: true, secure: false});
    res.json({success: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
});

router.get("/profile", authMiddleware, async (req: AuthUser, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req?.user?.id,
    },
  });
  if (!user) return res.status(404).json({message: "User not found"});
  res.json(user.username);
});

export default router;

import {Router, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/job_titles", async (req: Request, res: Response) => {
  try {
    const job_titles = await prisma.job_title.findMany();
    res.status(200).json(job_titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
});
router.get("/user_types", async (req: Request, res: Response) => {
  try {
    const job_titles = await prisma.user_type.findMany();
    res.status(200).json(job_titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
});
export default router;

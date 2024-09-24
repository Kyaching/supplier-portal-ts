import {Router, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {DepartmentData} from "../types";

const prisma = new PrismaClient();
const router = Router();

router.get("/departments", async (req: Request, res: Response) => {
  try {
    const departments = await prisma.departments.findMany();
    res.status(200).json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
});

router.post(
  "/departments",
  async (req: Request<{}, {}, DepartmentData>, res: Response) => {
    const {id, dept_name} = req.body;
    try {
      const departments = await prisma.departments.create({
        data: {id, dept_name},
      });

      res.status(200).send({success: true});
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({error: "An error occurred while creating the user."});
    }
  }
);

router.delete(
  "/departments/:id",
  async (req: Request<{id: string}>, res: Response) => {
    const id = req.params.id;
    try {
      const department = await prisma.departments.delete({
        where: {
          id: parseInt(id),
        },
      });
      if (department) {
        res.status(200).send({message: "Deleted Data Successfully"});
      } else {
        res.status(404).send({message: "No longer data existed"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "An error occurred while Deleting"});
    }
    console.log(typeof id);
  }
);

router.put(
  "/departments/:id",
  async (req: Request<{id: string}, {}, DepartmentData>, res: Response) => {
    const id = req.params.id;
    const {dept_name} = req.body;
    try {
      const department = await prisma.departments.update({
        where: {id: parseInt(id)},
        data: {id: parseInt(id), dept_name},
      });
      res.status(200).send({message: "Updated Data Successfully"});
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({error: "An error occurred while creating the user."});
    }
  }
);

export default router;

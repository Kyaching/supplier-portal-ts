import {Router, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {DepartmentData, EmployeeData} from "../types";
import {v4 as uuidv4} from "uuid";

const prisma = new PrismaClient();
const router = Router();

router.get("/employees", async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employees.findMany();
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
});

router.post(
  "/employees",
  async (req: Request<{}, {}, EmployeeData>, res: Response) => {
    const {emp_name, first_name, last_name, email, job_title_id, dept_id} =
      req.body;
    try {
      const employee = await prisma.employees.create({
        data: {
          id: uuidv4(),
          emp_name,
          first_name,
          last_name,
          email,
          job_title_id,
          dept_id: parseInt(dept_id),
        },
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
  "/employees/:id",
  async (req: Request<{id: string}>, res: Response) => {
    const id = req.params.id;
    try {
      const employee = await prisma.employees.delete({
        where: {
          id: id,
        },
      });
      if (employee) {
        res.status(200).send({message: "Deleted Data Successfully"});
      } else {
        res.status(404).send({message: "No longer data existed"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "An error occurred while Deleting"});
    }
  }
);

router.put(
  "/employees/:id",
  async (req: Request<{id: string}, {}, EmployeeData>, res: Response) => {
    const id = req.params.id;
    const {emp_name, first_name, last_name, email, job_title_id, dept_id} =
      req.body;
    try {
      const employee = await prisma.employees.update({
        where: {id: id},
        data: {
          emp_name,
          first_name,
          last_name,
          email,
          job_title_id,
          dept_id: parseInt(dept_id),
        },
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

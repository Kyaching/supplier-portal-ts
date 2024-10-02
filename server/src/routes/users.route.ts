import {Router, Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {v4 as uuidv4} from "uuid";
import {CreateUserData, NewUserData, UserData} from "../types";

const prisma = new PrismaClient();
const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        first_name: true,
        email: true,
        username: true,
        last_name: true,
        job_title_id: true,
        user_type_id: true,

        job_title: {
          select: {
            name: true,
          },
        },
        user_type: {
          select: {
            type: true,
          },
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal server error"});
  }
});

router.post(
  "/users",
  async (req: Request<{}, {}, CreateUserData>, res: Response) => {
    const {
      username,
      first_name,
      last_name,
      middle_name,
      email,
      password,
      user_type,
      user_type_id,
      job_title,
      job_title_id,
    } = req.body;
    try {
      if (job_title_id && job_title) {
        await prisma.job_title.upsert({
          where: {id: job_title_id},
          update: {name: job_title},
          create: {id: job_title_id, name: job_title},
        });
      }
      if (user_type && user_type_id) {
        await prisma.user_type.upsert({
          where: {id: user_type_id},
          update: {type: user_type},
          create: {id: user_type_id, type: user_type_id},
        });
      }
      const user = await prisma.users.create({
        data: {
          id: uuidv4(),
          username,
          first_name,
          last_name,
          middle_name,
          email,
          password,
          user_type_id,
          job_title_id,
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

router.delete("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await prisma.users.delete({
      where: {
        id: id,
      },
    });
    if (user) {
      res.status(200).send({message: "Deleted Data Successfully"});
    } else {
      res.status(404).send({message: "No longer data existed"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occurred while Deleting"});
  }
});

router.put("/users", async (req: Request<{}, NewUserData[]>, res: Response) => {
  const users = req.body;
  try {
    if (Array.isArray(users)) {
      const updatePromise = users.map(async user => {
        const {
          id,
          username,
          first_name,
          last_name,
          email,
          user_type_id,
          job_title_id,
        } = user;

        return await prisma.users.update({
          where: {
            id: id,
          },
          data: {
            first_name,
            last_name,
            username,
            email,
            user_type_id: user_type_id,
            job_title_id: job_title_id,
          },
        });
      });
      const updatedUsers = await Promise.all(updatePromise);
      res.status(200).send({message: "Updated Data Successfully"});
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({error: "An error occurred while Updating the users."});
  }
});
router.put(
  "/users/:id",
  async (req: Request<{id: string}, {}, UserData>, res: Response) => {
    const user_id = req.params.id;
    const {first_name, last_name, job_title, job_title_id} = req.body;
    try {
      if (job_title) {
        await prisma.job_title.update({
          where: {id: job_title_id},
          data: {name: job_title},
        });
      }
      const user = await prisma.users.update({
        where: {id: user_id},
        data: {first_name, last_name},
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

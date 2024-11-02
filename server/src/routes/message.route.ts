import {PrismaClient} from "@prisma/client";
import {Router} from "express";

const prisma = new PrismaClient();
const router = Router();

router.get("/messages/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const message = await prisma.messages.findMany({
      where: {
        OR: [{id}, {parentId: id}],
      },
      orderBy: {
        date: "desc",
      },
    });
    if (message) {
      res.json(message);
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Something Went Wrong");
  }
});

router.get("/messages/inbox/:user", async (req, res) => {
  try {
    const messages = await prisma.messages.findMany({
      where: {
        status: {
          not: "draft",
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    if (messages) {
      res.json(messages);
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Something Went Wrong");
  }
});

router.get("/messages/draft/:user", async (req, res) => {
  const {user} = req.params;
  try {
    const messages = await prisma.messages.findMany({
      where: {
        sender: user,
        status: "draft",
      },
      orderBy: {
        date: "desc",
      },
    });
    if (messages) {
      res.json(messages);
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Something Went Wrong");
  }
});

router.get("/messages/sent/:user", async (req, res) => {
  const {user} = req.params;
  try {
    const messages = await prisma.messages.findMany({
      where: {
        sender: user,
        status: "sent",
      },
      orderBy: {
        date: "desc",
      },
    });
    if (messages) {
      res.json(messages);
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).send("Something Went Wrong");
  }
});

router.post("/messages", async (req, res) => {
  const {id, sender, receivers, subject, body, status, date} = req.body;

  try {
    const messages = await prisma.messages.create({
      data: {
        id,
        sender,
        receivers,
        subject,
        body,
        status,
        date,
        read: receivers,
      },
    });

    res.status(200).send({success: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occurred while creating the user."});
  }
});

router.post("/messages/:id", async (req, res) => {
  const {
    id,
    parentId,
    sender,
    receivers,
    subject,
    body,
    status,
    date,
    involvedUsers,
  } = req.body;

  try {
    const messages = await prisma.messages.create({
      data: {
        id,
        parentId,
        subject,
        body,
        date,
        sender,
        receivers,
        status,
        involvedUsers,
      },
    });

    res.status(200).send({success: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "An error occurred while creating the user."});
  }
});

router.put("/messages/:id", async (req, res) => {
  const {id} = req.params;
  const {name} = req.body;
  try {
    await prisma.messages.update({
      where: {
        id,
      },
      data: {
        read: name,
      },
    });
    res.status(200).send({message: "Updated Data Successfully"});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({error: "An error occurred while Updating the users."});
  }
  console.log(name, id);
});

router.delete("/messages/:id", async (req, res) => {
  try {
    const {id} = req.params;

    // Attempt to delete the message with the given ID
    const deleteMessage = await prisma.messages.delete({
      where: {id: id},
    });

    if (deleteMessage) {
      res.status(200).send({message: "Deleted Data Successfully"});
    } else {
      res.status(404).send({message: "No longer data existed"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "An error occurred while Deleting"});
  }
});

export default router;

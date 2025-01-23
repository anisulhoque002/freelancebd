import { Prisma, PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { renameSync } from "fs";

const generatePassword = async (password) => {
  const salt = await genSalt();
  return await hash(password, salt);
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (email, userId) => {
  // @ts-ignore
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { email, password } = req.body;
    if (email && password) {
      const user = await prisma.user.create({
        data: {
          email,
          password: await generatePassword(password),
        },
      });
      return res.status(201).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).send("Email Already Registered");
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
    throw err;
  }
};

export const login = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const { email, password } = req.body;
    if (email && password) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(400).send("Invalid Password");
      }

      return res.status(200).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      });
      return res.status(200).json({
        user: {
          id: user?.id,
          email: user?.email,
          image: user?.profileImage,
          username: user?.username,
          fullName: user?.fullName,
          description: user?.description,
          portfolioLink: user?.portfolioLink,
          isProfileSet: user?.isProfileInfoSet,
        },
      });
    }
  } catch (err) {
    res.status(500).send("Internal Server Occured");
  }
};

export const setUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const { userName, fullName, description, portfolioLink } = req.body;
      if (userName && fullName && description) {
        const prisma = new PrismaClient();
        const userNameValid = await prisma.user.findUnique({
          where: { username: userName },
          select: { id: true },
        });
        if (userNameValid && userNameValid.id !== req.userId) {
          return res.status(200).json({ userNameError: true });
        }
        const updateData = {
          username: userName,
          fullName,
          description,
          isProfileInfoSet: true,
        };
        if (portfolioLink !== undefined) {
          updateData.portfolioLink = portfolioLink;
        }
        await prisma.user.update({
          where: { id: req.userId },
          data: updateData,
        });
        return res.status(200).send("Profile data updated successfully.");
      } else {
        return res
          .status(400)
          .send("Username, Full Name and description should be included.");
      }
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).json({ userNameError: true });
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
    throw err;
  }
};

export const setUserImage = async (req, res, next) => {
  try {
    if (req.file) {
      if (req?.userId) {
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);
        const prisma = new PrismaClient();

        await prisma.user.update({
          where: { id: req.userId },
          data: { profileImage: fileName },
        });
        return res.status(200).json({ img: fileName });
      }
      return res.status(400).send("Cookie Error.");
    }
    return res.status(400).send("Image not inclued.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Occured");
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.status(200).json({
        id: user.id,
        email: user.email,
        imageName: user.profileImage ? `${process.env.HOST}/${user.profileImage}` : null,
        username: user.username,
        fullName: user.fullName,
        description: user.description,
        portfolioLink: user.portfolioLink,
      });
    }
    return res.status(400).send("User ID is required");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

import Contact from "../models/Contactmodel.js";

export const UserContact = async (req, res, next) => {
  try {
    const { name, email, phoneno, message } = req.body;

    if (!name || !email || !phoneno || !message) {
      const error = new Error("All Fields Required");
      error.statuscode = 400;
      return next(error);
    }

    const NewUser = await Contact.create({
      name,
      email,
      phoneno,
      message,
    });

    console.log(NewUser);
    res.status(201).json({ message: "Thanks for Contacting us...!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

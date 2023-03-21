const Newsletter = require("../models/newsletter");
const User = require("../models/user");
const nodemailer = require("nodemailer");


module.exports = {
  // Creating a newsletter
  async createNewsletter(req, res) {
    const body = {
      creator: req.user._id,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      status: req.body.status,
    };
    try {
      const newsletter = await Newsletter.create(body);
      const user = await User.findById(req.user._id);
      await User.updateOne(
        {
          _id: req.user._id,
        },
        {
          $push: {
            newsletters: {
              nsId: newsletter._id,
              ns: req.body.title,
            },
          },
        }
      );
      res.status(200).json({ message: "Newsletter created successfully" });
    } catch (err) {
      res.json({ message: err + " ooops!! We have an error" });
    }
  },

  //get all newsletters
  async getAllNewsletters(req, res) {
    try {
      const newsletters = await Newsletter.find({})
        .populate("creator")
        .sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ message: "Newsletters are here", newsletters });
    } catch (err) {
      return res.status(400).json({ message: "Error occurred" });
    }
  },

  //get newsletters by creator
  async getNewslettersByUser(req, res) {
    try {
      const newsletters = await Newsletter.find({ creator: req.params.userid })
        .populate("creator")
        .sort({ createdAt: -1 });
      console.log(newsletters);
      return res
        .status(200)
        .json({ message: "Newsletters are here", newsletters });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Error occurred" });
    }
  },

  //GET A SPESEFIC NEWSLETTER
  async GetNewsletter(req, res) {
    try {
      const newsletter = await Newsletter.findOne({ _id: req.params.id })
        .populate("creator")
        .exec();
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      res.status(200).json({ message: "Newsletter found", newsletter });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //DELETE
  async deleteNewsletter(req, res) {
    try {
      await Newsletter.deleteMany({ _id: req.params.id }).exec();
      await User.updateMany(
        { _id: req.body.creator },
        {
          $pull: {
            newsletters: {
              nsId: req.params.id,
            },
          },
        }
      ).exec();
      res.status(200).json({ message: "Newsletter deleted successfully" });
    } catch (err) {
      res.status(200).json({ message: "Failed to delete the newsletter" });
    }
  },

  async deleteNewsletter2(req, res) {
    try {
      const newsletter = await Newsletter.findById(req.params.id);
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      if (newsletter.creator.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({
            message: "You are not authorized to delete this newsletter",
          });
      }
      await Newsletter.deleteMany({ _id: req.params.id }).exec();
      await User.updateMany(
        { _id: newsletter.creator },
        {
          $pull: {
            newsletters: {
              nsId: req.params.id,
            },
          },
        }
      ).exec();
      res.status(200).json({ message: "Newsletter deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete the newsletter" });
    }
  },
  //send newsletter
  /* async function sendNewsletterToClient(req, res) {
  const { newsletterId, clientId } = req.params;

  try {
    // Get the newsletter
    const newsletter = await Newsletter.findById(newsletterId);
    if (!newsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }

    // Get the client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Create the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com", // Replace with your own email
        pass: "your-email-password", // Replace with your own password
      },
    });

    // Create the email message
    const mailOptions = {
      from: "your-email@gmail.com", // Replace with your own email
      to: client.client_Mail,
      subject: newsletter.title,
      html: `<p>${newsletter.content}</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Newsletter sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send newsletter" });
  }
} */

};

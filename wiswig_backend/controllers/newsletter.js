const Newsletter = require("../models/newsletter");
const User = require("../models/user");
const Company = require("../models/clientGroup");
const Client = require("../models/client");


const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = {
  async createNewsletter(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "You must be logged in to create a newsletter" });
    }

    try {
      const decoded = jwt.verify(token, "Hakona_Matata");
      const userId = decoded.data;

      const body = {
        creator: userId,
        title: req.body.title,
        description: req.body.description,
        HTMLcontent: req.body.HTMLcontent,
        JSONcontent: req.body.JSONcontent,
        status: req.body.status,
      };

      const cov = Math.floor(Math.random() * 24) + 1;
      body.cover = `cover_${cov}`;

      const newsletter = await Newsletter.create(body);

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            newsletters: {
              newsletterId: newsletter._id,
              newsletter: req.body.title,
            },
          },
        }
      );

      res
        .status(200)
        .json({
          message: "Newsletter created successfully",
          newsletter: newsletter,
        });
    } catch (err) {
      res.status(400).json({ message: "Error", error: err.message });
    }
  },

  async editNewsletter(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "You must be logged in to edit a newsletter" });
    }
    try {
      const decoded = jwt.verify(token, "Hakona_Matata");
      const userId = decoded.data;
      const newsletter = await Newsletter.findById(req.params.id);
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      if (newsletter.creator._id.toString() !== userId.toString()) {
        return res.status(401).json({
          message: "You are not authorized to edit this newsletter",
        });
      }
      const body = {
        title: req.body.title,
        description: req.body.description,
        HTMLcontent: req.body.HTMLcontent,
        JSONcontent: req.body.JSONcontent,
        status: req.body.status,
      };
      const updatedNewsletter = await Newsletter.findByIdAndUpdate(
        req.params.id,
        body
      );
      if (req.user) {
        const user = await User.findById(req.user._id);
        await User.updateOne(
          {
            _id: req.user._id,
          },
          {
            $push: {
              newsletters: {
                nsId: updatedNewsletter._id,
                ns: req.body.title,
              },
            },
          }
        );
      }
      res.status(200).json({ message: "Newsletter edited successfully" });
    } catch (err) {
      res.json({ message: err + " ooops!! We have an error" });
    }
  },

  //get all newsletters
  async getAllNewsletters(req, res) {
    try {
      const newsletters = await Newsletter.find({}).populate("creator");
      return res
        .status(200)
        .json({ message: "Newsletters are here", newsletters });
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Error occurred", error: err.message });
    }
  },

  async getNewsletterById(req, res) {
    try {
      const { id } = req.params;

      const newsletter = await Newsletter.findById(id).populate("creator");

      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }

      return res
        .status(200)
        .json({ message: "Newsletter is here", newsletter });
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

  async deleteNewsletter(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "You must be logged in to create a newsletter" });
    }
    try {
      const decoded = jwt.verify(token, "Hakona_Matata");
      const userId = decoded.data;
      const newsletter = await Newsletter.findById(req.params.id);
      if (!newsletter) {
        return res.status(404).json({ message: "Newsletter not found" });
      }
      if (newsletter.creator._id.toString() !== userId.toString()) {
        return res.status(401).json({
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

  async duplicateNewsletter(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "You must be logged in to duplicate a newsletter" });
    }
    try {
      const decoded = jwt.verify(token, "Hakona_Matata");
      const newCreatorId = decoded.data;
      const newsletterToDuplicate = await Newsletter.findById(req.params.id);
      if (!newsletterToDuplicate) {
        return res.status(404).json({ message: "Newsletter not found" });
      }

      const cov = Math.floor(Math.random() * 24) + 1;
      const duplicatedNewsletter = new Newsletter({
        title: req.body.title,
        description: req.body.description,
        HTMLcontent: newsletterToDuplicate.HTMLcontent,
        JSONcontent: newsletterToDuplicate.JSONcontent,
        status: newsletterToDuplicate.status,
        creator: newCreatorId,
        cover: `cover_${cov}`,
      });

      // Save the duplicated newsletter to the database
      const savedNewsletter = await duplicatedNewsletter.save();

      // Add the duplicated newsletter to the new creator's list of newsletters
      await User.updateOne(
        { _id: newCreatorId },
        {
          $push: {
            newsletters: {
              nsId: savedNewsletter._id,
              ns: savedNewsletter.title,
            },
          },
        }
      );

      res
        .status(200)
        .json({
          message: "Newsletter duplicated successfully",
          savedNewsletter,
        });
    } catch (err) {
      res.status(500).json({ message: "Failed to duplicate the newsletter" });
      console.log(err);
    }
  },

  async sendNewsletter(req, res) {
    const { newsletterId, companyIds } = req.body;

    try {
      // Get the newsletter by ID
      const newsletter = await Newsletter.findById(newsletterId);

      // Convert the companyIds to an array if it's not already
      const companyIdArray = Array.isArray(companyIds) ? companyIds : [companyIds];

      // Get the companies by IDs
      const companies = await Company.find({ _id: { $in: companyIdArray } });

      // Create the email transporter
      const transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Get all clients
      const clients = await Client.find();

      // Loop through the clients and send emails if client.comp matches a company
      for (const client of clients) {
        if (companies.some((company) => company._id.toString() === client.clientGroup._id.toString())) {
          // Create the email message
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: client.client_Mail,
            subject: newsletter.title,
            html: newsletter.HTMLcontent,
          };

          try {
            // Send the email
            await transporter.sendMail(mailOptions);
            console.log("Email sent from:", mailOptions.from);
            console.log("Email sent to:", client.client_Mail);
          } catch (error) {
            console.error("Error sending email:", error);
            // Handle the specific email sending error
            // For example, you can skip this client and continue with others, or take appropriate action based on the error
          }
        }
      }

      res.status(200).json({ message: "Newsletter sent successfully" });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      res.status(500).json({ error: "Error sending newsletter" });
    }
  }


  //send newsletter
  /* async  sendNewsletterToClient(req, res) {
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

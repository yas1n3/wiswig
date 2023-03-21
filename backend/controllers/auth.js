const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../api/mailer");

module.exports = {
  async register(req, res) {
    try {
      const emailExist = await User.findOne({ user_Mail: req.body.mail });
      if (emailExist) return res.status(400).send("Email already exists");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const secretToken = randomstring.generate();
      const user = new User({
        user_First_Name: req.body.firstName,
        user_Last_Name: req.body.lastName,
        user_Mail: req.body.mail,
        user_Password: hashedPassword,
        active: false,
        role: "notadmin",
        token: null,
        newsletters: [],
      });

      await user.save();

      // Send email with secret token
      const mailOptions = {
        from: "wiswig@mobelite.fr",
        to: user.user_Mail,
        subject: "Account Activation Link",
        text:
          "Hello " +
          user.user_First_Name +
          ",\n\n" +
          "Please click on the following link to activate your account:\n\n" +
          "http://" +
          req.headers.host +
          "/api/activate/" +
          secretToken +
          "\n\n" +
          "Thank you for registering with us.\n",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res
        .status(200)
        .send(
          "User registered successfully! Please check your email to activate your account."
        );
    } catch (err) {
      res.status(500).send("Server Error: " + err);
    }
  },

  async loginUser(req, res) {
    if (!req.body.mail || !req.body.password) {
      console.log(req.body);
      return res.status(400).json({ message: "No empty fields allowed 🛑" });
    }
    await User.findOne({ mail: req.body.mail })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ message: "E-mail is wrong 🛑" });
        }
        return bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
            if (!result) {
              return res.status(400).json({ message: "Password is wrong 🛑" });
            }
            if (!user.active) {
              return res
                .status(400)
                .json({ message: "Account is not active yet" });
            }
            const token = jwt.sign({ data: user }, "Hakona_Matata", {
              expiresIn: "72h",
            });
            return res
              .status(200)
              .json({ message: "login successful", user, token });
          });
      })
      .catch((err) => {
        return res.status(400).json({ message: err });
      });
  },
  async newPasword(req, res) {
    console.log(req.body);
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(req.body.password, salt);
      await User.updateOne(
        { secretToken: req.body.secretcode },
        {
          $set: {
            password: token,
          },
        }
      );
      res.status(200).json({ message: "Passowrd updated successfully" });
    } catch (err) {
      res.status(400).json({ message: "error ouccured", err });
    }
  },

  async updatePassword(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(req.body.password, salt);
      await User.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            password: token,
          },
        }
      );
      res.status(200).json({ message: "Passowrd updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "error ouccured", error });
    }
  },

  async verify(req, res) {
    try {
      const { secretToken } = req.body;
      const user = await User.findOne({ secretToken });
      console.log(secretToken);
      if (!user) return res.status(400).send("Wrong secret code");
      if (user.active) return res.status(400).send("User already active");
      user.active = true;
      await user.save();
      console.log(user);
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send("Error occurred");
    }
  },

  async forgotPassword(req, res) {
    try {
      const user = await User.findOne({ mail: req.body.mail });
      if (!user) {
        res.status(400).send("Email does not exist");
      } else {
        const html = `<h1>Hello ${user.userName}</h1><hr><br/>
                      <h3>Click on the link to reset your password:</h3> 
                      <a href="http://localhost:3000/auth/forgot/${user.secretToken}">http://localhost:3000/auth/forgot/${user.secretToken}</a>
                      <hr>`;
        await mailer.sendEmail(
          "verify@poutcha.com",
          user.mail,
          "Please verify your account",
          html
        );
        res.json(user);
      }
    } catch (err) {
      res.status(400).send("Error occurred");
    }
  },
};

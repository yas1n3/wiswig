const express = require("express");
const router = express.Router();
const NewsletterCtrl = require("../controllers/newsletter");


router.get("/newsletter/:id", NewsletterCtrl.getNewsletterById);
router.get("/newsletters", NewsletterCtrl.getAllNewsletters);
router.get("/usernewsletters/:userid", NewsletterCtrl.getNewslettersByUser);
router.post("/add_newsletter", NewsletterCtrl.createNewsletter);
router.delete("/delete/:id", NewsletterCtrl.deleteNewsletter);
router.post("/duplicate/:id", NewsletterCtrl.duplicateNewsletter);
router.put("/editnewsletter/:id", NewsletterCtrl.editNewsletter);
router.post('/send', NewsletterCtrl.sendNewsletter);
module.exports = router;

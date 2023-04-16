const express = require("express");
const router = express.Router();
const Newsletter = require("../models/newsletter");
const verify = require("../middleware/verifytoken");
const NewsletterCtrl = require("../controllers/newsletter");
const multer = require("../middleware/multerArray");

/* router.get('/newsletters', verify.verifyToken, NewsletterCtrl.getAllNewsletters);
router.get('/newsletter/:id', verify.verifyToken, NewsletterCtrl.getNewsletter);
router.get('/usernewsletters/:userid', verify.verifyToken, NewsletterCtrl.getNewslettersByUser);
router.post('/add-newsletter', verify.verifyToken, multer, NewsletterCtrl.createNewsletter);
router.post('/delete/:id', verify.verifyToken, NewsletterCtrl.deleteNewsletter); */

router.get("/newsletter/:id", NewsletterCtrl.getNewsletterById);
router.get("/newsletters", NewsletterCtrl.getAllNewsletters);
router.get("/usernewsletters/:userid", NewsletterCtrl.getNewslettersByUser);
router.post("/add_newsletter", NewsletterCtrl.createNewsletter);
router.post("/delete/:id", NewsletterCtrl.deleteNewsletter);
router.post("/duplicate/:id", NewsletterCtrl.duplicateNewsletter);
router.put("/editnewsletter/:id", NewsletterCtrl.editNewsletter);
module.exports = router;

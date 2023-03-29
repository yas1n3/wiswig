const multer = require("multer");

const MIME_TYPE_MAP = {
  "text/html": "html",
  "text/css": "css",
  "application/javascript": "js",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "public");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    const name =
      file.originalname.toLowerCase().split(" ").join("-") + "." + ext;

    cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + name);
  },
});

const upload = multer({ storage: storage });

module.exports = upload.single("file");

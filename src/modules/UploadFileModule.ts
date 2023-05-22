import { hashSync, genSaltSync } from 'bcrypt';
import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {
    const extensionFile = file.originalname.slice(
      file.originalname.lastIndexOf('.')
    );

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(file.originalname, salt);

    cb(null, hashedPassword.substring(0, 29) + extensionFile);
  },
});

const uploads = multer({ storage: storage });

export default uploads;

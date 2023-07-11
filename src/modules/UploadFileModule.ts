import { hashSync, genSaltSync } from 'bcrypt';
import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {

    cb(null, Date.now()+file.originalname);
  },
});

const uploads = multer({ storage: storage });

export default uploads;

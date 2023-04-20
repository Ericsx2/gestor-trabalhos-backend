import { hashSync, genSaltSync } from 'bcrypt';
import multer, { diskStorage } from 'multer';


const storage = diskStorage({
  destination: function(req, file, cb) {
    const salt = genSaltSync(10);
    const hashedName = hashSync(file.originalname, salt);
    cb(null, "src/uploads/");
  },
  filename: function(req, file, cb) {
    
    cb(null, file.originalname);
  }
});


const uploads = multer({ storage: storage });

export default uploads;
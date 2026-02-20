import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination: "uploads/categories", 
    filename: (req, file, cb) =>{
        const uniqueName = Date.now() + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})

export const upload = multer({storage})

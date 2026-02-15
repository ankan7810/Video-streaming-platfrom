import multer from 'multer';

const storage=multer.diskStorage({
   destination:(req,file,cb)=>{
    cb(null,"./Uploads")
   },
   filename:(req,file,cb)=>{
    cb(null,file.originalname)
   },
   limits:{
      fileSize:1024*1024*100
   }
})

export const upload = multer({ storage: storage })
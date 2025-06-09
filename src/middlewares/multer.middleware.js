import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
    },
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Images
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/svg+xml",
        "image/tiff",
        "image/x-icon",

        // Videos
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
        "video/3gpp",
        "video/ogg",
        "video/webm"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed"), false);
    }
};


export const upload = multer({ storage, fileFilter });



// File filter (optional)
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only images are allowed"), false);
//     }
// };

// File filter (for both images and videos)
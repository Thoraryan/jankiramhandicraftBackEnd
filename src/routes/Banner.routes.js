import { Router } from "express";
import { BannerAdd,getAllBanners,getSingleBanner,updateBanner,deleteBanner ,StatusUpdateBanner} from "../Controllers/Banner.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; 

const router = Router();

router.post("/banner-add",upload.single("image"), BannerAdd);
router.get("/banners", getAllBanners);
router.get("/banners/:id", getSingleBanner);
router.put("/banner-edit/:id", updateBanner);
router.delete('/banner-delete/:id', deleteBanner);
router.patch('/banner-status/:id', StatusUpdateBanner);

export default router;

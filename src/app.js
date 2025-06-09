import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AdminRouter from "./routes/Auth.routes.js"
import BannerRouter from "./routes/Banner.routes.js";
import CategoryRouter from "./routes/Category.routes.js"
import ProductRouter from "./routes/Product.routes.js"
import OurWebsiteRouter from "./routes/OurWebsite.routes.js"
import ContentRouter from "./routes/Content.routes.js"
import CollectionRouter from "./routes/Collections.routes.js"
import ProductRequestRouter from "./routes/ProductRequestQuery.routes.js"
import customRequirement from "./routes/CustomRequirements.routes.js"
import ContactUs from "./routes/ContactUs.routes.js"
import Visitor from "./routes/Visitor.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "2mb" }))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users", AdminRouter);
app.use("/api/v1", BannerRouter);
app.use("/api/v1", CategoryRouter);
app.use("/api/v1/", ProductRouter);
app.use("/api/v1/", OurWebsiteRouter);
app.use("/api/v1/", ContentRouter);
app.use("/api/v1/", CollectionRouter);
app.use("/api/v1/", ProductRequestRouter)
app.use("/api/v1/", customRequirement)
app.use("/api/v1/", ContactUs)
app.use("/api/v1/", Visitor)

export { app }

import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  userName: String,
  UserEmail: { type: String }, 
  ip: { type: String, unique: true, sparse: true },        
  city: String,
  region: String,
  country: String,
  isp: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
});


export const Visitor = mongoose.model("Visitor", visitorSchema);

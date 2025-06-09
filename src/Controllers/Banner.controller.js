import { Banner } from "../Modals/Banner.modal.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";

// Add Banner Controller
export const BannerAdd = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Image is required!" });

    const imagePath = `/uploads/${req.file.filename}`; // Save relative path for frontend

    const newBanner = new Banner({
      name,
      description,
      status,
      image: imagePath, // Store only the accessible path
    });

    await newBanner.save();
    res
      .status(201)
      .json({ message: "Banner added successfully", data: newBanner });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// All Banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find(); // Fetch only active banners

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Single Banner
export const getSingleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error("Error fetching single banner:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Banner
export const updateBanner = async (req, res) => {
  try {
    const { name, status, description, image } = req.body;

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { name, status, description, image }, // update fields
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Banner.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const StatusUpdateBanner = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner status updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Error updating banner status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

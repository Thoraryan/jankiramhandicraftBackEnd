import { Product } from "../Modals/Product.modal.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";

export const addProduct = async (req, res) => {
    try {
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        console.log(req.body)

        const product = new Product({
            productName: req.body.productName,
            category: req.body.category,
            subCategory: req.body.subCategory,
            materialDetails: req.body.materialDetails,
            dimensionsAndWeight: req.body.dimensionsAndWeight,
            pricePerUnit: req.body.pricePerUnit,
            bulkPricing: req.body.bulkPricing,
            minimumOrderQuantity: req.body.minimumOrderQuantity,
            customizationOptions: req.body.customizationOptions,
            shippingDetails: req.body.shippingDetails,
            certifications: req.body.certifications,
            status: req.body.status,
            description: req.body.description,
            images: imagePaths,
        });

        await product.save();
        res.status(200).json({ success: true, message: "Product added successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add product" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category subCategory'); // Optional: populate if you're using refs
        res.status(200).json({
            success: true,
            message: "All products fetched successfully",
            data: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate('category subCategory');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
};

// update Product
export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Handle image uploads
        const uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
        const existingImages = req.body.existingImages || [];

        // If req.body.existingImages is a string, convert it to array
        const finalImageList = Array.isArray(existingImages)
            ? [...existingImages, ...uploadedImages]
            : [existingImages, ...uploadedImages];

        // Update fields
        product.productName = req.body.productName;
        product.category = req.body.category;
        product.subCategory = req.body.subCategory;
        product.materialDetails = req.body.materialDetails;
        product.dimensionsAndWeight = req.body.dimensionsAndWeight;
        product.pricePerUnit = req.body.pricePerUnit;
        product.bulkPricing = req.body.bulkPricing;
        product.minimumOrderQuantity = req.body.minimumOrderQuantity;
        product.customizationOptions = req.body.customizationOptions;
        product.shippingDetails = req.body.shippingDetails;
        product.certifications = req.body.certifications;
        product.status = req.body.status;
        product.description = req.body.description;
        product.images = finalImageList;

        await product.save();
        res.status(200).json({ success: true, message: "Product updated successfully!" });

    } catch (error) {
        console.error("Edit Product Error:", error);
        res.status(500).json({ success: false, message: "Failed to update product" });
    }
};

// delete Product
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting Product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const StatusUpdate = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "not found" });
    }

    res.status(200).json({
      success: true,
      message: " status updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
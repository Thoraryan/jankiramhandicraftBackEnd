import { ProductRequestQuery } from '../Modals/ProductRequestQuery.modal.js'

export const addProductRequestQuery = async (req, res) => {
    try {
        const { name, email, mobile_no, productId, quantity, description } = req.body;

        // console.log("AddProductRequestQuery", req.body);

        if (!name || !email || !mobile_no || !productId || !quantity) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be a positive number." });
        }

        // Check if a request for this product exists with either same email OR same mobile_no
        const existingRequest = await ProductRequestQuery.findOne({
            productId: productId,
            $or: [
                { email: email.toLowerCase() },
                { mobile_no: mobile_no }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You have already submitted a request for this product with the same email or mobile number." });
        }

        const newRequest = new ProductRequestQuery({
            name,
            email: email.toLowerCase(),
            mobile_no,
            productId,
            quantity,
            description,
        });

        const savedRequest = await newRequest.save();
        return res.status(201).json({ message: "Product request submitted successfully", data: savedRequest });

    } catch (error) {
        console.error("Add Product Request Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// GET /product-requests?productId=someId
export const getProductRequests = async (req, res) => {
    try {
        // Optional filtering can be added later if needed
        const requests = await ProductRequestQuery.find();

        return res.status(200).json({
            message: "Product requests fetched successfully",
            data: requests,
        });

    } catch (error) {
        console.error("Get Product Requests Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Delete product request by ID
export const deleteProductRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete product request by ID
        const deletedRequest = await ProductRequestQuery.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ success: false, message: "Product request not found" });
        }

        res.status(200).json({ success: true, message: "Product request deleted successfully" });
    } catch (error) {
        console.error("Delete Product Request Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete product request" });
    }
};
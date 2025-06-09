import { CustomRequirement } from '../Modals/CustomRequirements.modal.js'

// Add new custom requirement
export const addCustomRequirement = async (req, res) => {
    try {
        const { userName, mobile_no, email, quantity, description } = req.body;

        // Then pass `username: userName` to your model
        const image = req.file ? `/uploads/requirements/${req.file.filename}` : null;

        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required." });
        }

        const newRequirement = new CustomRequirement({
            userName: userName,
            quantity,
            image,
            email,
            mobile_no,
            description,
        });

        await newRequirement.save();
        res.status(201).json({ success: true, data: newRequirement });

        console.log("000000000000000000", newRequirement)
    } catch (error) {
        console.error("Custom Requirement Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all custom requirements
export const getCustomRequirements = async (req, res) => {
    try {
        const requirements = await CustomRequirement.find();
        res.status(200).json({ success: true, data: requirements });
    } catch (error) {
        console.error("Get Custom Requirements Error:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve requirements" });
    }
};


// Delete custom requirement by ID
export const deleteCustomRequirement = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the custom requirement by ID and delete
        const deletedRequirement = await CustomRequirement.findByIdAndDelete(id);

        if (!deletedRequirement) {
            return res.status(404).json({ success: false, message: "Custom requirement not found" });
        }

        res.status(200).json({ success: true, message: "Custom requirement deleted successfully" });
    } catch (error) {
        console.error("Delete Custom Requirement Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete custom requirement" });
    }
};
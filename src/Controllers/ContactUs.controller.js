import { ContactUs } from "../Modals/ContactUs.modal.js";

export const addContactUs = async (req, res) => {
    try {
        const { name, email, mobile_no, description } = req.body;

        // Validation
        const errors = {};
        if (!name || name.trim() === "") errors.name = "Name is required.";
        if (!email || email.trim() === "") errors.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format.";
        if (!mobile_no || mobile_no.trim() === "") errors.mobile_no = "Mobile number is required.";
        else if (!/^\d{7,15}$/.test(mobile_no)) errors.mobile_no = "Mobile number must be 7–15 digits.";
        if (!description || description.trim() === "") errors.description = "Description is required.";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // Save to DB
        const contact = new ContactUs({ name, email, mobile_no, description });
        await contact.save();

        res.status(201).json({ success: true, message: "Contact submission successful.", data: contact });
    } catch (error) {
        console.error("Add ContactUs Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};



export const getContactUsMessages = async (req, res) => {
    try {
        const messages = await ContactUs.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json({
            success: true,
            data: messages,
            message: "Contact messages fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error while fetching contact messages",
        });
    }
};

export const deleteContactUsMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if document exists
    const message = await ContactUs.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    // Delete the document
    await ContactUs.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error while deleting contact message",
    });
  }
};
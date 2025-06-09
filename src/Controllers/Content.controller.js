import ContentManagement from "../Modals/Content.modal.js";

// Create
export const createContent = async (req, res) => {
    try {
        const content = await ContentManagement.create(req.body);
        res.status(201).json(content);
    } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update
export const updateContent = async (req, res) => {
    try {
        const updated = await ContentManagement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Content not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get single content by ID
export const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await ContentManagement.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get by key
export const getContentByKey = async (req, res) => {
    try {
        const content = await ContentManagement.findOne({ key: req.params.key });
        if (!content) return res.status(404).json({ message: "Content not found" });
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all
export const getAllContents = async (req, res) => {
    try {
        const contents = await ContentManagement.find();
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete
export const deleteContent = async (req, res) => {
    try {
        const deleted = await ContentManagement.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Content not found" });
        res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
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

    const updated = await ContentManagement.findByIdAndUpdate(
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
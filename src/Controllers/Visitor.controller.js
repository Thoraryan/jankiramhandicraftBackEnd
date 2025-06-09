import { Visitor } from "../Modals/Visitor.modal.js";

// Add Visitor
export const addVisitor = async (req, res) => {
  try {
    const { UserEmail, ip } = req.body;

    // Define the query to find existing visitor
    const query = UserEmail ? { UserEmail } : { ip };

    // Update if exists, else insert
    const updatedVisitor = await Visitor.findOneAndUpdate(
      query,
      req.body,
      { new: true, upsert: true } // upsert = insert if not found
    );

    res
      .status(201)
      .json({ message: "Visitor logged/updated", data: updatedVisitor });
  } catch (error) {
    console.error("Visitor save error:", error);
    res.status(500).json({ message: "Failed to track visitor" });
  }
};

// Get All Visitors
export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch visitors" });
  }
};

// DELETE Visitor by ID
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Visitor.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json({ message: "Visitor deleted successfully" });
  } catch (error) {
    console.error("Error deleting visitor:", error);
    res.status(500).json({ message: "Failed to delete visitor" });
  }
};

import { Collection } from '../Modals/Collections.modal.js';

export const createCollection = async (req, res) => {
    try {
        // console.log("REQ BODY:", req.body);
        // console.log("REQ FILE:", req.file);

        const { name } = req.body;
        let imagePath = '';

        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const newCollection = new Collection({
            name,
            image: imagePath,
        });

        await newCollection.save();

        return res.status(201).json({
            success: true,
            message: 'Collection created successfully',
            data: newCollection,
        });
    } catch (error) {
        console.error('Error adding Collection:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add Collection',
        });
    }
};

// Get All Collection
export const getAllCollections = async (req, res) => {
    try {
        const Collections = await Collection.find();
        res.status(200).json({
            success: true,
            count: Collections.length,
            data: Collections
        });
    } catch (error) {
        console.error("Error fetching Collections:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

//  Delete Collection
export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Collection.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Collection not found' });
        }

        res.status(200).json({ success: true, message: 'Collection deleted successfully' });
    } catch (error) {
        console.error('Error deleting Collection:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get Single Collection
export const getSingleCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }
        // Send the collection wrapped in a 'data' object
        res.status(200).json({ success: true, data: collection });
    } catch (error) {
        console.error("Error fetching single collection:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Collection Controller
export const updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        let image = collection.image;

        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const updatedFields = {
            name: req.body.name || collection.name,
            image,
        };

        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Collection updated successfully",
            data: updatedCollection,
        });
    } catch (error) {
        console.error("Error updating collection:", error);
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

    const updated = await Collection.findByIdAndUpdate(
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

import { OurWebsite } from '../Modals/OurWebsite.modal.js';


// add OurWebsite
export const createOurWebsiteAdd = async (req, res) => {
    try {
        const { name, video, status, description } = req.body;

        let videoPath = "";

        // If a video file is uploaded (e.g. using multer)
        if (req.file) {
            videoPath = `/uploads/${req.file.filename}`;
        } else if (video) {
            // If video URL is passed
            videoPath = video;
        }

        const newEntry = new OurWebsite({
            name,
            video: videoPath,
            status,
            description
        });

        await newEntry.save();

        res.status(201).json({
            success: true,
            message: "Our Website entry created successfully",
            data: newEntry
        });

    } catch (error) {
        console.error("Error creating Our Website entry:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// get single OurWebsite
export const createOurWebsite = async (req, res) => {
    try {
        const OurWebsites = await OurWebsite.findById(req.params.id);
        if (!OurWebsites) {
            return res.status(404).json({ success: false, message: "OurWebsites not found" });
        }
        res.status(200).json(OurWebsites);
    } catch (error) {
        console.error("Error fetching single OurWebsites:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Delete OurWebsite
export const deleteOurWebsite = async (req, res) => {
    try {
        const deleted = await OurWebsite.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "OurWebsite not found" });
        }

        res.status(200).json({ success: true, message: "OurWebsite deleted successfully" });
    } catch (error) {
        console.error("Error deleting OurWebsite:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// get all OurWebsite 
export const getOurWebsite = async (req, res) => {
    try {
        const OurWebsites = await OurWebsite.find();
        res.status(200).json({
            success: true,
            count: OurWebsites.length,
            data: OurWebsites
        });
        console.log(OurWebsites)
    } catch (error) {
        console.error("Error fetching OurWebsites:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
// update OurWebsite
export const updateOurWebsite = async (req, res) => {
    try {
        const { name, video, status, description } = req.body;
        let updatedFields = { name, status, description };

        // If a video file is uploaded (e.g. using multer), update path
        if (req.file) {
            updatedFields.video = `/uploads/${req.file.filename}`;
        } else if (video) {
            // If video URL is passed directly
            updatedFields.video = video;
        }

        const updatedDoc = await OurWebsite.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({
                success: false,
                message: "Our Website entry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Our Website entry updated successfully",
            data: updatedDoc
        });

    } catch (error) {
        console.error("Error updating Our Website entry:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
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

    const updated = await OurWebsite.findByIdAndUpdate(
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

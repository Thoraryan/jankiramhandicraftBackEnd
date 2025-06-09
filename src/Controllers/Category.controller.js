import { Category } from "../Modals/Category.modal.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";

// Correct export style for ES Modules
export const addCategory = async (req, res) => {
  try {
    const { name, image, subcategories } = req.body;
    let imagePath = "";
    console.log("subcategories", subcategories, req.body);

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    let parsedSubcategories = [];
    if (typeof subcategories === "string") {
      parsedSubcategories = JSON.parse(subcategories);
    } else {
      parsedSubcategories = subcategories;
    }

    const newCategory = new Category({
      name,
      image: imagePath,
      subcategories: parsedSubcategories,
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add category",
    });
  }
};

// All Category
export const getAllCategorys = async (req, res) => {
  try {
    const Categorys = await Category.find();
    res.status(200).json({
      success: true,
      count: Categorys.length,
      data: Categorys,
    });
  } catch (error) {
    console.error("Error fetching Categorys:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  Delete Categorys
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting Category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Delete Sub Categorys
export const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $pull: { subcategories: { _id: subCategoryId } } },
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    let image;

    if (req.image) {
      image = `/uploads/${req.file.filename}`;
    }

    if (subcategories) {
      console.log("subcategories", req.params.id);
      const categoryDoc = await Category.findById(req.params.id);

      if (!categoryDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Parent category not found" });
      }

      let parsedSubcategories = subcategories;
      if (typeof subcategories === "string") {
        parsedSubcategories = JSON.parse(subcategories);
      }

      parsedSubcategories.forEach((sub) => {
        categoryDoc.subcategories.push({
          name: sub.name,
          image: sub.image || "",
        });
      });

      await categoryDoc.save();

      return res.status(200).json({
        success: true,
        message: "Subcategories added successfully",
        data: categoryDoc,
      });
    } else {
      const updatedFields = { name };
      if (image) updatedFields.image = image;

      const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true, runValidators: true }
      );

      if (!updateCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updateCategory,
      });
    }
  } catch (error) {
    console.error("Error updating/adding category:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Sub Category
export const updateSubCategory = async (req, res) => {
  try {
    const { id, subcategories } = req.body; // 'id' = new category ID
    const categoryId = req.params.categoryId;
    const subCategoryId = req.params.subCategoryId;
    console.log(req.file);
    const currentCategoryDoc = await Category.findById(categoryId);
    if (!currentCategoryDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Current category not found" });
    }

    const subcategory = currentCategoryDoc.subcategories.find(
      (sub) => sub._id.toString() === subCategoryId
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found in current category",
      });
    }

    if (subcategories?.name) subcategory.name = subcategories.name;
    if (req.file) {
      subcategory.image = `/uploads/${req.file.filename}`;
    }

    console.log("categoryId:", categoryId);
    console.log("newCategoryId:", id);
    if (id && id !== categoryId) {
      const newCategoryDoc = await Category.findById(id);
      if (!newCategoryDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Target category not found" });
      }

      currentCategoryDoc.subcategories =
        currentCategoryDoc.subcategories.filter(
          (sub) => sub._id.toString() !== subCategoryId
        );

      newCategoryDoc.subcategories.push({
        ...subcategory.toObject(),
        _id: subcategory._id,
      });

      await currentCategoryDoc.save();
      await newCategoryDoc.save();

      return res.status(200).json({
        success: true,
        message: "Subcategory updated and moved to new category successfully",
        data: subcategory,
      });
    } else {
      await currentCategoryDoc.save();

      return res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: subcategory,
      });
    }
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ADD Sub Category
export const AddSubCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.categoryId;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory name is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const newSubcategory = {
      name,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    };

    category.subcategories.push(newSubcategory);
    await category.save();

    res.status(200).json({
      success: true,
      message: "Subcategory added successfully",
      data: newSubcategory,
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Single Category
export const getSingleCategory = async (req, res) => {
  try {
    const Categorys = await Category.findById(req.params.id);
    if (!Categorys) {
      return res
        .status(404)
        .json({ success: false, message: "Categorys not found" });
    }
    res.status(200).json(Categorys);
  } catch (error) {
    console.error("Error fetching single Categorys:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Single Sub Category
export const getSingleSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const subcategory = category.subcategories.find(
      (sub) => sub._id.toString() === subCategoryId
    );

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    const data = {
      category,
      subcategory,
    };

    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const StatusUpdateCategory = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category status updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating Category status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const StatusUpdateSubCategory = async (req, res) => {
  try {
    const { status } = req.body;
    const subcategoryId = req.params.id;

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { "subcategories._id": subcategoryId },
      { $set: { "subcategories.$.status": status } },
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subcategory status updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating Subcategory status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

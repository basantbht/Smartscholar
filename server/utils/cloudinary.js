import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

/**
 * Upload file - PDFs stored locally, images to Cloudinary
 */
export const uploadToCloudinary = async (
  filePath,
  folder = "uploads",
  mimeType
) => {
  try {
    const isPdf = mimeType === "application/pdf";

    // Store PDFs locally instead of Cloudinary
    if (isPdf) {
      const uploadsDir = path.join(process.cwd(), "uploads", folder);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${path.basename(filePath)}`;
      const permanentPath = path.join(uploadsDir, fileName);
      
      // Move file to permanent location
      fs.renameSync(filePath, permanentPath);

      return {
        url: `/uploads/${folder}/${fileName}`, // Local URL
        publicId: fileName,
        resourceType: "raw",
        isLocal: true, // Flag to indicate local storage
      };
    }

    // Upload images to Cloudinary
    const options = {
      folder,
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    };

    const result = await cloudinary.uploader.upload(filePath, options);

    // Remove local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      isLocal: false,
    };
  } catch (error) {
    // Clean up local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

/**
 * Delete file from Cloudinary or local storage
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image",
  isLocal = false
) => {
  try {
    if (isLocal) {
      // Delete from local storage
      const filePath = path.join(process.cwd(), "uploads", publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

/**
 * Extract public ID from URL (handles both Cloudinary and local)
 */
export const getPublicIdFromUrl = (url) => {
  try {
    // Check if it's a local URL
    if (url.startsWith("/uploads/")) {
      return url.replace("/uploads/", "");
    }

    // Cloudinary URL
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename.split(".")[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${publicId}`;
  } catch (error) {
    return null;
  }
};
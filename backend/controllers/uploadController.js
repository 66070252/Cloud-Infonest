const uploadController = {
  uploadImage: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      // req.file.location คือ URL เต็มของไฟล์บน S3 (เช่น https://...)
      const imageUrl = req.file.location; 

      res.status(200).json({ 
        message: "Upload successful", 
        imageUrl: imageUrl // ส่ง URL นี้กลับไปให้ Frontend
      });
    } catch (error) {
      console.error("Error in uploadController:", error);
      res.status(500).json({ message: "Error processing file." });
    }
  }
};

export default uploadController;
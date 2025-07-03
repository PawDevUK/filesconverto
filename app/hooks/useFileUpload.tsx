import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/convert"; // Adjust the API endpoint as necessary

type fileUploadProps = {
  target: {
    files: FileList;
  };
  maxFileSize:number,
  cloudFunctionURL:string
}
const useFileUpload: uploadFunc = (e) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if(e){
      console.log(e.target.files);
    } else {
      console.log("No event provided");
    }
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      setError("Failed to upload file");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, uploadFile };
};

export default useFileUpload;

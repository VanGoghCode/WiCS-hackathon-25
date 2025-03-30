import { useState, useRef } from "react";
import { ClothingCategory, UploadModalProps } from "../../Types/types";
import Button from "./Button";
import {
  CameraIcon,
  CloseIcon,
  ColorPickerIcon,
  UploadIcon,
} from "../../assets/SocialIcons/Icons";
import SelectInput from "./SelectInput";
import ColorInput from "./ColorInput";
import { v4 as uuidv4 } from "uuid";

const categories = [
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "shoes", label: "Shoes" },
  { value: "watch", label: "Watch" },
];

const subcategories = {
  top: ["shirt", "tshirt"],
  bottom: ["jeans", "pant", "shorts"],
  shoes: ["formal", "sneaker", "sport"],
  watch: ["analog", "digital", "smart"],
};

const weatherOptions = [
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
  { value: "cold", label: "Cold" },
  { value: "rainy", label: "Rainy" },
];

const styleOptions = [
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
];

const actionButtons = [
  {
    id: "upload",
    onClickHandler: "triggerFileInput" as const,
    variant: "outline" as const,
    icon: <UploadIcon />,
    text: "Upload Image",
  },
  {
    id: "camera",
    onClickHandler: "startCamera" as const,
    variant: "secondary" as const,
    icon: <CameraIcon />,
    text: "Take Photo",
  },
];

const validFormats = ["image/jpeg", "image/jpg", "image/png"];
const maxFileSize = 5 * 1024 * 1024;

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [newItem, setNewItem] = useState({
    type: "",
    category: "",
    subcategory: "",
    style: "casual",
    weather: "",
    color: "#000000",
    imageName: "",
  });

  const validateFile = (file: File) => {
    if (!validFormats.includes(file.type)) {
      setError("Invalid file format. Please upload JPG, or PNG files only.");
      return false;
    }

    if (file.size > maxFileSize) {
      setError("File size exceeds 5MB limit.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      setNewItem((prev) => ({
        ...prev,
        imageName: selectedFile.name,
      }));

      analyzeImageColors(previewUrl);
    }
  };

// AI Generated
  const analyzeImageColors = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const maxSize = 100;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors: Record<string, number> = {};

      for (let i = 0; i < imageData.data.length; i += 16) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];

        if (a < 128) continue;

        const roundedR = Math.round(r / 10) * 10;
        const roundedG = Math.round(g / 10) * 10;
        const roundedB = Math.round(b / 10) * 10;

        const hex = `#${roundedR.toString(16).padStart(2, "0")}${roundedG
          .toString(16)
          .padStart(2, "0")}${roundedB.toString(16).padStart(2, "0")}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }

      const topColors = Object.entries(colors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((entry) => entry[0]);

      setDominantColors(topColors);

      if (topColors.length > 0) {
        setNewItem((prev) => ({ ...prev, color: topColors[0] }));
      }
    };
    img.src = imageUrl;
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Camera access denied or not available.");
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        canvasRef.current.toBlob(
          (blob) => {
            if (blob) {
              const capturedFile = new File(
                [blob],
                `capture-${Date.now()}.jpg`,
                {
                  type: "image/jpeg",
                }
              );
              if (validateFile(capturedFile)) {
                setFile(capturedFile);
                const previewUrl = URL.createObjectURL(blob);
                setImagePreview(previewUrl);
                setNewItem((prev) => ({
                  ...prev,
                  imageName: capturedFile.name,
                }));
                analyzeImageColors(previewUrl);
                stopCamera();
              }
            }
          },
          "image/jpeg",
          0.95
        );
      }
    }
  };

  // AI Generated

  const handleColorPick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isColorPickerActive || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get pixel color with proper scaling
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context && imageRef.current) {
      // Use natural dimensions for canvas
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;

      // Draw image at full size
      context.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

      // Get scaled coordinates based on actual image size
      const scaleX = imageRef.current.naturalWidth / rect.width;
      const scaleY = imageRef.current.naturalHeight / rect.height;

      const scaledX = Math.floor(x * scaleX);
      const scaledY = Math.floor(y * scaleY);

      try {
        const pixel = context.getImageData(scaledX, scaledY, 1, 1).data;
        const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
          .toString(16)
          .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
        setNewItem((prev) => ({ ...prev, color: hex }));
        setIsColorPickerActive(false);
      } catch (error) {
        console.error("Error picking color:", error);
      }
    }
  };

  const toggleColorPicker = () => {
    setIsColorPickerActive((prev) => !prev);
  };

  const handleUpload = async () => {
    if (isFormValid() && file) {
      setIsUploading(true);
      setError(null);

      try {
        const fileExt = file.name.split(".").pop();
        const uniqueFileName = `${uuidv4()}.${fileExt}`;

        const renamedFile = new File([file], uniqueFileName, {
          type: file.type,
        });

        const formData = new FormData();
        formData.append("image", renamedFile);
        formData.append("style", newItem.style);
        formData.append("type", newItem.subcategory);
        formData.append("weather", newItem.weather);
        formData.append("userId", "123");
        formData.append("category", newItem.category);
        formData.append("color", newItem.color);

        const response = await fetch("http://54.90.107.6:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        onUpload({
          ...newItem,
          category: newItem.category as ClothingCategory,
          imageName: uniqueFileName,
          imageUrl: URL.createObjectURL(file),
          userId: "123",
        });

        handleClose();
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Failed to upload item");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClose = () => {
    if (isCapturing) stopCamera();
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFile(null);
    setImagePreview(null);
    setError(null);
    setIsColorPickerActive(false);
    setDominantColors([]);
    setNewItem({
      type: "",
      category: "",
      subcategory: "",
      style: "casual",
      weather: "",
      color: "#000000",
      imageName: "",
    });
    onClose();
  };

  const isFormValid = () => {
    return (
      file !== null &&
      newItem.category.trim() !== "" &&
      newItem.subcategory.trim() !== "" &&
      newItem.color.trim() !== "" &&
      newItem.weather.trim() !== "" &&
      (["top", "bottom", "shoes"].includes(newItem.category)
        ? newItem.style.trim() !== ""
        : true)
    );
  };

  const handleFieldChange =
    (field: keyof typeof newItem) => (value: string) => {
      setNewItem((prev) => ({ ...prev, [field]: value }));
    };

  const getSubcategoryOptions = () => {
    const subs =
      subcategories[newItem.category as keyof typeof subcategories] || [];
    return subs.map((sub) => ({
      value: sub,
      label: sub.charAt(0).toUpperCase() + sub.slice(1),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 wood-border rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="wood-panel p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-50">Add New Item</h2>
          <button
            onClick={handleClose}
            className="bg-amber-200 rounded-full p-1 hover:bg-amber-300 transition-colors"
            aria-label="Close modal"
          >
            <div className="text-amber-800">
              <CloseIcon />
            </div>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <canvas ref={canvasRef} className="hidden" />

          <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 flex flex-col items-center justify-center bg-amber-100">
            {isCapturing ? (
              <div className="w-full relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 object-cover rounded"
                />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                  <Button onClick={capturePhoto} className="p-2">
                    Capture
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="p-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="relative">
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Preview"
                  className={`w-full h-66 object-cover mb-4 rounded border-2 border-amber-200 ${
                    isColorPickerActive ? "cursor-crosshair" : ""
                  }`}
                  onClick={handleColorPick}
                  onLoad={() => {}}
                />
                {isColorPickerActive && (
                  <div className="absolute top-2 right-2 bg-amber-100 px-2 py-1 rounded text-xs text-amber-800 font-medium">
                    Click on image to pick color
                  </div>
                )}
                <button
                  onClick={toggleColorPicker}
                  className={`absolute bottom-6 right-2 bg-amber-200 p-2 rounded-full hover:bg-amber-300 transition-colors ${
                    isColorPickerActive ? "bg-amber-400" : ""
                  }`}
                  title="Pick color from image"
                >
                  <div className="h-5 w-5 text-amber-800">
                    <ColorPickerIcon color={newItem.color} />
                  </div>
                </button>
              </div>
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-amber-200/50 mb-4 rounded border-2 border-amber-200">
                <p className="text-amber-700">Image preview will appear here</p>
              </div>
            )}

            {!isCapturing && (
              <div className="flex gap-2 w-full">
                {actionButtons.map((btn) => (
                  <Button
                    key={btn.id}
                    onClick={
                      btn.onClickHandler === "triggerFileInput"
                        ? triggerFileInput
                        : startCamera
                    }
                    variant={btn.variant}
                    className="w-full"
                  >
                    {btn.icon} {btn.text}
                  </Button>
                ))}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-amber-700 mt-2">
              JPG, JPEG or PNG up to 5MB
            </p>
          </div>

          {imagePreview && !isCapturing && (
            <>
              <div className="grid gap-4">
                <SelectInput
                  label="Category"
                  value={newItem.category}
                  options={categories}
                  onChange={(value) => {
                    handleFieldChange("category")(value);
                    handleFieldChange("subcategory")("");
                  }}
                  placeholder="Select a category"
                  required
                />

                <SelectInput
                  label="Subcategory"
                  value={newItem.subcategory}
                  options={getSubcategoryOptions()}
                  onChange={handleFieldChange("subcategory")}
                  disabled={!newItem.category}
                  placeholder="Select a subcategory"
                  required
                />

                {["top", "bottom", "shoes"].includes(newItem.category) && (
                  <SelectInput
                    label="Style"
                    value={newItem.style}
                    options={styleOptions}
                    onChange={handleFieldChange("style")}
                    placeholder="Select a style"
                    required
                  />
                )}

                <SelectInput
                  label="Suitable Weather"
                  value={newItem.weather}
                  options={weatherOptions}
                  onChange={handleFieldChange("weather")}
                  placeholder="Select weather"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-1">
                    Color
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <ColorInput
                          label="Select color"
                          value={newItem.color}
                          onChange={handleFieldChange("color")}
                          key={newItem.color}
                        />
                      </div>
                      <div
                        className="w-10 h-10 rounded border border-amber-300"
                        style={{ backgroundColor: newItem.color }}
                      ></div>
                    </div>

                    {dominantColors.length > 0 && (
                      <div>
                        <p className="text-xs text-amber-700 mb-1">
                          Detected colors:
                        </p>
                        <div className="flex gap-1">
                          {dominantColors.map((color, index) => (
                            <button
                              key={index}
                              className="w-8 h-8 rounded border border-amber-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => handleFieldChange("color")(color)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1"
                  disabled={!isFormValid() || isCapturing || isUploading}
                >
                  {isUploading ? "Uploading..." : "Add to Wardrobe"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;


import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, fileName: string) => void;
  currentImage?: string;
  onClearImage?: () => void;
}

const ImageUpload = ({ onImageUpload, currentImage, onClearImage }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl, file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (currentImage) {
    return (
      <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image className="w-4 h-4 text-teal-400" />
              <span className="text-slate-200 text-sm">Image uploaded</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClick}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs"
              >
                Change
              </Button>
              {onClearImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearImage}
                  className="text-slate-300 hover:text-white hover:bg-slate-700/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-lg">
      <CardContent className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-teal-400 bg-teal-400/10 shadow-lg shadow-teal-400/20'
              : 'border-slate-500 hover:border-slate-400 hover:bg-slate-700/20'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-200 text-sm mb-1">
            Drop an image here or click to upload
          </p>
          <p className="text-slate-400 text-xs">
            Supports JPEG, PNG, DICOM images
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.dcm"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </CardContent>
    </Card>
  );
};

export default ImageUpload;

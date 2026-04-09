import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, FileText, ChevronRight, X } from "lucide-react";

export function UploadPage() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleGenerate = () => {
    if (uploadedFile) {
      // Store file info in sessionStorage for next page
      sessionStorage.setItem("pdfFileName", uploadedFile.name);
      navigate("/generate");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">PDF 업로드</h1>
          <p className="text-gray-600">
            학습하고 싶은 PDF 자료를 업로드해주세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-indigo-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                PDF 파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-500 mb-6">최대 10MB</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-block">
                  파일 선택
                </span>
              </label>
            </div>
          </div>

          {/* Uploaded File Display */}
          {uploadedFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-2 hover:bg-green-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!uploadedFile}
            className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition ${
              uploadedFile
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                
            }`}
          >
            문제 생성하기
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

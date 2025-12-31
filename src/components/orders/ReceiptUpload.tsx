'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { orderAPI } from '@/lib/api';
import { OrderAttachment } from '@/types';

interface ReceiptUploadProps {
  orderId?: string;
  onFilesChange?: (files: File[]) => void;
  existingAttachments?: OrderAttachment[];
  onAttachmentDeleted?: (attachmentId: string) => void;
}

export function ReceiptUpload({
  orderId,
  onFilesChange,
  existingAttachments = [],
  onAttachmentDeleted,
}: ReceiptUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<OrderAttachment[]>(existingAttachments);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update attachments when existingAttachments change
  useEffect(() => {
    setAttachments(existingAttachments);
  }, [existingAttachments]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid file type. Only JPEG, PNG, and PDF are allowed.`);
        return false;
      }

      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      if (orderId && orderId !== 'existing') {
        // Upload immediately if order exists
        uploadFiles(validFiles);
      } else {
        // Store files for later upload
        setFiles((prev) => [...prev, ...validFiles]);
        if (onFilesChange) {
          onFilesChange([...files, ...validFiles]);
        }
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    if (!orderId || orderId === 'existing') return;

    setUploading(true);
    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orders/${orderId}/attachments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setAttachments((prev) => [data.data, ...prev]);
        }
      }
      
      setFiles([]);
      if (onFilesChange) {
        onFilesChange([]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await orderAPI.deleteAttachment(attachmentId);
      setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
      if (onAttachmentDeleted) {
        onAttachmentDeleted(attachmentId);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete file');
    }
  };

  const removePendingFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="receipt-upload"
        />
        <label htmlFor="receipt-upload">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="cursor-pointer"
          >
            📎 Upload Receipt Files
          </Button>
        </label>
        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
      </div>

      {/* Pending files (before order creation) */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Files to upload after order creation:</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removePendingFile(index)}
                  className="text-xs px-2 py-1"
                >
                  ❌ Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded attachments (after order creation) */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded receipts:</p>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {attachment.file_type?.startsWith('image/') ? '🖼️' : '📄'}
                  </span>
                  <div>
                    <a
                      href={attachment.file_url || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/receipts/${attachment.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {attachment.file_name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {attachment.file_size ? formatFileSize(attachment.file_size) : 'Unknown size'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleDelete(attachment.id)}
                  className="text-xs px-2 py-1"
                >
                  🗑️ Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


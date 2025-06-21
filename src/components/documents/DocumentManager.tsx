import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  FolderPlus,
  Paperclip
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'contract' | 'invoice' | 'certification' | 'report' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  url?: string;
}

export const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState<Document['category']>('other');
  const [uploadTags, setUploadTags] = useState('');

  // Mock documents for demonstration
  React.useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'doc-1',
        name: 'Supplier Agreement - Global Supply Co.pdf',
        type: 'application/pdf',
        size: 2450000,
        category: 'contract',
        uploadedBy: 'John Doe',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['supplier', 'legal', 'contract']
      },
      {
        id: 'doc-2',
        name: 'ISO 27001 Certificate.pdf',
        type: 'application/pdf',
        size: 1250000,
        category: 'certification',
        uploadedBy: 'Sarah Chen',
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['certification', 'iso', 'security']
      },
      {
        id: 'doc-3',
        name: 'Q1 Supply Chain Report.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 856000,
        category: 'report',
        uploadedBy: 'Michael Rodriguez',
        uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['report', 'quarterly', 'analytics']
      },
      {
        id: 'doc-4',
        name: 'Invoice-INV-2024-0156.pdf',
        type: 'application/pdf',
        size: 345000,
        category: 'invoice',
        uploadedBy: 'Finance Team',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['invoice', 'finance', 'payment']
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedFiles(files);
    setIsUploadModalOpen(true);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    setIsUploadModalOpen(true);
  };

  const handleUpload = () => {
    if (!selectedFiles) return;

    const newDocuments: Document[] = Array.from(selectedFiles).map((file, index) => ({
      id: `doc-new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      category: uploadCategory,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      tags: uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }));

    setDocuments(prev => [...newDocuments, ...prev]);
    setIsUploadModalOpen(false);
    setSelectedFiles(null);
    setUploadTags('');
    setUploadCategory('other');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📁';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract':
        return 'bg-blue-100 text-blue-800';
      case 'invoice':
        return 'bg-green-100 text-green-800';
      case 'certification':
        return 'bg-purple-100 text-purple-800';
      case 'report':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
          <p className="text-gray-600">Upload, organize, and manage business documents</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Documents
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="contract">Contracts</option>
          <option value="invoice">Invoices</option>
          <option value="certification">Certifications</option>
          <option value="report">Reports</option>
          <option value="other">Other</option>
        </select>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      {/* Drag and Drop Upload Area */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
        <p className="text-sm text-gray-500">Supports PDF, DOC, XLS, images and more</p>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getFileIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h4>
                  <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(doc.category)}`}>
                {doc.category.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-1">
                {doc.tags.map((tag) => (
                  <span key={tag} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                <p>Uploaded by {doc.uploadedBy}</p>
                <p>{new Date(doc.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-800">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Documents"
        size="md"
      >
        <div className="space-y-4">
          {selectedFiles && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Selected Files</h4>
              <div className="space-y-2">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-900">{file.name}</span>
                    <span className="text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as Document['category'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="other">Other</option>
              <option value="contract">Contract</option>
              <option value="invoice">Invoice</option>
              <option value="certification">Certification</option>
              <option value="report">Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={uploadTags}
              onChange={(e) => setUploadTags(e.target.value)}
              placeholder="e.g., contract, legal, supplier"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFiles}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Documents
            </button>
          </div>
        </div>
      </Modal>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No documents found</p>
          <p className="text-sm text-gray-400 mt-1">Upload documents to get started</p>
        </div>
      )}
    </div>
  );
};
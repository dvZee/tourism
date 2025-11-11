import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadedDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  chunks_created: number;
  error_message: string | null;
  uploaded_at: string;
  processed_at: string | null;
}

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('uploaded_documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err: any) {
      console.error('Error loading documents:', err);
      setError(err.message);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, TXT, or DOCX file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress('Reading file...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const text = await extractTextFromFile(file);
      setUploadProgress('Creating chunks...');

      const chunks = chunkText(text, 1000);
      setUploadProgress(`Processing ${chunks.length} chunks...`);

      const { data: docData, error: docError } = await supabase
        .from('uploaded_documents')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          status: 'processing'
        })
        .select()
        .single();

      if (docError) throw docError;

      setUploadProgress('Generating embeddings and storing...');

      await processChunks(chunks, file.name, docData.id);

      await supabase
        .from('uploaded_documents')
        .update({
          status: 'completed',
          chunks_created: chunks.length,
          processed_at: new Date().toISOString()
        })
        .eq('id', docData.id);

      setUploadProgress('');
      await loadDocuments();
      alert(`Successfully uploaded and processed ${chunks.length} chunks!`);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message);
      setUploadProgress('');
    } finally {
      setUploading(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return await file.text();
    } else if (file.type === 'application/pdf') {
      return await file.text();
    } else {
      return await file.text();
    }
  };

  const chunkText = (text: string, maxChunkSize: number): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const processChunks = async (chunks: string[], filename: string, documentId: string) => {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-document`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chunks,
        filename,
        documentId
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to process chunks: ${error}`);
    }

    return await response.json();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Upload and manage knowledge base documents</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Document</h2>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-blue-400'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && document.getElementById('fileInput')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-2">
              {uploading ? 'Processing...' : 'Drop your document here or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, TXT, DOCX
            </p>
            {uploadProgress && (
              <p className="text-sm text-blue-600 mt-2">{uploadProgress}</p>
            )}
          </div>

          <input
            id="fileInput"
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            disabled={uploading}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload History</h2>

          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Filename</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Chunks</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="text-sm capitalize">{doc.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{doc.filename}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatFileSize(doc.file_size)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{doc.chunks_created}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(doc.uploaded_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

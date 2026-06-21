// components/MediaUploader.tsx - COMPLETE FIXED VERSION
import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Link, X, Image, Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface MediaUploaderProps {
  onUpload: (url: string, type: string) => void;
  onClose: () => void;
}

export default function MediaUploader({ onUpload, onClose }: MediaUploaderProps) {
  const { uploadFile, uploadByUrl } = useApp();
  const [uploadType, setUploadType] = useState<'pc' | 'url'>('pc');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await uploadFile(file);
      console.log('Upload result:', result);
      
      if (result && result.url) {
        setSuccess('File uploaded successfully!');
        setTimeout(() => {
          onUpload(result.url, result.type || (file.type.startsWith('image') ? 'image' : 'video'));
          onClose();
        }, 1000);
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlUpload = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await uploadByUrl(url);
      console.log('URL upload result:', result);
      
      if (result && result.url) {
        setSuccess('URL added successfully!');
        setTimeout(() => {
          onUpload(result.url, result.type || 'image');
          onClose();
        }, 1000);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err: any) {
      console.error('URL upload error:', err);
      setError(err.response?.data?.error || err.message || 'Invalid URL');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Upload Media</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setUploadType('pc'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2
              ${uploadType === 'pc' 
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300'
              }`}
          >
            <Upload size={16} /> From PC
          </button>
          <button
            onClick={() => { setUploadType('url'); setError(''); setSuccess(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2
              ${uploadType === 'url' 
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300'
              }`}
          >
            <Link size={16} /> By URL
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-2 animate-scale-in">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2 animate-scale-in">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* PC Upload */}
        {uploadType === 'pc' && (
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="hidden"
              disabled={loading}
            />
            
            <button
              onClick={triggerFileInput}
              disabled={loading}
              className="w-full py-16 border-2 border-dashed border-white/20 rounded-xl 
                hover:border-sky-400 hover:bg-sky-400/5 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 size={40} className="mx-auto mb-3 text-sky-400 animate-spin" />
              ) : (
                <>
                  <Upload size={40} className="mx-auto mb-3 text-slate-400 group-hover:text-sky-400 transition-colors" />
                  <p className="text-sm text-slate-400 group-hover:text-sky-300 transition-colors">
                    Click to select image or video
                  </p>
                </>
              )}
              <p className="text-xs text-slate-600 mt-2">Supported: JPG, PNG, GIF, MP4, WebM (Max 50MB)</p>
            </button>
          </div>
        )}

        {/* URL Upload */}
        {uploadType === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="admin-label block mb-2">Image/Video URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="admin-input w-full"
                disabled={loading}
              />
              <p className="text-xs text-slate-500 mt-1">
                Support: JPG, PNG, GIF, WebP, MP4 URLs
              </p>
            </div>
            
            <button
              onClick={handleUrlUpload}
              disabled={!url.trim() || loading}
              className="glass-btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Link size={18} />
              )}
              {loading ? 'Adding...' : 'Add from URL'}
            </button>
          </div>
        )}

        {/* Preview for URL */}
        {uploadType === 'url' && url && !loading && (
          <div className="mt-4 p-3 rounded-xl bg-white/5">
            <p className="text-xs text-slate-500 mb-2">Preview:</p>
            {url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
              <img src={url} alt="Preview" className="max-h-32 rounded-lg object-contain mx-auto" />
            ) : url.match(/\.(mp4|webm|ogg)/i) ? (
              <video src={url} className="max-h-32 rounded-lg mx-auto" controls />
            ) : (
              <p className="text-xs text-slate-400 text-center">External link</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
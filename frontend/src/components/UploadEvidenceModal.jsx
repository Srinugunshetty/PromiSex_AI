import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';

export default function UploadEvidenceModal({ productId, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('manufacturer_spec');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a document title');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('doc_type', docType);
      if (textContent) formData.append('text_content', textContent);
      if (file) formData.append('file', file);

      await onSubmit(productId, formData);
      onClose();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreloadSpec = () => {
    setTitle('TechCorp Official Engineering Spec Sheet (Rev 2.4)');
    setDocType('manufacturer_spec');
    setTextContent(`TechCorp UP15 Official Engineering Specification Sheet:
1. PROCESSOR: Intel Core i7-13700H (14 cores: 6P+8E, up to 5.0GHz, 45W TDP).
2. MEMORY: 16 GB DDR5 5200MHz Dual-Channel (2x 8GB SO-DIMM).
3. STORAGE: 1 TB PCIe 4.0 NVMe SSD.
4. DISPLAY: 15.6" 2.8K OLED 120Hz 100% DCI-P3 calibrated.
5. GRAPHICS: NVIDIA GeForce RTX 4060 Laptop GPU 8GB GDDR6 (105W TGP).
6. BATTERY & CHARGER: 75Wh 4-Cell battery. MobileMark 25 official benchmark: 8.5 Hours maximum. In-box charger: Standard 65W Type-C Adapter (100W GaN adapter sold separately).
7. CHASSIS: CNC Aluminum Alloy body. MIL-STD 810H durability NOT certified for this consumer SKU.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-xl space-y-4 text-slate-900 dark:text-slate-100 my-6 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-900/60">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Ingest Manufacturer Evidence Document
              </h3>
              <p className="text-xs text-slate-500">
                Indexes datasheets or warranty policies for automated semantic reconciliation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs">
          <span className="text-slate-600 dark:text-slate-400">Testing? Pre-load the official TechCorp Spec Sheet</span>
          <button
            type="button"
            onClick={handlePreloadSpec}
            className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded font-medium"
          >
            Preload Spec
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Official Manufacturer Technical Datasheet"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
            >
              <option value="manufacturer_spec">Official Manufacturer Spec Sheet</option>
              <option value="warranty_policy">Warranty Policy & Legal Terms</option>
              <option value="benchmark_report">Independent Benchmark / Lab Test</option>
              <option value="regulatory_filing">Regulatory Safety Filing</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              Upload PDF or Text File (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-slate-600 dark:text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 dark:file:bg-slate-800 file:text-slate-800 dark:file:text-slate-200 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">
              Document Text Content / Extracted Sections
            </label>
            <textarea
              rows={5}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste official technical specification clauses..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Ingesting...' : 'Ingest Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

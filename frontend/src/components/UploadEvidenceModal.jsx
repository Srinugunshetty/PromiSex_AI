import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

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
    setTitle('TechCorp Official Hardware Engineering Spec (Rev 2.4)');
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-100 my-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Upload Evidence Document</h3>
              <p className="text-xs text-slate-400">
                Provide manufacturer datasheets, warranty contracts, or lab benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between items-center bg-sky-950/20 border border-sky-500/20 p-3 rounded-xl text-xs">
          <span className="text-sky-300">Testing? Pre-load the official TechCorp Spec Sheet</span>
          <button
            type="button"
            onClick={handlePreloadSpec}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors"
          >
            Preload Spec
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Official Manufacturer Technical Datasheet"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="manufacturer_spec">Official Manufacturer Spec Sheet</option>
              <option value="warranty_policy">Warranty Policy & Legal Terms</option>
              <option value="benchmark_report">Independent Benchmark / Lab Test</option>
              <option value="regulatory_filing">FCC / Regulatory Safety Filing</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Upload PDF or Text File (Optional)
            </label>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-sky-400 hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Document Text Content / Extracted Sections
            </label>
            <textarea
              rows={6}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste official specification text, battery benchmark tables, or warranty clauses..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {isSubmitting ? 'Registering Document...' : 'Ingest Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

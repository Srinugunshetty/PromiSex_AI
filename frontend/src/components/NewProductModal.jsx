import React, { useState } from 'react';
import { Sparkles, Package, AlertCircle } from 'lucide-react';

export default function NewProductModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    seller_name: 'ElectroDirect Hub',
    price: 999.0,
    currency: 'USD',
    category: 'Laptops',
    raw_listing_text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.raw_listing_text) {
      alert('Please fill in product title and product listing text.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('Failed to create product: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadSample = () => {
    setFormData({
      title: 'Zenith AeroBook 14 Ultra (OLED Edition)',
      brand: 'Zenith',
      model: 'ZB14-OLED',
      seller_name: 'Zenith Premier Deals',
      price: 1199.0,
      currency: 'USD',
      category: 'Laptops',
      raw_listing_text: `Zenith AeroBook 14 Ultra - Next-Gen Thin & Light Flagship
• Intel Core Ultra 7 155H with dedicated AI NPU
• 32 GB LPDDR5X 7467MHz Dual-Channel Fast RAM
• 2 TB PCIe 4.0 NVMe SSD High-Speed Storage
• 16 Hours All-Day Long Battery Life with RapidCharge
• 100W GaN Travel Charger included
• 14.0-inch 3K 120Hz PureSight OLED Display (400 nits)
• Intel Arc Integrated Graphics (8 Xe-cores)
• 3-Year Zero-Downtime Global Manufacturer Warranty
• Full Magnesium-Lithium Ultra-Lightweight 980g Chassis
• Genuine Windows 11 Home 64-bit Pre-activated
• Dual Thunderbolt 4 / USB-4 High-Speed Ports
• Wi-Fi 7 (802.11be) Next-Gen Wireless`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 my-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Add Product Listing for Verification</h3>
              <p className="text-xs text-slate-400">
                PROMISEX AI will parse claims and extract structured promises automatically
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

        <div className="flex justify-between items-center bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl text-xs">
          <span className="text-indigo-300">Want to test with a quick sample listing?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Auto-fill Sample
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Asus ROG Zephyrus G16"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Brand & Model</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Brand (e.g. Asus)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Model (e.g. GU605MI)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Seller Name</label>
              <input
                type="text"
                value={formData.seller_name}
                onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                placeholder="e.g. PrimeTech Marketplace"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Listing Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="1299.99"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Product Listing Description & Bullet Points *
            </label>
            <textarea
              rows={6}
              required
              value={formData.raw_listing_text}
              onChange={(e) => setFormData({ ...formData, raw_listing_text: e.target.value })}
              placeholder="Paste raw ecommerce product description, specifications, or promotional claims..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
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
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Extracting Claims...' : 'Create & Extract Promises'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

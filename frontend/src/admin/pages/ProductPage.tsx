
import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2, ImagePlus } from 'lucide-react';
import AdminTopbar from '../components/AdminTopbar';
import Modal from '../components/Modal';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import { useCategoryStore } from '../store/categoryStore';
import type { Category, Product, Subcategory } from '../store/categoryStore';
import { useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
function ProductForm({
  categoryId,
  subcategoryId,
  onClose,
  initialData,
  isEdit
}: {
  categoryId: string;
  subcategoryId: string;
  onClose: () => void;
  initialData?: Product;
  isEdit?: boolean;
}) {
  const { addProduct, updateProduct } = useCategoryStore();

  // const [form, setForm] = useState({ name: '', description: '', price: '', mrp: '', stock: '', unit: 'kg', sku: '', image: '', active: true });
  const [preview, setPreview] = useState('');
  const [imageUploadMethod, setImageUploadMethod] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [form, setForm] = useState(
    initialData || {
      name: '',
      description: '',
      price: '',
      selling_count: 0,
      mrp: '',
      stock: '',
      unit: 'kg',
      sku: '',
      image: '',
      active: true
    }
  );

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  // Initialize preview when editing
  useEffect(() => {
    if (initialData?.image) {
      setPreview(initialData.image);
    }
  }, [initialData]);




  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      set("image", data.url); // ✅ THIS goes to backend
    } catch (err) {
      console.error(err);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      set("image", imageUrl.trim());
      setPreview(imageUrl.trim());
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && initialData) {
      await updateProduct(initialData.id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        selling_count: Number(form.selling_count),
        unit: form.unit,
        sku: form.sku,
        image: form.image,
        active: form.active,
      });
    } else {
      await addProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: Number(form.stock),
        selling_count: Number(form.selling_count),
        unit: form.unit,
        sku: form.sku,
        image: form.image,
        categoryId,
        subcategoryId,
        active: form.active,
      });
    }

    onClose();
  };

  const units = ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'pack', 'box'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide pr-1">
      {/* Image upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#94A3B8]">
          Product Image
        </label>

        {/* Toggle between file and URL */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setImageUploadMethod('file');
              setImageUrl('');
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              imageUploadMethod === 'file'
                ? 'bg-[#FF4D8D]/20 text-[#FF4D8D] border border-[#FF4D8D]/30'
                : 'bg-white/5 text-[#94A3B8] border border-white/10 hover:bg-white/10'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => {
              setImageUploadMethod('url');
              setPreview(form.image || '');
            }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              imageUploadMethod === 'url'
                ? 'bg-[#FF4D8D]/20 text-[#FF4D8D] border border-[#FF4D8D]/30'
                : 'bg-white/5 text-[#94A3B8] border border-white/10 hover:bg-white/10'
            }`}
          >
            URL
          </button>
        </div>

        {/* File Upload Method */}
        {imageUploadMethod === 'file' && (
          <div className="flex gap-3 items-start">
            {/* Preview */}
            <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/3 flex items-center justify-center overflow-hidden shrink-0">
              <ImagePlus size={24} className="text-gray-600" />
              {preview && <img src={preview} alt="Preview" className="w-full h-full object-cover" />}
            </div>

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  handleUpload(file);
                  setPreview(URL.createObjectURL(file)); // ✅ preview
                }
              }}
              className="text-sm text-white"
            />
          </div>
        )}

        {/* URL Upload Method */}
        {imageUploadMethod === 'url' && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-start">
              {/* Preview */}
              <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/3 flex items-center justify-center overflow-hidden shrink-0">
                <ImagePlus size={24} className="text-gray-600" />
                {preview && <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview('')} />}
              </div>

              {/* URL input */}
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-[#FF4D8D]/20 text-[#FF4D8D] border border-[#FF4D8D]/30 hover:bg-[#FF4D8D]/30 transition-all"
                >
                  Load Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><AdminInput label="Product Name *" placeholder="e.g. Red Apple" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">Description</label>
          <textarea
            placeholder="Product description..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D8D]/50 transition-all resize-none"
          />
        </div>
        <AdminInput label="Selling Price (₹) *" type="number" placeholder="120" value={form.price} onChange={e => set('price', e.target.value)} required />
        <AdminInput label="MRP (₹) *" type="number" placeholder="150" value={form.mrp} onChange={e => set('mrp', e.target.value)} required />
         <AdminInput label="Selling Count" type="number" placeholder="0" value={form.selling_count} onChange={e => set('selling_count', e.target.value)} required />
        <AdminInput label="Stock Quantity *" type="number" placeholder="200" value={form.stock} onChange={e => set('stock', e.target.value)} required />
        <AdminSelect label="Unit" value={form.unit} onChange={e => set('unit', e.target.value)} options={units.map(u => ({ value: u, label: u }))} />
        <AdminInput label="SKU Code" placeholder="APP-RED-001" value={form.sku} onChange={e => set('sku', e.target.value)} hint="Leave blank to auto-generate" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#94A3B8]">Status</label>
          <button
            type="button"
            onClick={() => set('active', !form.active)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${form.active ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-white/10 bg-white/5 text-gray-400'}`}
          >
            <span className={`w-3 h-3 rounded-full ${form.active ? 'bg-green-400' : 'bg-gray-500'}`} />
            {form.active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/5 text-sm transition-all">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)', fontFamily: 'Sora,sans-serif' }}>
          {isEdit ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

function SubcategoryAccordion({ sub, category }: { sub: Subcategory; category: Category }) {
  const [open, setOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { deleteProduct } = useCategoryStore();
  const { deleteSubcategory, toggleSubcategory } = useCategoryStore();
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={14} className="text-[#FF4D8D]" /> : <ChevronRight size={14} className="text-gray-500" />}
          <span className="text-white text-sm font-medium" style={{ fontFamily: 'Sora,sans-serif' }}>{sub.name}</span>
          <span className="text-[10px] text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded-full">{sub.products.length} products</span>
        </div>
        <div className="flex items-center gap-2">

          {/* Status */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSubcategory(sub.id, sub.isActive);
            }}
            className="cursor-pointer"
          >
            <StatusBadge status={sub.isActive ? "Active" : "Inactive"} />
          </div>

          {/* Add Product */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAddProductOpen(true);
            }}
            className="flex items-center gap-1 text-xs text-[#FF4D8D] hover:text-pink-300 bg-[#FF4D8D]/10 px-3 py-1.5 rounded-lg"
          >
            <Plus size={12} /> Add
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete subcategory?")) {
                deleteSubcategory(sub.id);
              }
            }}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
          >
            <Trash2 size={12} />
          </button>

        </div>

      </button>

      {open && (
        <div className="p-3 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sub.products.length === 0 ? (
            <div className="col-span-full text-center py-8 text-[#94A3B8] text-sm">No products yet. Add your first product.</div>
          ) : sub.products.map(p => (
            <div key={p.id} className="bg-[rgba(17,25,40,0.8)] border border-white/8 rounded-xl p-3 flex flex-col gap-2 hover:border-white/15 transition-all">
              <div className="h-28 rounded-lg overflow-hidden bg-white/3">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-white text-sm font-medium truncate" style={{ fontFamily: 'Sora,sans-serif' }}>{p.name}</div>
                <div className="text-[#94A3B8] text-xs">{p.unit}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold text-sm">₹{p.price}</span>
                  {p.mrp > p.price && <span className="text-[#94A3B8] text-xs line-through ml-1">₹{p.mrp}</span>}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.stock <= 10 ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                  {p.stock <= 10 ? `Low: ${p.stock}` : `${p.stock} in stock`}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all text-xs"
                  onClick={() => setEditProduct(p)}>
                  <Pencil size={11} /> Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/8 hover:bg-red-500/15 text-red-400 transition-all text-xs"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addProductOpen} onClose={() => setAddProductOpen(false)} title={`Add Product to ${sub.name}`} size="lg">
        <ProductForm categoryId={category.id} subcategoryId={sub.id} onClose={() => setAddProductOpen(false)} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        open={!!editProduct}
        onClose={() => setEditProduct(null)}
        title="Edit Product"
      >
        {editProduct && (
          <ProductForm
            categoryId={editProduct.categoryId}
            subcategoryId={editProduct.subcategoryId}
            onClose={() => setEditProduct(null)}
            initialData={editProduct}
            isEdit
          />
        )}
      </Modal>
    </div>
  );
}

export default function ProductsPage() {
  const { categories, addCategory, addSubcategory, fetchCategories, deleteCategory, toggleCategory } = useCategoryStore();
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [addSubOpen, setAddSubOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', image: '' });
  const [subForm, setSubForm] = useState({ name: '' });

  useEffect(() => {
    if (!selectedCat) return;

    const fresh = categories.find(c => c.id === selectedCat.id);
    if (fresh) setSelectedCat(fresh);

  }, [categories]);


  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <div className="flex-1 overflow-y-auto">
      <AdminTopbar title="Products Management" />
      <div className="p-6">

        {!selectedCat ? (
          // Category list view
          <div className="space-y-4 animate-fadeUp">
            <div className="flex items-center justify-between">
              <p className="text-[#94A3B8] text-sm">{categories.length} categories</p>
              <button onClick={() => setAddCatOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)', fontFamily: 'Sora,sans-serif' }}>
                <Plus size={15} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCat(cat)}
                  className="bg-[rgba(17,25,40,0.75)] border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-[#FF4D8D]/30 hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
                >
                  <div className="h-32 rounded-xl overflow-hidden bg-white/3">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>{cat.name}</div>
                    <div className="text-[#94A3B8] text-xs mt-0.5">{cat.subcategories.length} subcategories · {cat.productCount} products</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[#FF4D8D] text-xs flex items-center gap-1">Manage <ChevronRight size={12} /></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete category?")) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(cat.id, cat.isActive);
                    }}
                    className="cursor-pointer"
                  >
                    <StatusBadge status={cat.isActive ? "Active" : "Inactive"} />
                  </div>
                </div>

              ))}
            </div>
          </div>
        ) : (
          // Category details view
          <div className="space-y-4 animate-fadeUp">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedCat(null)} className="text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1 text-sm">
                ← Back
              </button>
              <ChevronRight size={14} className="text-gray-600" />
              <span className="text-white font-semibold" style={{ fontFamily: 'Sora,sans-serif' }}>{selectedCat.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#94A3B8] text-sm">{selectedCat.subcategories.length} subcategories</p>
              <button onClick={() => setAddSubOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)', fontFamily: 'Sora,sans-serif' }}>
                <Plus size={15} /> Add Subcategory
              </button>
            </div>

            <div className="space-y-3">
              {selectedCat.subcategories.length === 0 ? (
                <div className="text-center py-16 text-[#94A3B8]">No subcategories yet. Add one to get started.</div>
              ) : selectedCat.subcategories.map(sub => (
                <SubcategoryAccordion key={sub.id} sub={sub} category={selectedCat} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal open={addCatOpen} onClose={() => setAddCatOpen(false)} title="Add New Category">
        <form onSubmit={e => { e.preventDefault(); addCategory(catForm); setAddCatOpen(false); setCatForm({ name: '', image: '' }); }} className="space-y-4">
          <AdminInput label="Category Name *" placeholder="e.g. Fruits & Vegetables" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} required />
          <AdminInput label="Image URL" placeholder="https://..." value={catForm.image} onChange={e => setCatForm(f => ({ ...f, image: e.target.value }))} hint="Paste a public image URL" />
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setAddCatOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white text-sm transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)' }}>Create Category</button>
          </div>
        </form>
      </Modal>

      {/* Add Subcategory Modal */}
      <Modal open={addSubOpen} onClose={() => setAddSubOpen(false)} title={`Add Subcategory to ${selectedCat?.name}`}>
        <form onSubmit={e => {
          e.preventDefault();
          if (selectedCat) addSubcategory({ name: subForm.name, categoryId: selectedCat.id });
          setAddSubOpen(false); setSubForm({ name: '' });
        }} className="space-y-4">
          <AdminInput label="Subcategory Name *" placeholder="e.g. Apples" value={subForm.name} onChange={e => setSubForm({ name: e.target.value })} required />
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setAddSubOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white text-sm transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#FF4D8D,#e63c7a)' }}>Create Subcategory</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

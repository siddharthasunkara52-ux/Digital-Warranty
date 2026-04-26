import { useState } from 'react';
import { Download, Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import EditProduct from './EditProduct';
import Modal from './Modal';
import ConfirmDialog from './common/ConfirmDialog';
import StatusBadge from './common/StatusBadge';
import { deleteProduct as deleteProductApi } from '../services/productService';
import { formatDate, getExpiresInText, getWarrantyProgress } from '../utils/dateUtils';
import { API_BASE } from '../utils/constants';

function ProductCard({ product, refresh, setToast }) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const expiresText = getExpiresInText(product.expiryDate);
  const progress = getWarrantyProgress(product.purchaseDate, product.expiryDate);

  const handleDelete = async () => {
    try {
      await deleteProductApi(product._id);
      setToast?.({ message: 'Product deleted successfully.', type: 'success' });
      refresh?.();
    } catch (error) {
      setToast?.({ message: 'Unable to delete product.', type: 'error' });
    }
    setConfirmOpen(false);
  };

  const progressColor =
    product.status === 'Expired'
      ? 'bg-red-500'
      : product.status === 'Near Expiry'
      ? 'bg-amber-500'
      : 'bg-green-500';

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50/50">
      {}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900">{product.productName}</h3>
            {product.category && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                {product.category}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(product.purchaseDate)}
            </span>
            {expiresText && (
              <span className={`flex items-center gap-1 font-medium ${
                product.status === 'Expired' ? 'text-red-600' : product.status === 'Near Expiry' ? 'text-amber-600' : 'text-green-600'
              }`}>
                <Clock className="h-3.5 w-3.5" />
                {expiresText}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={product.status} />
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Edit2 className="h-3 w-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      </div>

      {}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Warranty progress</span>
          <span className="font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
        <span>Expires: <strong className="text-gray-700">{formatDate(product.expiryDate)}</strong></span>
        <span>Period: <strong className="text-gray-700">{product.warrantyPeriod} months</strong></span>
        {product.invoiceFile && (
          <a
            href={`${API_BASE}${product.invoiceFile}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
            download
          >
            <Download className="h-3.5 w-3.5" />
            Invoice
          </a>
        )}
      </div>

      {}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Product" subtitle="Update warranty details">
        <EditProduct
          product={product}
          refresh={refresh}
          setToast={setToast}
          closeModal={() => setEditOpen(false)}
        />
      </Modal>

      {}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.productName}"? This will also remove all its maintenance records.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Delete Product"
      />
    </article>
  );
}

export default ProductCard;

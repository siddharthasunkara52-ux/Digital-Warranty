import { useEffect, useCallback, useState } from 'react';
import { Plus, Eye, Pencil, Trash2, Clock } from 'lucide-react';
import Modal from '../Modal';
import AddProduct from '../AddProduct';
import Toast from '../Toast';
import SkeletonCard from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';
import SearchBar from '../common/SearchBar';
import PageHeader from '../common/PageHeader';
import { useToast } from '../../hooks/useToast';
import { getProducts } from '../../services/productService';
import { Table, Td } from '../ui/Table';
import Button from '../ui/Button';
import StatusBadge from '../common/StatusBadge';
import ConfirmDialog from '../common/ConfirmDialog';
import EditProduct from '../EditProduct';
import ProductDetails from '../ProductDetails';
import { formatDate, getExpiresInText, getWarrantyProgress } from '../../utils/dateUtils';
import ProgressBar from '../ui/ProgressBar';
import { deleteProduct as deleteProductApi } from '../../services/productService';

function MyProductsTab() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const { toast, showToast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({ search, filter });
      setProducts(data || []);
    } catch (error) {
      showToast('Unable to fetch products.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filter, showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((query) => {
    setSearch(query);
  }, []);

  const handleFilter = useCallback((value) => {
    setFilter(value);
  }, []);

  const handleDelete = async () => {
    if (!deleteProduct?._id) return;
    try {
      await deleteProductApi(deleteProduct._id);
      showToast('Product deleted successfully.', 'success');
      await fetchProducts();
    } catch (e) {
      showToast('Unable to delete product.', 'error');
    } finally {
      setDeleteProduct(null);
    }
  };

  const columns = [
    { key: 'product', header: 'Product' },
    { key: 'purchase', header: 'Purchase' },
    { key: 'expiry', header: 'Expiry' },
    { key: 'status', header: 'Status' },
    { key: 'usage', header: 'Warranty usage', className: 'hidden lg:table-cell' },
    { key: 'actions', header: '', className: 'text-right' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Products"
        subtitle="Browse and manage your warranty inventory"
        actionLabel="Add Product"
        onAction={() => setModalOpen(true)}
        icon={Plus}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          filterValue={filter}
          placeholder="Search by product name..."
        />
      </div>

      {!loading && products.length > 0 && (
        <p className="text-xs text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      )}

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : products.length ? (
        <Table columns={columns}>
          {products.map((p) => {
            const expiresText = getExpiresInText(p.expiryDate);
            const progress = getWarrantyProgress(p.purchaseDate, p.expiryDate);
            const rowTone =
              p.status === 'Expired' ? 'bg-red-50/30' : p.status === 'Near Expiry' ? 'bg-amber-50/30' : 'bg-white';
            const progressTone = p.status === 'Expired' ? 'bad' : p.status === 'Near Expiry' ? 'warn' : 'good';

            return (
              <tr key={p._id} className={`group ${rowTone} hover:bg-gray-50/80 transition-colors duration-200`}>
                <Td>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.productName}</p>
                    <p className="mt-1 text-xs font-medium text-gray-500">{p.category || 'Uncategorized'}</p>
                  </div>
                </Td>
                <Td className="whitespace-nowrap font-medium text-gray-700">{formatDate(p.purchaseDate)}</Td>
                <Td className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{formatDate(p.expiryDate)}</span>
                    {expiresText ? (
                      <span
                        className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide ${
                          p.status === 'Expired'
                            ? 'text-red-600'
                            : p.status === 'Near Expiry'
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {expiresText}
                      </span>
                    ) : null}
                  </div>
                </Td>
                <Td className="whitespace-nowrap">
                  <StatusBadge status={p.status} />
                </Td>
                <Td className="hidden lg:table-cell">
                  <div className="min-w-[160px]">
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                      <span>Used</span>
                      <span className="font-medium text-slate-700">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} tone={progressTone} />
                  </div>
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setViewProduct(p)}>
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button variant="outline" size="sm" type="button" onClick={() => setEditProduct(p)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="danger" size="sm" type="button" onClick={() => setDeleteProduct(p)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </Td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <EmptyState
          title="No products added yet 😕"
          description=""
          actionLabel="+ Add Product"
          onAction={() => setModalOpen(true)}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Product" subtitle="Start tracking a warranty">
        <AddProduct
          refresh={() => { fetchProducts(); setModalOpen(false); }}
          setToast={(t) => showToast(t.message, t.type)}
          closeModal={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={Boolean(viewProduct)}
        onClose={() => setViewProduct(null)}
        title="Product details"
        subtitle="Warranty info, status, and invoice"
      >
        <ProductDetails product={viewProduct} />
      </Modal>

      <Modal
        isOpen={Boolean(editProduct)}
        onClose={() => setEditProduct(null)}
        title="Edit product"
        subtitle="Update warranty details"
      >
        <EditProduct
          product={editProduct}
          refresh={fetchProducts}
          setToast={(t) => showToast(t.message, t.type)}
          closeModal={() => setEditProduct(null)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteProduct)}
        title="Delete product"
        message={deleteProduct?.productName ? `Are you sure you want to delete "${deleteProduct.productName}"?` : 'Are you sure you want to delete this product?'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteProduct(null)}
        confirmLabel="Delete product"
      />

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default MyProductsTab;

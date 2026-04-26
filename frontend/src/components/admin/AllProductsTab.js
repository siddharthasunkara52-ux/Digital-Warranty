import { useEffect, useState, useCallback } from 'react';
import Spinner from '../Spinner';
import EmptyState from '../common/EmptyState';
import Toast from '../Toast';
import { Database, Eye, Pencil, Trash2, Clock } from 'lucide-react';
import { getAllAdminProducts, getAllUsers } from '../../services/adminService';
import { getProducts } from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import SearchBar from '../common/SearchBar';
import { Table, Td } from '../ui/Table';
import StatusBadge from '../common/StatusBadge';
import Button from '../ui/Button';
import Modal from '../Modal';
import ProductDetails from '../ProductDetails';
import EditProduct from '../EditProduct';
import ConfirmDialog from '../common/ConfirmDialog';
import ProgressBar from '../ui/ProgressBar';
import { deleteProduct as deleteProductApi } from '../../services/productService';
import { formatDate, getExpiresInText, getWarrantyProgress } from '../../utils/dateUtils';

function AllProductsTab() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const { toast, showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || data || []);
    } catch (err) {
      console.error('Failed to load users');
    }
  }, []);

  const fetchData = useCallback(async (userId = '') => {
    setLoading(true);
    try {
      if (userId) {

        const data = await getProducts({ userId });
        setProducts(data || []);
      } else {

        const data = await getAllAdminProducts();
        setProducts(data.products || []);
      }
    } catch (err) {
      showToast('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
    fetchData();
  }, [fetchUsers, fetchData]);

  const handleUserFilter = (userId) => {
    setSelectedUserId(userId);
    fetchData(userId);
  };

  const filtered = products.filter((p) => {
    const matchesSearch = !search
      ? true
      : String(p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
        String(p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteProduct?._id) return;
    try {
      await deleteProductApi(deleteProduct._id);
      showToast('Product deleted successfully.', 'success');
      await fetchData(selectedUserId);
    } catch (e) {
      showToast('Unable to delete product.', 'error');
    } finally {
      setDeleteProduct(null);
    }
  };

  const columns = [
    { key: 'product', header: 'Product' },
    { key: 'user', header: 'User', className: 'hidden xl:table-cell' },
    { key: 'expiry', header: 'Expiry' },
    { key: 'status', header: 'Status' },
    { key: 'usage', header: 'Usage', className: 'hidden lg:table-cell' },
    { key: 'actions', header: '', className: 'text-right' },
  ];

  if (loading && !products.length) return <Spinner text="Loading global registry..." />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-0.5">Global Registry</h3>
        <p className="text-sm text-gray-500">All products registered across the platform.</p>
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Filter by user</span>
          <select
            value={selectedUserId}
            onChange={(e) => handleUserFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <SearchBar
          onSearch={(q) => setSearch(q)}
          onFilter={(v) => setStatusFilter(v)}
          filterValue={statusFilter}
          placeholder="Search product or category..."
        />
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-500">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {selectedUserId ? ` for ${users.find((u) => u._id === selectedUserId)?.name || 'selected user'}` : ''}
        </p>
      )}

      {loading ? (
        <Spinner text="Loading..." />
      ) : filtered.length ? (
        <Table columns={columns}>
          {filtered.map((p) => {
            const expiresText = getExpiresInText(p.expiryDate);
            const progress = getWarrantyProgress(p.purchaseDate, p.expiryDate);
            const rowTone =
              p.status === 'Expired' ? 'bg-rose-50/30' : p.status === 'Near Expiry' ? 'bg-amber-50/30' : 'bg-white';
            const progressTone = p.status === 'Expired' ? 'bad' : p.status === 'Near Expiry' ? 'warn' : 'good';
            const userName = p.user?.name || p.owner?.name || p.userName || '';

            return (
              <tr key={p._id} className={`group ${rowTone} hover:bg-slate-50 transition`}>
                <Td>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{p.productName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{p.category || 'Uncategorized'}</p>
                  </div>
                </Td>
                <Td className="hidden xl:table-cell">
                  <span className="text-slate-600">{userName || '—'}</span>
                </Td>
                <Td className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{formatDate(p.expiryDate)}</span>
                    {expiresText ? (
                      <span
                        className={`mt-0.5 inline-flex items-center gap-1 text-xs font-medium ${
                          p.status === 'Expired'
                            ? 'text-rose-700'
                            : p.status === 'Near Expiry'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
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
                  <div className="min-w-[140px]">
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
          icon={Database}
          title="No products found"
          description={
            selectedUserId
              ? 'This user has no registered products (or no results match your filters).'
              : 'No products have been registered on the platform yet.'
          }
        />
      )}

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
          refresh={() => fetchData(selectedUserId)}
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

export default AllProductsTab;

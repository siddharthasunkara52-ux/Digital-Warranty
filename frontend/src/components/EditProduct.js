import { useMemo, useState } from 'react';
import { updateProduct, uploadInvoice } from '../services/productService';
import { CATEGORY_OPTIONS } from '../utils/constants';
import { API_BASE } from '../utils/constants';
import { toInputDate } from '../utils/dateUtils';
import { Card, CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import FileDropzone from './ui/FileDropzone';
import { Package, ShieldCheck, ReceiptText, ExternalLink } from 'lucide-react';

function EditProduct({ product, refresh, setToast, closeModal }) {
  const initialUnit = product.warrantyPeriod && product.warrantyPeriod % 12 === 0 ? 'years' : 'months';
  const initialValue = initialUnit === 'years' ? product.warrantyPeriod / 12 : product.warrantyPeriod || '';

  const [productName, setProductName] = useState(product.productName || '');
  const [purchaseDate, setPurchaseDate] = useState(toInputDate(product.purchaseDate));
  const [warrantyPeriod, setWarrantyPeriod] = useState(initialValue);
  const [warrantyUnit, setWarrantyUnit] = useState(initialUnit);
  const [category, setCategory] = useState(product.category || 'Electronics');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryOptions = useMemo(() => CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })), []);

  const validate = () => {
    const newErrors = {};
    if (!productName.trim()) newErrors.productName = 'Product name is required';
    if (!purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!warrantyPeriod || warrantyPeriod <= 0) newErrors.warrantyPeriod = 'Enter a valid warranty period';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await updateProduct(product._id, { productName, purchaseDate, warrantyPeriod, warrantyUnit, category });

      if (invoiceFile) {
        await uploadInvoice(product._id, invoiceFile);
      }

      setToast?.({ message: 'Product updated successfully.', type: 'success' });
      await refresh();
      closeModal?.();
    } catch (error) {
      setToast?.({ message: 'Unable to update product.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <Card>
        <CardHeader
          title="Product Info"
          subtitle="Update basic asset details."
          action={
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <Package className="h-4 w-4" /> Required
            </div>
          }
        />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Product name *"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                if (errors.productName) setErrors({ ...errors, productName: '' });
              }}
              error={errors.productName}
            />

            <Input
              label="Purchase date *"
              type="date"
              value={purchaseDate}
              onChange={(e) => {
                setPurchaseDate(e.target.value);
                if (errors.purchaseDate) setErrors({ ...errors, purchaseDate: '' });
              }}
              error={errors.purchaseDate}
            />
          </div>

          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={categoryOptions} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Warranty Info"
          subtitle="Changes will recalculate expiry date and status."
          action={
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4" /> Required
            </div>
          }
        />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <Input
              label="Warranty period *"
              type="number"
              min="1"
              value={warrantyPeriod}
              onChange={(e) => {
                setWarrantyPeriod(e.target.value);
                if (errors.warrantyPeriod) setErrors({ ...errors, warrantyPeriod: '' });
              }}
              error={errors.warrantyPeriod}
            />

            <Select
              label="Unit"
              value={warrantyUnit}
              onChange={(e) => setWarrantyUnit(e.target.value)}
              options={[
                { value: 'months', label: 'Months' },
                { value: 'years', label: 'Years' },
              ]}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Invoice Upload"
          subtitle="Optional. Upload a new invoice to replace the current one."
          action={
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <ReceiptText className="h-4 w-4" /> Optional
            </div>
          }
        />
        <CardBody className="space-y-3">
          <FileDropzone label="New invoice" value={invoiceFile} onChange={(file) => setInvoiceFile(file)} />
          {product.invoiceFile ? (
            <a
              className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:underline"
              href={`${API_BASE}${product.invoiceFile}`}
              target="_blank"
              rel="noreferrer"
            >
              View current invoice <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p className="text-sm text-slate-500">No invoice uploaded yet.</p>
          )}
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="outline" type="button" onClick={() => closeModal?.()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Update product'}
        </Button>
      </div>
    </form>
  );
}

export default EditProduct;

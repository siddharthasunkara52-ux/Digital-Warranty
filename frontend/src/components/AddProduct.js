import { useMemo, useState } from 'react';
import { addProduct as addProductApi, uploadInvoice } from '../services/productService';
import { CATEGORY_OPTIONS } from '../utils/constants';
import { Package, ShieldCheck, ReceiptText } from 'lucide-react';
import { Card, CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import FileDropzone from './ui/FileDropzone';

function AddProduct({ refresh, setToast, closeModal }) {
  const [productName, setProductName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [warrantyUnit, setWarrantyUnit] = useState('months');
  const [category, setCategory] = useState('Electronics');
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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = await addProductApi({ productName, purchaseDate, warrantyPeriod, warrantyUnit, category });
      const createdProduct = data.product;

      if (invoiceFile && createdProduct?._id) {
        await uploadInvoice(createdProduct._id, invoiceFile);
      }

      setToast?.({ message: 'Product added successfully.', type: 'success' });
      setProductName('');
      setPurchaseDate('');
      setWarrantyPeriod('');
      setInvoiceFile(null);
      setErrors({});
      await refresh();
      closeModal?.();
    } catch (err) {
      setToast?.({ message: err.response?.data?.message || 'Unable to add product.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-4">
      <Card>
        <CardHeader
          title="Product Info"
          subtitle="Basic details to identify the asset."
          action={
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              <Package className="h-4 w-4 text-indigo-500" /> Required
            </div>
          }
        />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Product name *"
              placeholder="e.g. MacBook Pro"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                if (errors.productName) setErrors({ ...errors, productName: '' });
              }}
              error={errors.productName}
              hint={!errors.productName ? 'Device or product name' : undefined}
            />

            <Input
              label="Purchase date *"
              type="date"
              max="2099-12-31"
              value={purchaseDate}
              onChange={(e) => {
                setPurchaseDate(e.target.value);
                if (errors.purchaseDate) setErrors({ ...errors, purchaseDate: '' });
              }}
              error={errors.purchaseDate}
            />
          </div>

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Warranty Info"
          subtitle="Used to calculate expiry date and status."
          action={
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              <ShieldCheck className="h-4 w-4 text-indigo-500" /> Required
            </div>
          }
        />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <Input
              label="Warranty period *"
              type="number"
              min="1"
              placeholder="12"
              value={warrantyPeriod}
              onChange={(e) => {
                setWarrantyPeriod(e.target.value);
                if (errors.warrantyPeriod) setErrors({ ...errors, warrantyPeriod: '' });
              }}
              error={errors.warrantyPeriod}
              hint={!errors.warrantyPeriod ? 'How long the warranty lasts' : undefined}
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
          subtitle="Optional. Keep proof of purchase attached to the product."
          action={
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              <ReceiptText className="h-4 w-4 text-gray-400" /> Optional
            </div>
          }
        />
        <CardBody>
          <FileDropzone
            label="Invoice"
            value={invoiceFile}
            onChange={(file) => setInvoiceFile(file)}
          />
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button variant="outline" type="button" onClick={() => closeModal?.()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}

export default AddProduct;
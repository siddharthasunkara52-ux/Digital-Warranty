import { useEffect, useState } from 'react';
import { addRecord, getRecords, updateRecord, deleteRecord } from '../services/maintenanceService';
import { formatDate, toInputDate } from '../utils/dateUtils';
import PageHeader from './common/PageHeader';
import EmptyState from './common/EmptyState';
import ConfirmDialog from './common/ConfirmDialog';
import { Wrench, Edit2, Trash2 } from 'lucide-react';

function MaintenancePanel({ products, refresh, setToast }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [records, setRecords] = useState([]);
  const [serviceDate, setServiceDate] = useState('');
  const [description, setDescription] = useState('');
  const [editRecord, setEditRecord] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    if (!selectedProductId && products.length) {
      setSelectedProductId(products[0]._id);
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    if (selectedProductId) {
      fetchRecords();
    } else {
      setRecords([]);
    }

  }, [selectedProductId]);

  const fetchRecords = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    try {
      const data = await getRecords(selectedProductId);
      setRecords(data || []);
    } catch (error) {
      setToast?.({ message: 'Unable to load maintenance history.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !serviceDate || !description) {
      setToast?.({ message: 'Please select a product and enter details.', type: 'error' });
      return;
    }
    try {
      await addRecord({ productId: selectedProductId, serviceDate, description });
      setServiceDate('');
      setDescription('');
      setToast?.({ message: 'Maintenance record saved.', type: 'success' });
      await fetchRecords();
      refresh?.();
    } catch (error) {
      setToast?.({ message: 'Unable to save maintenance record.', type: 'error' });
    }
  };

  const beginEdit = (record) => {
    setEditRecord(record);
    setEditDate(toInputDate(record.serviceDate));
    setEditDescription(record.description);
  };

  const cancelEdit = () => {
    setEditRecord(null);
    setEditDate('');
    setEditDescription('');
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!editDate || !editDescription) {
      setToast?.({ message: 'Please fill in both fields.', type: 'error' });
      return;
    }
    try {
      await updateRecord(editRecord._id, { serviceDate: editDate, description: editDescription });
      setToast?.({ message: 'Maintenance record updated.', type: 'success' });
      cancelEdit();
      await fetchRecords();
      refresh?.();
    } catch (error) {
      setToast?.({ message: 'Unable to update record.', type: 'error' });
    }
  };

  const handleDeleteRecord = async () => {
    if (!confirmId) return;
    try {
      await deleteRecord(confirmId);
      setToast?.({ message: 'Maintenance record deleted.', type: 'success' });
      if (editRecord?._id === confirmId) cancelEdit();
      await fetchRecords();
      refresh?.();
    } catch (error) {
      setToast?.({ message: 'Unable to delete record.', type: 'error' });
    }
    setConfirmId(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Maintenance Records"
        subtitle="Track service and maintenance history for each warranty item"
      />

      {}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Select product</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Choose a product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.productName}</option>
            ))}
          </select>
        </label>
        {selectedProduct && (
          <p className="mt-1 text-xs text-gray-500">Selected: <strong>{selectedProduct.productName}</strong></p>
        )}
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Add new record</h3>
        <form onSubmit={handleAddRecord} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="sm:w-44">
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the maintenance..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 whitespace-nowrap">
            Add
          </button>
        </form>
      </div>

      {}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">History</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <p className="text-sm text-gray-500 py-6 text-center">Loading records...</p>
          ) : records.length ? (
            records.map((record) => (
              <div key={record._id} className="px-4 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-gray-400">{formatDate(record.serviceDate)}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{record.description}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => beginEdit(record)} className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={() => setConfirmId(record._id)} className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>

                {editRecord?._id === record._id && (
                  <form onSubmit={handleUpdateRecord} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end bg-gray-50 rounded-md p-3">
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-44" />
                    <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    <div className="flex gap-1.5">
                      <button type="submit" className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
                      <button type="button" onClick={cancelEdit} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            ))
          ) : (
            <div className="p-4">
              <EmptyState icon={Wrench} title="No maintenance records" description="Add a service record to start tracking maintenance history." />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmId}
        title="Delete Record"
        message="Are you sure you want to delete this maintenance record?"
        onConfirm={handleDeleteRecord}
        onCancel={() => setConfirmId(null)}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default MaintenancePanel;

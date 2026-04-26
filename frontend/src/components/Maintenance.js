import { useEffect, useState } from 'react';
import { getRecords, addRecord, updateRecord, deleteRecord } from '../services/maintenanceService';
import { formatDate, toInputDate } from '../utils/dateUtils';
import ConfirmDialog from './common/ConfirmDialog';

function Maintenance({ productId, refresh, setToast }) {
  const [records, setRecords] = useState([]);
  const [serviceDate, setServiceDate] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const fetchRecords = async () => {
    try {
      const data = await getRecords(productId);
      setRecords(data || []);
    } catch (error) {
      setToast?.({ message: 'Unable to load maintenance history.', type: 'error' });
    }
  };

  useEffect(() => {
    fetchRecords();

  }, [productId]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!serviceDate || !description) {
      setToast?.({ message: 'Please enter maintenance details.', type: 'error' });
      return;
    }

    try {
      await addRecord({ productId, serviceDate, description });
      setServiceDate('');
      setDescription('');
      refresh?.();
      fetchRecords();
      setToast?.({ message: 'Maintenance record saved.', type: 'success' });
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editDate || !editDescription) {
      setToast?.({ message: 'Please update both date and description.', type: 'error' });
      return;
    }

    try {
      await updateRecord(editRecord._id, {
        serviceDate: editDate,
        description: editDescription,
      });
      setToast?.({ message: 'Maintenance record updated.', type: 'success' });
      cancelEdit();
      fetchRecords();
      refresh?.();
    } catch (error) {
      setToast?.({ message: 'Unable to update maintenance record.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteRecord(confirmId);
      setToast?.({ message: 'Maintenance record deleted.', type: 'success' });
      if (editRecord?._id === confirmId) cancelEdit();
      fetchRecords();
      refresh?.();
    } catch (error) {
      setToast?.({ message: 'Unable to delete maintenance record.', type: 'error' });
    }
    setConfirmId(null);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700"
      >
        <span>Maintenance History</span>
        <span className="text-gray-500 text-xs">{expanded ? 'Hide' : 'Show'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row sm:items-end">
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
                placeholder="Service details"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 whitespace-nowrap"
            >
              Save record
            </button>
          </form>

          <div className="space-y-2">
            {records.length ? (
              records.map((record) => (
                <div key={record._id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{formatDate(record.serviceDate)}</p>
                      <p className="text-sm text-gray-700 mt-0.5">{record.description}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => beginEdit(record)}
                        className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(record._id)}
                        className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {editRecord?._id === record._id && (
                    <form onSubmit={handleUpdate} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end bg-gray-50 rounded-md p-3">
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
              <p className="rounded-md bg-white p-4 text-sm text-gray-500 shadow-sm">No maintenance history yet.</p>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmId}
        title="Delete Record"
        message="Are you sure you want to delete this maintenance record?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default Maintenance;
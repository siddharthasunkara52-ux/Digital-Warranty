import React from 'react';
import { Calendar, Clock, Download, Tag } from 'lucide-react';
import { API_BASE } from '../utils/constants';
import { formatDate, getExpiresInText, getWarrantyProgress } from '../utils/dateUtils';
import StatusBadge from './common/StatusBadge';
import ProgressBar from './ui/ProgressBar';
import { Card, CardBody } from './ui/Card';

function toneFromStatus(status) {
  if (status === 'Expired') return 'bad';
  if (status === 'Near Expiry') return 'warn';
  return 'good';
}

function ProductDetails({ product }) {
  if (!product) return null;

  const progress = getWarrantyProgress(product.purchaseDate, product.expiryDate);
  const tone = toneFromStatus(product.status);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-900">{product.productName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
            {product.category ? (
              <span className="inline-flex items-center gap-1">
                <Tag className="h-4 w-4 text-slate-400" /> {product.category}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4 text-slate-400" /> Purchased {formatDate(product.purchaseDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4 text-slate-400" /> {getExpiresInText(product.expiryDate)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={product.status} />
        </div>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Warranty usage</span>
            <span className="font-medium text-slate-900">{progress}%</span>
          </div>
          <ProgressBar value={progress} tone={tone} />
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <span className="text-slate-500">Expiry date</span>
              <p className="font-medium text-slate-900">{formatDate(product.expiryDate)}</p>
            </div>
            <div>
              <span className="text-slate-500">Warranty period</span>
              <p className="font-medium text-slate-900">{product.warrantyPeriod} months</p>
            </div>
          </div>
          {product.invoiceFile ? (
            <a
              href={`${API_BASE}${product.invoiceFile}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"
              download
            >
              <Download className="h-4 w-4" />
              Download invoice
            </a>
          ) : (
            <p className="text-sm text-slate-500">No invoice uploaded.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default ProductDetails;


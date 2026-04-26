import React from 'react';

function Table({ columns = [], children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100 backdrop-blur-sm">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                    c.className || ''
                  }`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Td({ className = '', children }) {
  return <td className={`px-6 py-4 align-middle text-gray-700 ${className}`}>{children}</td>;
}

export { Table, Td };

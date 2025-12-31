'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Order, OrderMaterial, Equipment, OrderAttachment } from '@/types';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { orderAPI } from '@/lib/api';

interface OrderWithMaterials extends Order {
  materials: (OrderMaterial & { equipment: Equipment | null })[];
}

interface OrdersTableProps {
  orders: OrderWithMaterials[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  deleting?: string | null;
}

export function OrdersTable({ orders, onEdit, onDelete, deleting }: OrdersTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  if (orders.length === 0) {
    return (
      <Card>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No orders found</p>
          <p className="text-sm mt-2">Create your first order to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Order Reference</TableHeader>
                <TableHeader>Generator Model</TableHeader>
                <TableHeader>Receiver Name</TableHeader>
                <TableHeader>Materials Count</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                const totalQuantity = order.materials.reduce(
                  (sum, m) => sum + m.quantity,
                  0
                );

                return (
                  <React.Fragment key={order.id}>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="flex items-center space-x-2 hover:text-primary-600"
                        >
                          <span>{order.order_reference}</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              isExpanded ? 'transform rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </TableCell>
                      <TableCell>{order.generator_model}</TableCell>
                      <TableCell>{order.receiver_name}</TableCell>
                      <TableCell>
                        {order.materials.length} item(s) - {totalQuantity} total qty
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {onEdit && (
                            <Button
                              variant="outline"
                              onClick={() => onEdit(order.id)}
                              className="text-xs px-2 py-1"
                            >
                              ✏️ Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="danger"
                              onClick={() => onDelete(order.id)}
                              disabled={deleting === order.id}
                              className="text-xs px-2 py-1"
                            >
                              {deleting === order.id ? 'Deleting...' : '🗑️ Delete'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50">
                          <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Order Reference:</span>{' '}
                                {order.order_reference}
                              </div>
                              <div>
                                <span className="font-medium">Generator Model:</span>{' '}
                                {order.generator_model}
                              </div>
                              <div>
                                <span className="font-medium">Receiver Name:</span>{' '}
                                {order.receiver_name}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span>{' '}
                                {formatDate(order.created_at)}
                              </div>
                              {order.notes && (
                                <div className="col-span-2">
                                  <span className="font-medium">Notes:</span> {order.notes}
                                </div>
                              )}
                            </div>

                            <div className="border-t pt-3">
                              <h4 className="font-medium mb-2">Materials:</h4>
                              <div className="space-y-2">
                                {order.materials.length === 0 ? (
                                  <p className="text-gray-500 text-sm">No materials in this order</p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                                            Material Name
                                          </th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                                            Quantity
                                          </th>
                                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                                            Unit
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {order.materials.map((material) => (
                                          <tr key={material.id}>
                                            <td className="px-3 py-2 text-sm">
                                              {material.equipment?.name || 'Unknown Material'}
                                            </td>
                                            <td className="px-3 py-2 text-sm">{material.quantity}</td>
                                            <td className="px-3 py-2 text-sm">
                                              {material.unit || 'pcs'}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </div>

                            <OrderAttachmentsList orderId={order.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function OrderAttachmentsList({ orderId }: { orderId: string }) {
  const [attachments, setAttachments] = useState<OrderAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data = await orderAPI.getAttachments(orderId);
        setAttachments(data);
      } catch (error) {
        console.error('Error fetching attachments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [orderId]);

  if (loading) {
    return (
      <div className="border-t pt-3 mt-3">
        <p className="text-sm text-gray-500">Loading receipts...</p>
      </div>
    );
  }

  if (attachments.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="border-t pt-3 mt-3">
      <h4 className="font-medium mb-2">Receipt Files:</h4>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded"
          >
            <a
              href={attachment.file_url || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/receipts/${attachment.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <span>{attachment.file_type?.startsWith('image/') ? '🖼️' : '📄'}</span>
              <span>{attachment.file_name}</span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(attachment.file_size)})
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}


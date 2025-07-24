// pages/user/bills.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { billApi } from '@/services/billApi';
import { Bill, BillStatus, BillPriority, BillType } from '@/types/bill';
import { validateToken } from '@/utils/AuthUtils';
import { LOGIN_PATH } from '@/utils/routes';

export default function UserBillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'paid' | 'overdue'>('all');
  const router = useRouter();

  // Get user ID from localStorage (your existing system)
  const getUserId = (): number | null => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  };

  const userId = getUserId();

  useEffect(() => {
    // Check if user is authenticated using your existing validation
    const token = localStorage.getItem('accessToken');
    if (!token || !validateToken(token) || !userId) {
      router.push(LOGIN_PATH); // Using your route constant
      return;
    }

    fetchBills();
  }, [userId, router]);

  const fetchBills = async () => {
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await billApi.getBillsByUserId(userId);
      setBills(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getBillTypeLabel = (type: BillType) => {
    switch (type) {
      case BillType.ELECTRICITY: return 'Electricity';
      case BillType.COLD_WATER: return 'Cold Water';
      case BillType.HOT_WATER: return 'Hot Water';
      case BillType.GAS: return 'Gas';
      case BillType.INTERNET: return 'Internet';
      case BillType.HOUSE_SERVICE: return 'House Service';
      default: return type;
    }
  };

  const getStatusBadgeClass = (status: BillStatus) => {
    switch (status) {
      case BillStatus.PAID:
        return 'bg-green-100 text-green-800';
      case BillStatus.OPEN:
        return 'bg-yellow-100 text-yellow-800';
      case BillStatus.FAILED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: BillPriority) => {
    switch (priority) {
      case BillPriority.LOW:
        return 'bg-blue-100 text-blue-800';
      case BillPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case BillPriority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case BillPriority.OVERDUE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true;
    if (filter === 'open') return bill.status === BillStatus.OPEN;
    if (filter === 'paid') return bill.status === BillStatus.PAID;
    if (filter === 'overdue') return bill.priority === BillPriority.OVERDUE;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading bills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bills</h1>
          
          {/* Filter buttons */}
          <div className="flex space-x-4 mb-6">
            {[
              { key: 'all', label: 'All Bills' },
              { key: 'open', label: 'Open' },
              { key: 'paid', label: 'Paid' },
              { key: 'overdue', label: 'Overdue' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Bills</h3>
              <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Open Bills</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {bills.filter(b => b.status === BillStatus.OPEN).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Paid Bills</h3>
              <p className="text-2xl font-bold text-green-600">
                {bills.filter(b => b.status === BillStatus.PAID).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Outstanding</h3>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  bills
                    .filter(b => b.status === BillStatus.OPEN)
                    .reduce((sum, b) => sum + b.remainingAmount, 0)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Bills list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredBills.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bills found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {bill.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getBillTypeLabel(bill.type)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(bill.amount)}
                        </div>
                        {bill.totalPaid > 0 && (
                          <div className="text-sm text-gray-500">
                            Paid: {formatCurrency(bill.totalPaid)}
                          </div>
                        )}
                        {bill.remainingAmount > 0 && (
                          <div className="text-sm text-red-600">
                            Remaining: {formatCurrency(bill.remainingAmount)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(bill.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(bill.status)}`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeClass(bill.priority)}`}>
                          {bill.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.companyName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { billApi } from '@/services/billApi';
import { CreateBillRequest, BillType } from '@/types/bill';

interface CreateBillForm {
  name: string;
  amount: number;
  dueDate: string;
  type: BillType;
  residenceId: number;
  companyId: number;
}

export default function CreateBillPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateBillForm>();

  const onSubmit = async (data: CreateBillForm) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const billData: CreateBillRequest = {
        name: data.name,
        amount: Number(data.amount),
        dueDate: data.dueDate,
        type: data.type,
        residenceId: Number(data.residenceId),
        companyId: Number(data.companyId)
      };

      await billApi.createBill(billData);
      setSuccess('Bill created successfully!');
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Create New Bill
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Bill name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Electricity Bill"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150.50"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Type
              </label>
              <select
                {...register('type', { required: 'Bill type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select bill type</option>
                <option value={BillType.ELECTRICITY}>Electricity</option>
                <option value={BillType.COLD_WATER}>Cold Water</option>
                <option value={BillType.HOT_WATER}>Hot Water</option>
                <option value={BillType.GAS}>Gas</option>
                <option value={BillType.INTERNET}>Internet</option>
                <option value={BillType.HOUSE_SERVICE}>House Service</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Residence ID
              </label>
              <input
                type="number"
                {...register('residenceId', {
                  required: 'Residence ID is required',
                  min: { value: 1, message: 'Residence ID must be greater than 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
              {errors.residenceId && (
                <p className="mt-1 text-sm text-red-600">{errors.residenceId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company ID
              </label>
              <input
                type="number"
                {...register('companyId', {
                  required: 'Company ID is required',
                  min: { value: 1, message: 'Company ID must be greater than 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
              {errors.companyId && (
                <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Bill...' : 'Create Bill'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { InvoiceForm } from "@/app/invoice/types";
import { billApi } from '@/services/billApi';
import { invoiceValidationSchema } from "@/app/invoice/validation";
import { CreateBillRequest, BillType } from '@/types/bill';
import { AuthContext } from "@/context/AuthContext";
import { AuthContextType } from "@/context/types";
import {ROLE_COMPANY} from "@/utils/roleConstants";

export default function InvoicePage() {

  const { isLoggedIn, userRoles } = useContext(AuthContext) as AuthContextType;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceForm>({
    resolver: yupResolver(invoiceValidationSchema),
    defaultValues: {
      name: "",
      type: "",
      dueDate: "",
      amount: 0.05,
      residenceId: 0,
      companyId: 0
    },
  });

  const onSubmit = async (data: InvoiceForm) => {
    setLoading(true);
    try {
      const billData: CreateBillRequest = {
        name: data.name,
        amount: Number(data?.amount),
        dueDate: data?.dueDate,
        type: data?.type,
        residenceId: Number(data?.residenceId),
        companyId: Number(data?.companyId)
      };

      await billApi.createBill(billData);
      setSuccess("Invoice sent successfully!");
      setError("");
      reset();
    } catch (err) {
      setError("Failed to send invoice");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };


  return (
      <>

        <div className="flex justify-center items-start min-h-screen bg-gradient-to-r from-[#fef08a] to-[#f9a8d4] py-10 overflow-y-auto">
          <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-center text-xl font-semibold">Create Bill Invoice</h2>
            <h2 className="text-xl font-semibold mb-2">Bill Details</h2>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}

            <label className="text-gray-700">Name</label>
            <input {...register("name")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>

            <label className="text-gray-700">Bill Type</label>
            <select {...register("type")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200">
              <option value="">Select bill type</option>
              <option value={BillType?.ELECTRICITY}>Electricity</option>
              <option value={BillType?.COLD_WATER}>Cold Water</option>
              <option value={BillType?.HOT_WATER}>Hot Water</option>
              <option value={BillType?.GAS}>Gas</option>
              <option value={BillType?.INTERNET}>Internet</option>
              <option value={BillType?.HOUSE_SERVICE}>House Service</option>
            </select>

            <p className="text-red-500 text-sm">{errors.type?.message}</p>

            <label className="text-gray-700">Due Date</label>
            <input type="date" {...register("dueDate")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200 cursor-pointer" />
            <p className="text-red-500 text-sm">{errors.dueDate?.message}</p>

            <label className="text-gray-700">Amount</label>
            <input {...register("amount", { valueAsNumber: true })}
                   type="text"
                   inputMode="decimal"
                   onInput={(e) => {
                     const input = e.target as HTMLInputElement;
                     input.value = input.value.replace(/[^0-9.]/g, '');
                   }}
                   className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
            <p className="text-red-500 text-sm">{errors.amount?.message}</p>

            <label className="text-gray-700">Residence ID</label>
            <input {...register("residenceId", { valueAsNumber: true })}  type="number" className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
            <p className="text-red-500 text-sm">{errors.residenceId?.message}</p>

            <label className="text-gray-700">Company ID</label>
            <input {...register("companyId", { valueAsNumber: true })}  type="number" className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
            <p className="text-red-500 text-sm">{errors.companyId?.message}</p>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#10b981] text-white font-semibold py-2 rounded hover:bg-[#059669] shadow-lg transition cursor-pointer"
            >
              {loading ? 'Sending Bill...' : 'Send'}
            </button>
          </form>
        </div>
      </>
  );

}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { InvoiceForm } from "@/app/Invoice/types";
import { invoiceValidationSchema } from "@/app/Invoice/validation";

export default function InvoicePage() {
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
      companyName: "",
      utility: "ELECTRICITY",
      month: "",
      dueDate: "",
      value: "",
      role: "COMPANY",
      residence: {
        streetAddress: "",
        flatNumber: "",
        city: "",
        postalCode: "",
        country: "",
      }
    },
  });

  const onSubmit = async (data: InvoiceForm) => {
    try {
      const res = await fetch("http://localhost:8080/api/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send invoice");
      setSuccess("Invoice sent successfully!");
      setError("");
      reset();
    } catch (err) {
      setError("Failed to send invoice");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-r from-purple-500 to-cyan-400 py-10 overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-center text-xl font-semibold">Create Bill Invoice</h2>
        <h2 className="text-xl font-semibold mb-2">Bill Details</h2>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <label className="text-gray-700">Company Name</label>
        <input {...register("companyName")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.companyName?.message}</p>

        <label className="text-gray-700">Select Utility</label>
        <select {...register("utility")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200">
          <option value="ELECTRICITY">Electricity</option>
          <option value="WATER">Water</option>
          <option value="INTERNET">Internet</option>
        </select>
        <p className="text-red-500 text-sm">{errors.utility?.message}</p>

        <label className="text-gray-700">Month</label>
        <input {...register("month")} placeholder="eg.10.25" className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.month?.message}</p>

        <label className="text-gray-700">Due Date</label>
        <input type="date" {...register("dueDate")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200 cursor-pointer" />
        <p className="text-red-500 text-sm">{errors.dueDate?.message}</p>

        <label className="text-gray-700">Value</label>
        <input {...register("value")}  type="number" className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.value?.message}</p>

        <h3 className="text-lg font-semibold">Residence</h3>

        <label className="text-gray-700">Street Address</label>
        <input {...register("residence.streetAddress")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.residence?.streetAddress?.message}</p>

        <label className="text-gray-700">Flat Number</label>
        <input {...register("residence.flatNumber")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.residence?.flatNumber?.message}</p>

        <label className="text-gray-700">City</label>
        <input {...register("residence.city")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.residence?.city?.message}</p>

        <label className="text-gray-700">Postal Code</label>
        <input {...register("residence.postalCode")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200" />
        <p className="text-red-500 text-sm">{errors.residence?.postalCode?.message}</p>

        <label className="text-gray-700">Country</label>
        <input {...register("residence.country")} className="w-full border focus:outline-none p-2 rounded bg-gray-100 border-gray-200"/>
        <p className="text-red-500 text-sm">{errors.residence?.country?.message}</p>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}

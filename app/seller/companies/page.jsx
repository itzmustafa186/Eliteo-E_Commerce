"use client";

import { useEffect, useState } from "react";
import { addCompany, getCompanies } from "@/app/actions/company";

export default function CompaniesPage() {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const loadCompanies = async () => {
        try {
            const result = await getCompanies();

            if (result.success) {
                setCompanies(result.companies);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

   

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setLogo(file);

        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter company name");
            return;
        }

        if (!logo) {
            alert("Please select a company logo");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("logo", logo);

            const result = await addCompany(formData);

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert(result.message);

            setName("");
            setLogo(null);
            setLogoPreview("");

            e.target.reset();

            await loadCompanies();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

     useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCompanies();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f8f7] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                        Eliteo Admin
                    </p>

                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
                        Companies
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage the brands and companies available on your store.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

                    {/* Add Company */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit">

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Add Company
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Create a new company for your products.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Ronin"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                    required
                                />
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Logo
                                </label>

                                <label className="group relative flex flex-col items-center justify-center w-full h-44 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer transition hover:border-gray-400 hover:bg-gray-100">

                                    {logoPreview ? (
                                        <div className="relative w-full h-full flex items-center justify-center p-5">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="max-h-full max-w-full object-contain"
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl">
                                                <span className="text-white text-sm font-medium">
                                                    Change Logo
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3">
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    className="text-gray-500"
                                                >
                                                    <path d="M12 16V4" />
                                                    <path d="m7 9 5-5 5 5" />
                                                    <path d="M20 16.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2.5" />
                                                </svg>
                                            </div>

                                            <p className="text-sm font-medium text-gray-700">
                                                Upload company logo
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG or WEBP
                                            </p>
                                        </>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 rounded-xl bg-gray-900 text-white text-sm font-medium transition hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Adding Company...
                                    </span>
                                ) : (
                                    "Add Company"
                                )}
                            </button>

                        </form>
                    </div>

                    {/* Companies List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                        {/* List Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    All Companies
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {companies.length}{" "}
                                    {companies.length === 1
                                        ? "company"
                                        : "companies"}{" "}
                                    available
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-700 font-semibold">
                                {companies.length}
                            </div>

                        </div>

                        {/* Loading */}
                        {fetching ? (
                            <div className="p-6 space-y-4">

                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4 animate-pulse"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-gray-100" />

                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-100 rounded w-32 mb-2" />
                                            <div className="h-3 bg-gray-100 rounded w-20" />
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : companies.length === 0 ? (

                            /* Empty State */
                            <div className="py-16 px-6 text-center">

                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="text-gray-400"
                                    >
                                        <path d="M3 21h18" />
                                        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                                        <path d="M9 7h1" />
                                        <path d="M14 7h1" />
                                        <path d="M9 11h1" />
                                        <path d="M14 11h1" />
                                    </svg>
                                </div>

                                <h3 className="font-medium text-gray-900">
                                    No companies yet
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Add your first company using the form.
                                </p>

                            </div>

                        ) : (

                            /* Company List */
                            <div className="divide-y divide-gray-100">

                                {companies.map((company) => (
                                    <div
                                        key={company._id}
                                        className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                                    >

                                        <div className="flex items-center gap-4 min-w-0">

                                            {/* Logo */}
                                            <div className="w-14 h-14 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">

                                                {company.logo ? (
                                                    <img
                                                        src={company.logo}
                                                        alt={company.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-semibold text-gray-400">
                                                        {company.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </span>
                                                )}

                                            </div>

                                            {/* Details */}
                                            <div className="min-w-0">

                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {company.name}
                                                </h3>

                                                <p className="text-sm text-gray-400 mt-0.5 truncate">
                                                    /{company.slug}
                                                </p>

                                            </div>

                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-2 shrink-0">

                                            <span className="w-2 h-2 rounded-full bg-green-500" />

                                            <span className="text-sm text-gray-600 hidden sm:block">
                                                Active
                                            </span>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
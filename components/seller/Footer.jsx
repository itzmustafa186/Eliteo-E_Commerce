import React from 'react'

const SellerFooter = () => {
  return (
    <footer className="mt-auto border-t bg-white px-6 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-bold text-gray-900">
            Eliteo Seller Dashboard
          </h3>

          <p className="text-sm text-gray-500">
            Manage your store efficiently.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <button className="hover:text-orange-600">
            Privacy
          </button>

          <button className="hover:text-orange-600">
            Terms
          </button>

          <button className="hover:text-orange-600">
            Support
          </button>
        </div>

        <p className="text-sm text-gray-400">
          © 2026 Eliteo
        </p>
      </div>
    </footer>
  )
}

export default SellerFooter

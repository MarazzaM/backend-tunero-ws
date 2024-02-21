import React from 'react'

function TotemNav() {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-white text-lg font-bold">Logo</span>
        </div>
        {/* Right side content (you can add additional links or components here) */}
        <div>
          {/* Add your additional links or components here */}
        </div>
      </div>
    </nav>
  )
}

export default TotemNav
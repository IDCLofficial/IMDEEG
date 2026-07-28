'use client';

import Image from 'next/image';

export function BroadbandInfrastructureSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Broadband Infrastructure Data</h2>
          <p className="text-gray-600">Analysis of broadband infrastructure deployment and financial investment</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CAPEX Chart */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">CAPEX by Telco/Menco</h3>
              <p className="text-sm text-gray-600 mt-1">Capital expenditure distribution</p>
            </div>
            <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center">
              <Image
                src="/images/_CAPEX  BY TELCO_MENCO.png"
                alt="CAPEX by Telco/Menco Chart"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">Source: Field Survey August 2024 - June 2026</p>
            </div>
          </div>

          {/* Percentage Distribution Chart */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">FTH vs FTT Distribution</h3>
              <p className="text-sm text-gray-600 mt-1">Percentage distribution of fiber technology types</p>
            </div>
            <div className="relative w-full h-96 bg-gray-100 flex items-center justify-center">
              <Image
                src="/images/PERCENTAGE DISTRIBUTION of FTH Vs FTT.png"
                alt="Percentage Distribution of FTH Vs FTT"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">Source: Field Survey August 2024 - June 2026</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-gray-600 text-sm font-medium mb-3">Key Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Survey Period</span>
                <span className="font-semibold text-gray-900">Aug 2024 - Jun 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Focus Areas</span>
                <span className="font-semibold text-gray-900">Fiber Infrastructure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Deployment Types</span>
                <span className="font-semibold text-gray-900">FTH & FTT</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-gray-600 text-sm font-medium mb-3">Data Coverage</h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                This data encompasses broadband infrastructure investment across Imo State, analyzing capital expenditure patterns and fiber deployment strategies.
              </p>
              <p className="text-xs text-gray-500 mt-4">Source: Field Survey August 2024 - June 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

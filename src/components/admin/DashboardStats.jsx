import React from 'react'

const DashboardStats = ({ stats }) => {
  const icons = {
    'Total Sales': '💰',
    'Total Orders': '📦',
    'Total Customers': '👥',
    'Total Products': '📦',
    'Pending Orders': '⏳',
    'Low Stock': '⚠️'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="surface flex items-center p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="text-4xl mr-4">
            {icons[stat.label] || '📊'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            {stat.change && (
              <p className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats
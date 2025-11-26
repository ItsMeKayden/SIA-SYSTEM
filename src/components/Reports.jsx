import '../styles/Reports.css';

function Reports() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$33,700',
      subtitle: '+16% from last month',
      icon: '$',
    },
    {
      label: 'Total Orders',
      value: '317',
      subtitle: '+8% from last month',
      icon: '📦',
    },
    {
      label: 'Active Customers',
      value: '156',
      subtitle: '+3 new this month',
      icon: '👥',
    },
    {
      label: 'Avg. Order Value',
      value: '$100',
      subtitle: '+7% from last month',
      icon: '$',
    },
  ];

  const revenueMonths = [
    { month: 'Jan', value: 4500 },
    { month: 'Feb', value: 5200 },
    { month: 'Mar', value: 4800 },
    { month: 'Apr', value: 6200 },
    { month: 'May', value: 5800 },
    { month: 'Jun', value: 6800 },
  ];

  const ordersTrend = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 50 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 65 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 75 },
  ];

  const maxRevenue = Math.max(...revenueMonths.map((m) => m.value));
  const maxOrders = Math.max(...ordersTrend.map((m) => m.value));

  return (
    <section className="reports-section">
      <div className="section-header">
        <h3>Reports & Analytics</h3>
        <p>View business statistics and performance metrics</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <p className="stat-label">{stat.label}</p>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-subtitle">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <div className="chart-header">
            <h4>Revenue Overview</h4>
            <p>Monthly revenue for the last 6 months</p>
          </div>
          <div className="bar-chart">
            <div className="chart-labels">
              <div className="y-axis-labels">
                <div className="y-label">6000</div>
                <div className="y-label">4000</div>
                <div className="y-label">2000</div>
                <div className="y-label">0</div>
              </div>
              <div className="chart-bars">
                {revenueMonths.map((month, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          height: `${(month.value / maxRevenue) * 200}px`,
                        }}
                      ></div>
                    </div>
                    <div className="bar-label">{month.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <h4>Orders Trend</h4>
            <p>Number of orders over time</p>
          </div>
          <div className="line-chart">
            <svg viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              <line
                x1="40"
                y1="50"
                x2="40"
                y2="200"
                stroke="#ddd"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="200"
                x2="480"
                y2="200"
                stroke="#ddd"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text x="20" y="55" fontSize="12" fill="#999">
                80
              </text>
              <text x="20" y="130" fontSize="12" fill="#999">
                40
              </text>
              <text x="20" y="210" fontSize="12" fill="#999">
                0
              </text>

              {/* Line path */}
              <polyline
                points={ordersTrend
                  .map(
                    (month, i) =>
                      `${65 + i * 70},${200 - (month.value / maxOrders) * 150}`
                  )
                  .join(' ')}
                fill="none"
                stroke="#27ae60"
                strokeWidth="2"
              />

              {/* Data points */}
              {ordersTrend.map((month, i) => (
                <circle
                  key={i}
                  cx={65 + i * 70}
                  cy={200 - (month.value / maxOrders) * 150}
                  r="4"
                  fill="#27ae60"
                />
              ))}

              {/* X-axis labels */}
              {ordersTrend.map((month, i) => (
                <text
                  key={i}
                  x={55 + i * 70}
                  y="230"
                  fontSize="12"
                  fill="#999"
                  textAnchor="middle"
                >
                  {month.month}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="generate-reports">
        <h4>Generate Reports</h4>
        <p>Download detailed reports for analysis</p>
        <div className="report-buttons">
          <button className="report-btn">
            <span className="btn-icon">📄</span> Revenue Report
          </button>
          <button className="report-btn">
            <span className="btn-icon">📦</span> Orders Report
          </button>
          <button className="report-btn">
            <span className="btn-icon">👥</span> Customers Report
          </button>
        </div>
      </div>
    </section>
  );
}

export default Reports;

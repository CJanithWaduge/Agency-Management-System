import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp, Zap, CreditCard, ShoppingCart, TrendingDown, Eye } from 'lucide-react';
import '../styles/HistoryChart.css';

export const HistoryChart = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCard, setSelectedCard] = useState('all');

  const cardIcons = {
    'Total Asset Value': TrendingUp,
    'Total Profit': Zap,
    'Total Credit Value': CreditCard,
    'Total Expenses': CreditCard,
    'Today\'s Sales': ShoppingCart,
    'Net Outstanding': TrendingDown
  };

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('monthly_history') || '[]');
    
    if (history.length === 0) return;
    // Group data by month-year and card name
    const groupedData = {};
    history.forEach(entry => {
      const key = `${entry.month} ${entry.year}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          period: key,
          month: entry.month,
          year: entry.year
        };
      }
      groupedData[key][entry.cardName] = entry.value;
    });

    const formattedData = Object.values(groupedData).sort((a, b) => {
      const dateA = new Date(`${a.month} 1, ${a.year}`);
      const dateB = new Date(`${b.month} 1, ${b.year}`);
      return dateA - dateB;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistoryData(formattedData);
  }, []);

  if (historyData.length === 0) {
    return null;
  }

  const cardNames = ['Total Asset Value', 'Total Profit', 'Total Credit Value', 'Total Expenses', 'Today\'s Sales', 'Net Outstanding'];
  const colors = {
    'Total Asset Value': '#0067c0',
    'Total Profit': '#107c10',
    'Total Credit Value': '#c42b1c',
    'Total Expenses': '#ff7a18',
    'Today\'s Sales': '#ffb900',
    'Net Outstanding': '#5c2d91'
  };

  const displayData = selectedCard === 'all' 
    ? historyData 
    : historyData;

  const visibleBars = selectedCard === 'all' 
    ? cardNames 
    : [selectedCard];

  return (
    <div className="history-chart-container">
      <div className="history-header">
        <div className="history-title-section">
          <h3 className="history-title">Monthly History</h3>
          <p className="history-subtitle">{historyData.length} months recorded</p>
        </div>
        <button 
          className="history-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="history-content">
          <div className="history-filter">
            <button 
              className={`filter-btn ${selectedCard === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCard('all')}
            >
              <Eye size={16} />
              All Data
            </button>
            {cardNames.map(name => {
              const IconComponent = cardIcons[name];
              return (
                <button 
                  key={name}
                  className={`filter-btn ${selectedCard === name ? 'active' : ''}`}
                  onClick={() => setSelectedCard(name)}
                  style={{ borderColor: colors[name] }}
                >
                  <IconComponent size={16} />
                  {name.split(' ').slice(0, 2).join(' ')}
                </button>
              );
            })}
          </div>

          <div className="chart-wrapper">
            <div className="bar-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fill: 'var(--text-light)', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--text-light)', fontSize: 12 }}
                    tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-main)'
                    }}
                    formatter={(value) => `Rs. ${value.toLocaleString()}`}
                  />
                  <Legend 
                    wrapperStyle={{ color: 'var(--text-light)' }}
                    height={40}
                  />
                  {visibleBars.map(cardName => (
                    <Bar 
                      key={cardName}
                      dataKey={cardName} 
                      fill={colors[cardName]} 
                      radius={[6, 6, 0, 0]}
                      animationDuration={500}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart for Monthly Profit vs Monthly Expenses */}
            {(historyData.some(d => d['Total Profit'] !== undefined) || historyData.some(d => d['Total Expenses'] !== undefined)) && (
              <div className="line-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="period" tick={{ fill: 'var(--text-light)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'var(--text-light)', fontSize: 12 }} tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-main)'
                      }}
                      formatter={(value) => `Rs. ${value?.toLocaleString?.() || value}`}
                    />
                    <Legend wrapperStyle={{ color: 'var(--text-light)' }} />

                    {historyData.some(d => d['Total Profit'] !== undefined) && (
                      <Line type="monotone" dataKey="Total Profit" stroke={colors['Total Profit'] || '#107c10'} strokeWidth={2} dot={{ r: 3 }} />
                    )}

                    {historyData.some(d => d['Total Expenses'] !== undefined) && (
                      <Line type="monotone" dataKey="Total Expenses" stroke={colors['Total Expenses'] || '#ff7a18'} strokeWidth={2} dot={{ r: 3 }} />
                    )}

                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>

          <div className="history-stats">
            <div className="stat-item">
              <span className="stat-label">Latest Period:</span>
              <span className="stat-value">{displayData[displayData.length - 1].period}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Records:</span>
              <span className="stat-value">{displayData.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

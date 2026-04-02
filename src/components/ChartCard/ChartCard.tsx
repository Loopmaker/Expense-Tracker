import { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { CATEGORIES, fmt } from '../../constant';
import type { Transaction, ChartType } from '../../types';
import './ChartCard.css';

ChartJS.register(ArcElement, Tooltip, BarElement, CategoryScale, LinearScale);

interface ChartCardProps {
  transactions: Transaction[];
}

export function ChartCard({ transactions }: ChartCardProps) {
  const [chartType, setChartType] = useState<ChartType>('doughnut');

  const expenses = transactions.filter((t) => t.amount < 0);

  const byCategory: Record<string, number> = {};
  expenses.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] ?? 0) + Math.abs(t.amount);
  });

  const labels: string[] = [];
  const data: number[] = [];
  const colors: string[] = [];

  Object.entries(byCategory).forEach(([catId, total]) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    labels.push(cat ? cat.label : catId);
    data.push(total);
    colors.push(cat ? cat.color : '#6b7280');
  });

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.map((c) => `${c}cc`),
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: chartType === 'bar' ? 6 : 0,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false as const },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => ` ${fmt(ctx.raw as number)}`,
        },
      },
    },
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: '65%',
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b6e80', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: {
          color: '#6b6e80',
          font: { size: 11 },
          callback: (v: string | number) => `₱${Number(v).toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="card-header">
        <h2>Spending Overview</h2>
        <div className="chart-toggle">
          <button
            className={`toggle-btn ${chartType === 'doughnut' ? 'active' : ''}`}
            onClick={() => setChartType('doughnut')}
          >
            Distribution
          </button>
          <button
            className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            Category List
          </button>
        </div>
      </div>

      <div className="chart-wrap">
        {expenses.length === 0 ? (
          <p className="chart-empty">No expense data yet</p>
        ) : chartType === 'doughnut' ? (
          <Doughnut data={chartData} options={doughnutOptions} />
        ) : (
          <Bar data={chartData} options={barOptions} />
        )}
      </div>

      {expenses.length > 0 && (
        <div className="chart-legend">
          {labels.map((label, i) => (
            <div className="legend-item" key={label}>
              <span className="legend-dot" style={{ background: colors[i] }} />
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

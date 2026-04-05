import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodData {
  date: string;
  avg_mood: number;
  entries: number;
}

const moodLabels: Record<number, string> = {
  1: 'Awful',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-date">{label}</p>
        <p className="chart-tooltip-mood">
          Avg mood: {mood} ({moodLabels[Math.round(mood)] || ''})
        </p>
        <p className="chart-tooltip-count">{payload[0].payload.entries} entries</p>
      </div>
    );
  }
  return null;
}

export default function MoodChart({ data }: { data: MoodData[] }) {
  if (data.length === 0) {
    return <div className="chart-empty">No mood data yet. Start tracking your mood!</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }}
          tickFormatter={(v) => moodLabels[v] || ''} width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone" dataKey="avg_mood" stroke="#6c63ff"
          strokeWidth={3} dot={{ r: 5, fill: '#6c63ff' }}
          activeDot={{ r: 7, fill: '#6c63ff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Equipment, Prediction } from '@/types';
import { predictionAPI } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PredictionChartProps {
  equipments: Equipment[];
}

export function PredictionChart({ equipments }: PredictionChartProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const allPredictions = await predictionAPI.getAll();
        setPredictions(allPredictions);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Group predictions by equipment and date
  const chartData = equipments.map((equipment) => {
    const equipmentPredictions = predictions.filter(
      (p) => p.equipment_id === equipment.id
    );
    const data = equipmentPredictions.map((p) => ({
      date: new Date(p.prediction_date).toLocaleDateString(),
      [equipment.name]: p.predicted_consumption,
    }));
    return { equipment, data };
  });

  if (loading) {
    return (
      <Card title="Consumption Predictions">
        <p className="text-gray-500">Loading predictions...</p>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card title="Consumption Predictions">
        <p className="text-gray-500 text-sm">No predictions available yet</p>
      </Card>
    );
  }

  return (
    <Card title="Consumption Predictions (Next 7 Days)">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData[0]?.data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {equipments.slice(0, 3).map((equipment, index) => {
            const colors = ['#0ea5e9', '#10b981', '#f59e0b'];
            return (
              <Line
                key={equipment.id}
                type="monotone"
                dataKey={equipment.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}


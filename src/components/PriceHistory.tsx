import { ProductPrice } from "@prisma/client";
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  data: (ProductPrice & { storeName?: string })[];
  days?: number;
};

const PriceHistory: React.FC<Props> = ({ data, days = 14 }) => {
  const labels = useMemo(() => {
    const result: string[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const day = new Date(new Date().setDate(today.getDate() - i));

      result.push(
        `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
      );
    }

    return result.reverse();
  }, [days]);

  const goodData = useMemo(() => {
    const transformed = data.map((item) => {
      const date = new Date(item.createdAt);

      return {
        ...item,
        createdAt: `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`,
      };
    });

    return labels.map((label) => {
      // priser på denne dagen
      const matches = transformed.filter((item) => item.createdAt === label);
      const lowestPriceMatch = matches
        .map((match) => Number(match.amount))
        .reduce((prev, curr) => (curr > prev ? curr : prev), 0);

      return lowestPriceMatch;
    });
  }, [data, labels]);

  return (
    <div className="h-64">
      <Line
        options={{
          responsive: true,
          plugins: {
            filler: {
              propagate: false,
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                labelColor(item) {
                  return {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    borderWidth: 0,
                  };
                },
                label(item) {
                  return `${item.formattedValue} NOK`;
                },
                footer(item) {
                  console.log({ item });
                  return "BUTIKK_NAVN?";
                },
              },
            },
          },
          elements: {
            point: {
              radius: 3,
            },
          },
          scales: {
            x: {
              grid: {
                // color: "transparent",
              },
              ticks: {
                // display: false,
              },
            },
            y: {
              grid: {
                // color: "transparent",
              },
              ticks: {
                callback(tickValue, index, ticks) {
                  return `${tickValue} NOK`;
                },
                // display: false,
              },
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: "Pris",
              data: goodData,
              borderColor: "skyblue",
              backgroundColor: "skyblue",
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default PriceHistory;

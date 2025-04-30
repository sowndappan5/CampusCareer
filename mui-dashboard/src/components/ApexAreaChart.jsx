import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

export default function ApexAreaChart() {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    tooltip: { enabled: true, x: { show: false } },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#915eff",
        gradientToColors: ["#915eff"],
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      colors: ["#915eff"], // 🔵 Updated line color
    },
    grid: { show: false },
    series: [
      {
        name: "Score",
        data: [],
        color: "#915eff", // 🔵 Updated series color
      },
    ],
    xaxis: {
      categories: [],
      labels: { show: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: true },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/api/combine");
        const data = await response.json();
        if (!data.error) {
          setLabels(data.labels);
          setValues(data.values);
          setChartOptions((prevOptions) => ({
            ...prevOptions,
            series: [
              {
                name: "Score",
                data: data.values,
                color: "#915eff", // 🔵 Make sure this matches
              },
            ],
            xaxis: {
              categories: data.labels,
              labels: { show: true },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
          }));
        } else {
          console.error("API error:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div id="area-chart">
      {labels.length > 0 && values.length > 0 ? (
        <>
          <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="area"
            height="280"
          />

          <div style={{ fontSize: 16, marginLeft: 20, color: "#555" }}>
            <p>
              <strong>Total assessment score:</strong> 100
            </p>

            <p>
              <strong>Today score:</strong>{" "}
              {values[values.length - 1] !== undefined
                ? values[values.length - 1]
                : "N/A"}
            </p>

            <p>
              <strong>Best score:</strong>{" "}
              {(() => {
                const maxScore = Math.max(...values);
                const maxIndex = values.indexOf(maxScore);
                const bestDay = labels[maxIndex];
                return `${maxScore} (Day ${bestDay})`;
              })()}
            </p>
          </div>
        </>
      ) : (
        <div>Loading chart data...</div>
      )}
    </div>
  );
}

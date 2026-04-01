import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import './RacingChart.css';
import { recordAndExportVideo } from '../utils/videoExport';

function RacingChart({ data, product, startYear }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(startYear);
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const recordingRef = useRef(null);

  const years = Object.keys(data.data)
    .map((y) => parseInt(y))
    .sort((a, b) => a - b);

  const endYear = Math.max(...years);
  const totalYears = endYear - startYear + 1;

  // Draw racing bars
  const drawChart = (year) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const yearData = data.data[year];

    if (!yearData) return;

    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dimensions
    const margin = { top: 80, right: 200, bottom: 40, left: 200 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    const barHeight = chartHeight / 10;

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);

    // Draw year title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(year, margin.left + 20, margin.top - 20);

    // Draw product name
    ctx.font = '20px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(`Product: ${product}`, margin.left + 20, margin.top - 20 - 72 - 10);

    // Sort data and get top 10
    const sortedData = [...yearData].sort((a, b) => b.value - a.value).slice(0, 10);

    // Get max value for scaling
    const maxValue = Math.max(...sortedData.map((d) => d.value));

    // Color palette
    const colors = d3.schemeCategory10;

    // Draw bars
    sortedData.forEach((item, index) => {
      const barWidth = (item.value / maxValue) * chartWidth;
      const y = margin.top + index * barHeight;

      // Draw bar
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(margin.left, y + 5, barWidth, barHeight - 10);

      // Draw country name
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(item.area, margin.left - 10, y + barHeight / 2 + 6);

      // Draw value
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#000';
      ctx.fillText(
        item.value.toLocaleString(),
        margin.left + barWidth + 10,
        y + barHeight / 2 + 6
      );
    });

    // Draw rank numbers
    sortedData.forEach((_, index) => {
      const y = margin.top + index * barHeight;
      ctx.fillStyle = '#999';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`#${index + 1}`, margin.left - 40, y + barHeight / 2 + 6);
    });
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentYear((prev) => {
        if (prev >= endYear) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        setProgress(((next - startYear) / totalYears) * 100);
        return next;
      });
    }, 500); // 0.5 seconds per year

    return () => clearInterval(interval);
  }, [isPlaying, endYear, startYear, totalYears]);

  // Handle canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    canvas.width = 1920; // 1080p width
    canvas.height = 1080; // 1080p height
  }, []);

  // Draw current frame
  useEffect(() => {
    drawChart(currentYear);
  }, [currentYear, product, data]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentYear(startYear);
    setProgress(0);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentYear(startYear);
    setProgress(0);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await recordAndExportVideo(
        canvasRef.current,
        years,
        {
          width: 1920,
          height: 1080,
          fps: 30
        },
        {
          product,
          startYear
        }
      );
    } catch (error) {
      console.error('Export failed:', error);
      alert('Video export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="racing-chart-container">
      <div className="controls">
        <button
          className="control-btn play-btn"
          onClick={handlePlay}
          disabled={isPlaying || isExporting}
        >
          ▶ Play
        </button>
        <button
          className="control-btn reset-btn"
          onClick={handleReset}
          disabled={isExporting}
        >
          ⏹ Reset
        </button>
        <button
          className="control-btn export-btn"
          onClick={handleExport}
          disabled={isPlaying || isExporting}
        >
          {isExporting ? '⏳ Exporting...' : '💾 Export Video'}
        </button>

        <div className="progress-info">
          Year {currentYear} / {endYear}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="racing-canvas"
        style={{
          maxWidth: '100%',
          height: 'auto',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      />

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default RacingChart;

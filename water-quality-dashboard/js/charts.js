function drawChart(samples) {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');

  const limits = { arsenic: 10, lead: 10, mercury: 6 };
  const labels = ['Arsénico', 'Plomo', 'Mercurio'];
  const keys = ['arsenic', 'lead', 'mercury'];
  const colors = ['#38bdf8', '#818cf8', '#34d399'];
  const limitColor = '#f43f5e';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (samples.length === 0) return;

  const latest = samples[samples.length - 1];
  const values = keys.map(k => parseFloat(latest[k]));
  const maxVal = Math.max(...values, ...Object.values(limits)) * 1.3;

  const padding = { top: 30, right: 20, bottom: 50, left: 45 };
  const chartW = canvas.width - padding.left - padding.right;
  const chartH = canvas.height - padding.top - padding.bottom;
  const barW = chartW / (labels.length * 2);

  // Eje Y
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + chartH - (i / 5) * chartH;
    const val = ((i / 5) * maxVal).toFixed(1);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartW, y);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Segoe UI';
    ctx.fillText(val, 5, y + 4);
  }

  // Barras y límites
  labels.forEach((label, i) => {
    const x = padding.left + i * (chartW / labels.length) + barW * 0.3;
    const barH = (values[i] / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();

    // Línea de límite
    const limitY = padding.top + chartH - (limits[keys[i]] / maxVal) * chartH;
    ctx.strokeStyle = limitColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(x - 5, limitY);
    ctx.lineTo(x + barW + 5, limitY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Etiqueta del eje X
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + barW / 2, padding.top + chartH + 20);

    // Valor encima de la barra
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(values[i], x + barW / 2, y - 6);
  });

  // Leyenda
  ctx.fillStyle = limitColor;
  ctx.fillRect(padding.left, 8, 16, 3);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Segoe UI';
  ctx.textAlign = 'left';
  ctx.fillText('— Límite OMS', padding.left + 20, 14);
}
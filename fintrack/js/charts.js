function drawChart(transactions) {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const last7 = transactions.slice(-7);

  if (last7.length === 0) {
    ctx.fillStyle = '#475569';
    ctx.font = '14px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Aún no hay transacciones para mostrar', canvas.width / 2, canvas.height / 2);
    return;
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = canvas.width - padding.left - padding.right;
  const chartH = canvas.height - padding.top - padding.bottom;

  const amounts = last7.map(t => t.type === 'deposit' ? t.amount : -t.amount);
  const maxVal = Math.max(...amounts.map(Math.abs)) * 1.3 || 100;

  const colors = {
    deposit: '#22c55e',
    withdrawal: '#ef4444',
    transfer: '#f59e0b'
  };

  // Línea de cero
  const zeroY = padding.top + chartH / 2;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, zeroY);
  ctx.lineTo(padding.left + chartW, zeroY);
  ctx.stroke();

  // Línea de conexión
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();

  last7.forEach((t, i) => {
    const x = padding.left + (i / (last7.length - 1 || 1)) * chartW;
    const val = t.type === 'deposit' ? t.amount : -t.amount;
    const y = zeroY - (val / maxVal) * (chartH / 2);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Puntos
  last7.forEach((t, i) => {
    const x = padding.left + (i / (last7.length - 1 || 1)) * chartW;
    const val = t.type === 'deposit' ? t.amount : -t.amount;
    const y = zeroY - (val / maxVal) * (chartH / 2);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = colors[t.type];
    ctx.fill();

    // Etiqueta de monto
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(`$${t.amount.toFixed(0)}`, x, y - 12);

    // Etiqueta de fecha
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Segoe UI';
    ctx.fillText(t.date, x, padding.top + chartH + 25);
  });
}
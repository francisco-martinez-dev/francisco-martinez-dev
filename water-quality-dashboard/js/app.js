const samples = [];

const limits = { arsenic: 10, lead: 10, mercury: 6 };

function getRiskLevel(sample) {
  const checks = [
    sample.arsenic > limits.arsenic,
    sample.lead > limits.lead,
    sample.mercury > limits.mercury,
  ];
  const exceeded = checks.filter(Boolean).length;
  if (exceeded === 0) return 'safe';
  if (exceeded === 1) return 'warning';
  return 'danger';
}

function getRiskLabel(level) {
  const labels = {
    safe: '✅ Niveles seguros — dentro de los límites OMS',
    warning: '⚠️ Precaución — un contaminante supera el límite OMS',
    danger: '🚨 Peligro — múltiples contaminantes superan el límite OMS',
  };
  return labels[level];
}

function renderTable() {
  const container = document.getElementById('recordsTable');
  if (samples.length === 0) {
    container.innerHTML = '';
    return;
  }

  const rows = samples.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${s.location}</td>
      <td>${s.date}</td>
      <td>${s.arsenic} µg/L</td>
      <td>${s.lead} µg/L</td>
      <td>${s.mercury} µg/L</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Ubicación</th>
          <th>Fecha</th>
          <th>Arsénico</th>
          <th>Plomo</th>
          <th>Mercurio</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function updateRiskIndicator(sample) {
  const box = document.getElementById('riskIndicator');
  const label = document.getElementById('riskLabel');
  const level = getRiskLevel(sample);

  box.className = `risk-box ${level}`;
  label.textContent = getRiskLabel(level);
}

document.getElementById('sampleForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const sample = {
    location: document.getElementById('location').value.trim(),
    date: document.getElementById('date').value,
    arsenic: parseFloat(document.getElementById('arsenic').value),
    lead: parseFloat(document.getElementById('lead').value),
    mercury: parseFloat(document.getElementById('mercury').value),
  };

  samples.push(sample);
  updateRiskIndicator(sample);
  drawChart(samples);
  renderTable();
  this.reset();
});
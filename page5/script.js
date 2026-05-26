const alphaSlider = document.getElementById("alphaSlider");
const betaSlider = document.getElementById("betaSlider");
const alphaValue = document.getElementById("alphaValue");
const betaValue = document.getElementById("betaValue");
const parameterBadge = document.getElementById("parameterBadge");
const parameterSetsEl = document.getElementById("parameterSets");
const addSetButton = document.getElementById("addSetButton");
const removeSetButton = document.getElementById("removeSetButton");
const formulaEl = document.getElementById("formula");
const canvas = document.getElementById("plotCanvas");
const ctx = canvas.getContext("2d");

const T_MIN = 0;
const T_MAX = 15;
const Y_MIN = 0;
const Y_MAX = 6;
const SAMPLE_COUNT = 1200;
const CURVE_COLORS = [
  "#118ed6",
  "#e85d75",
  "#2f9e44",
  "#f08c00",
  "#7048e8",
  "#0ca678",
  "#d6336c",
  "#364fc7"
];

let parameterSets = [
  { id: 1, alpha: 1.0, beta: 0.5, color: CURVE_COLORS[0] }
];
let activeSetId = 1;
let nextSetId = 2;

function kel(T, alpha, beta) {
  if (T <= 0) return 0;
  return 1 / (beta / T + alpha * T * T);
}

function formatValue(value) {
  return Number(value).toFixed(1);
}

function getActiveSet() {
  return parameterSets.find((set) => set.id === activeSetId) || parameterSets[0];
}

function updateFormula() {
  const latex = String.raw`K_{el}=\frac{1}{\frac{\beta}{T}+\alpha T^{2}}`;
  if (window.katex) {
    katex.render(latex, formulaEl, {
      throwOnError: false,
      displayMode: true
    });
  } else {
    formulaEl.textContent = "K_el = 1 / (beta/T + alpha*T^2)";
  }
}

function buildCurve(alpha, beta) {
  const points = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const T = T_MIN + (T_MAX - T_MIN) * i / (SAMPLE_COUNT - 1);
    let y = kel(T, alpha, beta);
    if (!Number.isFinite(y) || y < Y_MIN) y = Y_MIN;
    if (y > Y_MAX) y = Y_MAX;
    points.push({ T, y });
  }
  return points;
}

function drawBackground(layout) {
  const { left, top, width, height } = layout;
  const gradient = ctx.createLinearGradient(0, top, 0, top + height);
  gradient.addColorStop(0, "#fcfeff");
  gradient.addColorStop(1, "#edf8ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(left, top, width, height);
}

function drawGrid(layout) {
  const { left, right, top, bottom, width, height } = layout;

  ctx.save();
  ctx.strokeStyle = "rgba(17, 142, 214, 0.16)";
  ctx.lineWidth = 1.2;

  for (let xTick = 0; xTick <= 15; xTick += 3) {
    const x = left + (xTick / T_MAX) * width;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  for (let yTick = 0; yTick <= 6; yTick += 1) {
    const y = bottom - (yTick / Y_MAX) * height;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawAxes(layout) {
  const { left, bottom, top, width, height } = layout;

  ctx.save();
  ctx.strokeStyle = "#118ed6";
  ctx.lineWidth = 2.6;
  ctx.strokeRect(left, top, width, height);

  ctx.fillStyle = "#11364f";
  ctx.font = '22px "Segoe UI", "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  for (let xTick = 0; xTick <= 15; xTick += 3) {
    const x = left + (xTick / T_MAX) * width;
    ctx.beginPath();
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, bottom - 12);
    ctx.stroke();
    ctx.fillText(String(xTick), x, bottom + 12);
  }

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let yTick = 0; yTick <= 6; yTick += 1) {
    const y = bottom - (yTick / Y_MAX) * height;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + 12, y);
    ctx.stroke();
    ctx.fillText(String(yTick), left - 14, y);
  }

  ctx.font = '26px "Segoe UI", "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("温度 T / K", left + width / 2, canvas.height - 44);

  ctx.save();
  ctx.translate(36, top + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("K_el", 0, 0);
  ctx.restore();

  ctx.restore();
}

function drawCurve(points, layout, color, isActive) {
  const { left, bottom, width, height } = layout;

  ctx.save();
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = left + (point.T / T_MAX) * width;
    const y = bottom - ((point.y - Y_MIN) / (Y_MAX - Y_MIN)) * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = color;
  ctx.lineWidth = isActive ? 4.8 : 3.4;
  ctx.globalAlpha = isActive ? 1 : 0.76;
  ctx.shadowColor = isActive ? `${color}44` : "transparent";
  ctx.shadowBlur = isActive ? 12 : 0;
  ctx.stroke();
  ctx.restore();
}

function drawLegend(layout) {
  const lineHeight = 28;
  const width = 260;
  const height = 24 + parameterSets.length * lineHeight;
  const x = layout.right - width - 18;
  const y = layout.top + 18;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.strokeStyle = "rgba(17, 142, 214, 0.18)";
  ctx.lineWidth = 1.2;
  roundRect(x, y, width, height, 14);
  ctx.fill();
  ctx.stroke();

  ctx.font = '16px "Segoe UI", "Microsoft YaHei", sans-serif';
  ctx.textBaseline = "middle";
  parameterSets.forEach((set, index) => {
    const itemY = y + 24 + index * lineHeight;
    ctx.strokeStyle = set.color;
    ctx.lineWidth = set.id === activeSetId ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(x + 16, itemY);
    ctx.lineTo(x + 54, itemY);
    ctx.stroke();

    ctx.fillStyle = set.id === activeSetId ? "#11364f" : "#527b94";
    ctx.textAlign = "left";
    ctx.fillText(
      `组 ${index + 1}: α=${formatValue(set.alpha)}, β=${formatValue(set.beta)}`,
      x + 66,
      itemY
    );
  });
  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawFigure() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const layout = {
    left: 108,
    right: canvas.width - 36,
    top: 24,
    bottom: canvas.height - 88
  };
  layout.width = layout.right - layout.left;
  layout.height = layout.bottom - layout.top;

  drawBackground(layout);
  drawGrid(layout);
  drawAxes(layout);
  parameterSets.forEach((set) => {
    drawCurve(buildCurve(set.alpha, set.beta), layout, set.color, set.id === activeSetId);
  });
  drawLegend(layout);
}

function renderParameterSets() {
  parameterSetsEl.innerHTML = "";

  parameterSets.forEach((set, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `set-card${set.id === activeSetId ? " active" : ""}`;
    button.dataset.id = String(set.id);
    button.innerHTML = `
      <span class="set-color" style="background: ${set.color}"></span>
      <span class="set-name">组 ${index + 1}</span>
      <span class="set-values">α=${formatValue(set.alpha)} / β=${formatValue(set.beta)}</span>
    `;
    button.addEventListener("click", () => {
      activeSetId = set.id;
      refresh({ syncFromActive: true });
    });
    parameterSetsEl.appendChild(button);
  });
}

function syncControlsFromActiveSet() {
  const activeSet = getActiveSet();
  alphaSlider.value = String(activeSet.alpha);
  betaSlider.value = String(activeSet.beta);
  alphaValue.textContent = formatValue(activeSet.alpha);
  betaValue.textContent = formatValue(activeSet.beta);
  removeSetButton.disabled = parameterSets.length === 1;
}

function updateActiveSetFromControls() {
  const activeSet = getActiveSet();
  activeSet.alpha = Number(alphaSlider.value);
  activeSet.beta = Number(betaSlider.value);
}

function addParameterSet() {
  const activeSet = getActiveSet();
  const color = CURVE_COLORS[(nextSetId - 1) % CURVE_COLORS.length];
  const newSet = {
    id: nextSetId,
    alpha: Math.min(5, Number((activeSet.alpha + 0.4).toFixed(1))),
    beta: Math.min(10, Number((activeSet.beta + 0.5).toFixed(1))),
    color
  };

  nextSetId += 1;
  parameterSets.push(newSet);
  activeSetId = newSet.id;
  refresh({ syncFromActive: true });
}

function removeActiveSet() {
  if (parameterSets.length === 1) return;

  const activeIndex = parameterSets.findIndex((set) => set.id === activeSetId);
  parameterSets = parameterSets.filter((set) => set.id !== activeSetId);
  const nextActive = parameterSets[Math.max(0, activeIndex - 1)];
  activeSetId = nextActive.id;
  refresh({ syncFromActive: true });
}

function refresh(options = {}) {
  if (!options.syncFromActive) {
    updateActiveSetFromControls();
  }

  syncControlsFromActiveSet();
  renderParameterSets();
  parameterBadge.textContent = `共 ${parameterSets.length} 组参数`;

  updateFormula();
  drawFigure();
}

[alphaSlider, betaSlider].forEach((slider) => {
  slider.addEventListener("input", () => refresh());
});

addSetButton.addEventListener("click", addParameterSet);
removeSetButton.addEventListener("click", removeActiveSet);

window.addEventListener("load", () => {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "$$", right: "$$", display: true }
      ],
      throwOnError: false
    });
  }
  refresh({ syncFromActive: true });
});

/* ---------------------------------------------------------
   SMART PAYMENTS INFRASTRUCTURE — STRIPE‑STYLE LOGIC
   --------------------------------------------------------- */

/* ---------------------------------------------------------
   ACQUIRER DATA (REALISTIC, STRIPE‑QUALITY)
   --------------------------------------------------------- */

const scenarios = {
  normal: {
    description: "Normal operating conditions. Acquirer A leads on latency and approval rate.",
    acquirers: [
      { name: "Acquirer A", latency: 180, approval: 94.8, mdr: 1.82, share: 62, status: "Healthy" },
      { name: "Acquirer B", latency: 240, approval: 93.1, mdr: 1.95, share: 28, status: "Healthy" },
      { name: "Acquirer C", latency: 310, approval: 91.4, mdr: 2.10, share: 10, status: "Healthy" }
    ],
    approvalsText: "Approval rate improves from 91.2% to 94.8% with routing.",
    mdrText: "Blended MDR drops from 2.10% to 1.82%."
  },

  outage: {
    description: "Acquirer A is experiencing a partial outage. Routing shifts to B and C.",
    acquirers: [
      { name: "Acquirer A", latency: 900, approval: 40.0, mdr: 1.82, share: 5, status: "Outage" },
      { name: "Acquirer B", latency: 260, approval: 92.8, mdr: 1.95, share: 65, status: "Healthy" },
      { name: "Acquirer C", latency: 330, approval: 91.0, mdr: 2.10, share: 30, status: "Healthy" }
    ],
    approvalsText: "Routing avoids Acquirer A outage, preserving a 92.4% approval rate.",
    mdrText: "MDR rises slightly due to fallback mix, but uptime is maintained."
  },

  cost: {
    description: "Acquirer C raises MDR. Routing shifts toward A and B to reduce cost.",
    acquirers: [
      { name: "Acquirer A", latency: 185, approval: 94.7, mdr: 1.82, share: 68, status: "Healthy" },
      { name: "Acquirer B", latency: 245, approval: 93.0, mdr: 1.95, share: 27, status: "Healthy" },
      { name: "Acquirer C", latency: 315, approval: 91.2, mdr: 2.40, share: 5, status: "Expensive" }
    ],
    approvalsText: "Approval rate remains stable at 94.1% despite MDR spike.",
    mdrText: "Blended MDR drops from 2.10% to 1.78%."
  }
};


/* ---------------------------------------------------------
   RENDER SCENARIO
   --------------------------------------------------------- */


function highlightButton(type) {
  document.querySelectorAll(".btn-ghost").forEach(btn =>
    btn.classList.remove("btn-ghost-active")
  );
  document.querySelector(`[onclick="setScenario('${type}')"]`)
    .classList.add("btn-ghost-active");
}

function setScenario(type) {
  highlightButton(type);
  renderScenario(scenarios[type]);
}

function renderScenario(scenario) {
  // Update table
  const tbody = document.querySelector("#acquirer-table-advanced tbody");
  tbody.innerHTML = "";

  scenario.acquirers.forEach(acq => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${acq.name}</td>
      <td>${acq.latency} ms</td>
      <td>${acq.approval.toFixed(1)}%</td>
      <td>${acq.mdr.toFixed(2)}%</td>
      <td>${acq.share}%</td>
      <td>${renderStatus(acq.status)}</td>
    `;

    tbody.appendChild(row);
  });

  // Update scenario text
  document.getElementById("scenario-description").textContent = scenario.description;
  document.getElementById("approvals-text").textContent = scenario.approvalsText;
  document.getElementById("mdr-text").textContent = scenario.mdrText;

  // Rebuild routing brain
  initBrain();

  // Stripe-style animations
  animateTableRows();
  animateBrainPills();
  animateScenarioText();
}


function renderStatus(status) {
  if (status === "Healthy") {
    return `<span class="pill pill-good">Healthy</span>`;
  }
  if (status === "Outage") {
    return `<span class="pill pill-bad">Outage</span>`;
  }
  return `<span class="pill pill-warn">${status}</span>`;
}


/* ---------------------------------------------------------
   MERCHANT SAVINGS CALCULATOR
   --------------------------------------------------------- */

function calculateSavings() {
  const volume = parseFloat(document.getElementById("volume").value);
  const mdrCurrent = parseFloat(document.getElementById("mdr-current").value);
  const mdrNew = parseFloat(document.getElementById("mdr-new").value);

  if (isNaN(volume) || isNaN(mdrCurrent) || isNaN(mdrNew)) {
    document.getElementById("savings-result").textContent =
      "Please enter valid numbers for all fields.";
    return;
  }

  const currentCost = volume * (mdrCurrent / 100);
  const newCost = volume * (mdrNew / 100);
  const savings = currentCost - newCost;

  document.getElementById("savings-result").textContent =
    `Estimated annual savings: $${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}


/* ---------------------------------------------------------
   ROUTING BRAIN VISUAL
   --------------------------------------------------------- */

const brainInputs = [
  "Latency score",
  "MDR score",
  "Approval probability",
  "BIN range",
  "Card type",
  "Issuer risk score",
  "Historical performance",
  "Time-of-day patterns",
  "Fraud signals",
  "Fallback readiness"
];

function initBrain() {
  const container = document.getElementById("brain-nodes");
  container.innerHTML = "";

  brainInputs.forEach(input => {
    const node = document.createElement("div");
    node.className = "pill pill-good";
    node.style.marginRight = "6px";
    node.style.marginBottom = "6px";
    node.textContent = input;
    container.appendChild(node);
  });
}

function highlightButton(type) {
  document.querySelectorAll(".btn-ghost").forEach(btn => btn.classList.remove("btn-ghost-active"));
  document.querySelector(`[onclick="setScenario('${type}')"]`).classList.add("btn-ghost-active");
}
/* ---------------------------------------------------------
   STRIPE-STYLE ANIMATION HELPERS
   --------------------------------------------------------- */

function animateTableRows() {
  const rows = document.querySelectorAll("#acquirer-table-advanced tbody tr");
  rows.forEach((row, i) => {
    row.style.opacity = 0;
    setTimeout(() => {
      row.classList.add("table-row-animate");
    }, i * 40); // 40ms stagger
  });
}

function animateBrainPills() {
  const pills = document.querySelectorAll("#brain-nodes .pill");
  pills.forEach((pill, i) => {
    pill.style.opacity = 0;
    setTimeout(() => {
      pill.classList.add("brain-pill-animate");
    }, i * 35); // 35ms stagger
  });
}

function animateScenarioText() {
  ["scenario-description", "approvals-text", "mdr-text"].forEach(id => {
    const el = document.getElementById(id);

    // Reset animation
    el.classList.remove("scenario-fade");
    void el.offsetWidth; // forces reflow so animation can replay

    // Reapply animation
    el.classList.add("scenario-fade");
  });
}



/* ---------------------------------------------------------
   INITIALIZE DEFAULT SCENARIO
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  setScenario("normal");
});

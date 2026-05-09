// Configuration
const DEFAULT_CSV_PATH = '../submission.csv';
const FALLBACK_CSV_PATH = '../sample_submission.csv';

// Global state
let parsedData = {};
let allWells = [];
let chartInstance = null;

// DOM Elements
const wellSelect = document.getElementById('well-select');
const fallbackUploadContainer = document.getElementById('fallback-upload-container');
const csvUpload = document.getElementById('csv-upload');
const loadingIndicator = document.getElementById('loading-indicator');
const ctx = document.getElementById('tvtChart').getContext('2d');

// Metrics DOM Elements
const metricTotalWells = document.getElementById('metric-total-wells');
const metricTotalPreds = document.getElementById('metric-total-preds');
const metricMaxTvt = document.getElementById('metric-max-tvt');
const metricMinTvt = document.getElementById('metric-min-tvt');

// Initialization
async function init() {
    try {
        if (typeof windowCsvData !== 'undefined' && windowCsvData) {
            console.log("Found preprogrammed data.js!");
            processData(windowCsvData);
        } else {
            throw new Error('No preprogrammed data.js found');
        }
    } catch (error) {
        console.error("Error loading data:", error);
        loadingIndicator.textContent = "Please upload a CSV file manually.";
        loadingIndicator.style.color = "#dc2626"; // red
        fallbackUploadContainer.style.display = 'flex';
        wellSelect.disabled = true;
        wellSelect.innerHTML = '<option value="">Awaiting data...</option>';
    }
}

// Manual File Upload Handler
csvUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        loadingIndicator.textContent = "Loading data...";
        loadingIndicator.style.color = "var(--primary-color)";
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            processData(text);
        };
        reader.readAsText(file);
    }
});

// CSV Parsing and Processing
function processData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        alert("The CSV file appears to be empty or invalid.");
        return;
    }

    // Expected format: id,tvt
    // id looks like: 000d7d20_1442
    parsedData = {};
    let totalPredictions = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // Handle potential carriage returns or quotes
        const cleanLine = line.replace(/["\r]/g, '');
        const parts = cleanLine.split(',');
        
        if (parts.length >= 2) {
            const idFull = parts[0].trim();
            const tvtValue = parseFloat(parts[1].trim());
            
            // Extract well ID and index
            const idParts = idFull.split('_');
            if (idParts.length >= 2) {
                const wellId = idParts[0];
                const indexStr = idParts[idParts.length - 1]; // usually the last part is the index
                const index = parseInt(indexStr, 10);
                
                if (!parsedData[wellId]) {
                    parsedData[wellId] = {
                        indices: [],
                        tvts: []
                    };
                }
                
                parsedData[wellId].indices.push(index);
                parsedData[wellId].tvts.push(isNaN(tvtValue) ? 0 : tvtValue);
                totalPredictions++;
            }
        }
    }

    allWells = Object.keys(parsedData).sort();

    if (allWells.length === 0) {
        loadingIndicator.textContent = "No valid data found in CSV.";
        loadingIndicator.style.color = "#dc2626";
        return;
    }

    // Populate dropdown
    wellSelect.innerHTML = '';
    allWells.forEach(well => {
        const option = document.createElement('option');
        option.value = well;
        option.textContent = `Well: ${well}`;
        wellSelect.appendChild(option);
    });

    wellSelect.disabled = false;
    loadingIndicator.textContent = "Data loaded.";
    setTimeout(() => { loadingIndicator.style.display = 'none'; }, 2000);

    // Update global metrics
    metricTotalWells.textContent = allWells.length.toLocaleString();
    metricTotalPreds.textContent = totalPredictions.toLocaleString();

    // Render initial chart
    const firstWell = allWells[0];
    wellSelect.value = firstWell;
    renderChart(firstWell);
}

// Well Selection Handler
wellSelect.addEventListener('change', (e) => {
    const selectedWell = e.target.value;
    if (selectedWell) {
        renderChart(selectedWell);
    }
});

// Chart Rendering
function renderChart(wellId) {
    const data = parsedData[wellId];
    if (!data) return;

    // Sort data by index just in case they are out of order in CSV
    const combined = data.indices.map((idx, i) => ({ index: idx, tvt: data.tvts[i] }));
    combined.sort((a, b) => a.index - b.index);
    
    const sortedIndices = combined.map(item => item.index);
    const sortedTvts = combined.map(item => item.tvt);

    // Update Well-specific metrics
    const maxTvt = Math.max(...sortedTvts);
    const minTvt = Math.min(...sortedTvts);
    metricMaxTvt.textContent = maxTvt.toFixed(4);
    metricMinTvt.textContent = minTvt.toFixed(4);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedIndices,
            datasets: [{
                label: `TVT Drift for ${wellId}`,
                data: sortedTvts,
                borderColor: '#2563eb', // primary color
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleFont: { family: 'Inter', size: 13 },
                    bodyFont: { family: 'Inter', size: 13 },
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `TVT Drift: ${context.parsed.y.toFixed(6)}`;
                        },
                        title: function(tooltipItems) {
                            return `Index: ${tooltipItems[0].label}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Depth Index',
                        font: { family: 'Inter', size: 13, weight: '500' }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'TVT Drift',
                        font: { family: 'Inter', size: 13, weight: '500' }
                    },
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// Start app
init();

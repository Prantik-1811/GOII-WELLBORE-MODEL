let mockCsv = "id,tvt\n";

// Generate random walk data for Well 1
let currentTvt1 = 0;
for (let i = 1000; i < 1200; i++) {
    // Add some random drift
    currentTvt1 += (Math.random() - 0.45) * 0.5;
    mockCsv += `000d7d20_${i},${currentTvt1.toFixed(4)}\n`;
}

// Generate random walk data for Well 2
let currentTvt2 = 12.5;
for (let i = 2400; i < 2800; i++) {
    currentTvt2 += (Math.random() - 0.5) * 0.8;
    mockCsv += `00bbac68_${i},${currentTvt2.toFixed(4)}\n`;
}

// Generate random walk data for Well 3
let currentTvt3 = -5.0;
for (let i = 500; i < 900; i++) {
    currentTvt3 += (Math.random() - 0.55) * 0.3;
    mockCsv += `00e12e8b_${i},${currentTvt3.toFixed(4)}\n`;
}

const windowCsvData = mockCsv;

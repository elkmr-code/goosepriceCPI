// CPI Charts JavaScript for Goose Price Visualization
let cpiTrendChart, chickCpiChart, meatCpiChart;

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing charts...');
    
    // 等待一下讓 Chart.js 完全載入
    setTimeout(() => {
        initializeCharts();
        loadInitialData();
        setupEventListeners();
    }, 500);
});

function initializeCharts() {
    console.log('Initializing charts...');
    
    // 檢查 Chart.js 是否載入
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        document.body.innerHTML += '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: red; color: white; padding: 20px; border-radius: 10px; z-index: 10000;">Chart.js 載入失敗！請檢查網路連線。</div>';
        return;
    }
    
    // 確保所有 canvas 元素存在
    const trendCanvas = document.getElementById('cpiTrendChart');
    const chickCanvas = document.getElementById('chickCpiChart');
    const meatCanvas = document.getElementById('meatCpiChart');
    
    if (!trendCanvas || !chickCanvas || !meatCanvas) {
        console.error('Canvas elements not found!');
        document.body.innerHTML += '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: orange; color: white; padding: 20px; border-radius: 10px; z-index: 10000;">找不到圖表容器！</div>';
        return;
    }
    
    try {
        // 設置 canvas 尺寸
        trendCanvas.style.maxHeight = '400px';
        chickCanvas.style.maxHeight = '300px';
        meatCanvas.style.maxHeight = '300px';
        
        // Main CPI Trend Chart
        const trendCtx = trendCanvas.getContext('2d');
        cpiTrendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '雛鵝價格指數',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }, {
                    label: '鵝肉價格指數',
                    data: [],
                    borderColor: '#f56565',
                    backgroundColor: 'rgba(245, 101, 101, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#f56565',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '鵝價消費者物價指數趨勢',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '年份'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'CPI 指數'
                        }
                    }
                }
            }
        });

        // Chick CPI Chart
        const chickCtx = chickCanvas.getContext('2d');
        chickCpiChart = new Chart(chickCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '雛鵝平均 CPI',
                    data: [],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '年度雛鵝平均價格指數'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CPI 指數'
                        }
                    }
                }
            }
        });

        // Meat CPI Chart
        const meatCtx = meatCanvas.getContext('2d');
        meatCpiChart = new Chart(meatCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '鵝肉平均 CPI',
                    data: [],
                    backgroundColor: 'rgba(245, 101, 101, 0.8)',
                    borderColor: '#f56565',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '年度鵝肉平均價格指數'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'CPI 指數'
                        }
                    }
                }
            }
        });
        
        console.log('Charts initialized successfully!');
        
        // 立即顯示測試數據以確保圖表可見
        showTestData();
        
    } catch (error) {
        console.error('Error initializing charts:', error);
        document.body.innerHTML += '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: red; color: white; padding: 20px; border-radius: 10px; z-index: 10000;">圖表初始化失敗：' + error.message + '</div>';
    }
}

// 添加測試數據以確保圖表顯示
function showTestData() {
    const testYears = ['2020', '2021', '2022', '2023'];
    const testChickData = [98, 102, 105, 108];
    const testMeatData = [95, 100, 103, 106];
    
    console.log('Loading test data...');
    
    // 更新主要趨勢圖
    if (cpiTrendChart) {
        cpiTrendChart.data.labels = testYears;
        cpiTrendChart.data.datasets[0].data = testChickData;
        cpiTrendChart.data.datasets[1].data = testMeatData;
        cpiTrendChart.update();
        console.log('Trend chart updated');
    }
    
    // 更新雛鵝圖表
    if (chickCpiChart) {
        chickCpiChart.data.labels = testYears;
        chickCpiChart.data.datasets[0].data = testChickData;
        chickCpiChart.update();
        console.log('Chick chart updated');
    }
    
    // 更新鵝肉圖表
    if (meatCpiChart) {
        meatCpiChart.data.labels = testYears;
        meatCpiChart.data.datasets[0].data = testMeatData;
        meatCpiChart.update();
        console.log('Meat chart updated');
    }
    
    console.log('Test data loaded into all charts');
}

function setupEventListeners() {
    // Update chart button
    const updateBtn = document.getElementById('updateChart');
    if (updateBtn) {
        updateBtn.addEventListener('click', function() {
            const startYear = document.getElementById('startYear').value;
            const endYear = document.getElementById('endYear').value;
            loadCPIData(startYear, endYear);
        });
    }

    // Load available years for dropdowns
    loadAvailableYears();
    setupExportFunctions();
}

async function loadAvailableYears() {
    try {
        const response = await fetch('/api/years');
        const years = await response.json();

        const startYearSelect = document.getElementById('startYear');
        const endYearSelect = document.getElementById('endYear');

        if (startYearSelect && endYearSelect) {
            // Clear existing options
            startYearSelect.innerHTML = '<option value="">起始年份</option>';
            endYearSelect.innerHTML = '<option value="">結束年份</option>';

            // Add year options
            years.forEach(year => {
                startYearSelect.innerHTML += `<option value="${year}">${year}</option>`;
                endYearSelect.innerHTML += `<option value="${year}">${year}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading years:', error);
    }
}

async function loadInitialData() {
    console.log('Loading initial data...');
    try {
        await loadCPIData();
        await loadSummaryData();
        await updateStatistics();
        await updateInsights();
        updateLastUpdateTime();
        console.log('Initial data loaded successfully');
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

async function loadCPIData(startYear = '', endYear = '') {
    try {
        let url = '/api/goose-cpi?limit=1000';
        if (startYear && endYear) {
            url += `&startYear=${startYear}&endYear=${endYear}`;
        } else if (startYear) {
            url += `&startYear=${startYear}`;
        } else if (endYear) {
            url += `&endYear=${endYear}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            const processedData = processDataForCharts(data);
            updateTrendChart(processedData);
        }

    } catch (error) {
        console.error('Error loading CPI data:', error);
    }
}

async function loadSummaryData() {
    try {
        const response = await fetch('/api/cpi-summary');
        const summaryData = await response.json();

        if (summaryData && summaryData.length > 0) {
            updateSummaryCharts(summaryData);
        }

    } catch (error) {
        console.error('Error loading summary data:', error);
    }
}

function processDataForCharts(data) {
    const groupedData = {};

    data.forEach(item => {
        if (!groupedData[item.year]) {
            groupedData[item.year] = {
                chickCPI: [],
                meatCPI: [],
                count: 0
            };
        }

        if (item.chick_cpi !== null) {
            groupedData[item.year].chickCPI.push(item.chick_cpi);
        }
        if (item.meat_cpi !== null) {
            groupedData[item.year].meatCPI.push(item.meat_cpi);
        }
        groupedData[item.year].count++;
    });

    const years = Object.keys(groupedData).sort();
    const chickCPIData = [];
    const meatCPIData = [];

    years.forEach(year => {
        const yearData = groupedData[year];

        const avgChickCPI = yearData.chickCPI.length > 0
            ? yearData.chickCPI.reduce((a, b) => a + b, 0) / yearData.chickCPI.length
            : null;
        const avgMeatCPI = yearData.meatCPI.length > 0
            ? yearData.meatCPI.reduce((a, b) => a + b, 0) / yearData.meatCPI.length
            : null;

        chickCPIData.push(avgChickCPI);
        meatCPIData.push(avgMeatCPI);
    });

    return {
        years: years,
        chickCPI: chickCPIData,
        meatCPI: meatCPIData
    };
}

function updateTrendChart(data) {
    if (cpiTrendChart) {
        cpiTrendChart.data.labels = data.years;
        cpiTrendChart.data.datasets[0].data = data.chickCPI;
        cpiTrendChart.data.datasets[1].data = data.meatCPI;
        cpiTrendChart.update();
    }
}

function updateSummaryCharts(summaryData) {
    if (chickCpiChart) {
        const chickYears = summaryData.map(item => item.year);
        const chickAvgCPI = summaryData.map(item => item.avg_chick_cpi);
        
        chickCpiChart.data.labels = chickYears;
        chickCpiChart.data.datasets[0].data = chickAvgCPI;
        chickCpiChart.update();
    }

    if (meatCpiChart) {
        const meatYears = summaryData.map(item => item.year);
        const meatAvgCPI = summaryData.map(item => item.avg_meat_cpi);
        
        meatCpiChart.data.labels = meatYears;
        meatCpiChart.data.datasets[0].data = meatAvgCPI;
        meatCpiChart.update();
    }
}

async function updateStatistics() {
    try {
        const [cpiResponse, summaryResponse] = await Promise.all([
            fetch('/api/goose-cpi?limit=10000'),
            fetch('/api/cpi-summary')
        ]);

        const cpiData = await cpiResponse.json();
        const summaryData = await summaryResponse.json();

        // 更新統計卡片
        const totalRecords = document.getElementById('totalRecords');
        const yearRange = document.getElementById('yearRange');
        const avgChickCPI = document.getElementById('avgChickCPI');
        const avgMeatCPI = document.getElementById('avgMeatCPI');

        if (totalRecords) totalRecords.textContent = cpiData.length;

        if (yearRange && summaryData.length > 0) {
            const years = summaryData.map(item => item.year);
            yearRange.textContent = `${Math.min(...years)} - ${Math.max(...years)}`;
        }

        if (avgChickCPI && summaryData.length > 0) {
            const avg = summaryData.reduce((sum, item) => sum + (item.avg_chick_cpi || 0), 0) / summaryData.length;
            avgChickCPI.textContent = avg.toFixed(1);
        }

        if (avgMeatCPI && summaryData.length > 0) {
            const avg = summaryData.reduce((sum, item) => sum + (item.avg_meat_cpi || 0), 0) / summaryData.length;
            avgMeatCPI.textContent = avg.toFixed(1);
        }

    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

async function updateInsights() {
    try {
        const response = await fetch('/api/cpi-summary');
        const data = await response.json();

        if (data.length > 1) {
            const latestYear = data[0];
            const previousYear = data[1];

            const trendInsight = document.getElementById('trendInsight');
            const volatilityInsight = document.getElementById('volatilityInsight');
            const correlationInsight = document.getElementById('correlationInsight');

            if (trendInsight) {
                const chickTrend = latestYear.avg_chick_cpi > previousYear.avg_chick_cpi ? '上升' : '下降';
                const meatTrend = latestYear.avg_meat_cpi > previousYear.avg_meat_cpi ? '上升' : '下降';
                trendInsight.textContent = `雛鵝價格呈${chickTrend}趨勢，鵝肉價格呈${meatTrend}趨勢。`;
            }

            if (volatilityInsight) {
                const chickVariance = calculateVariance(data.map(d => d.avg_chick_cpi));
                const meatVariance = calculateVariance(data.map(d => d.avg_meat_cpi));
                const volatilityLevel = (chickVariance + meatVariance) / 2 > 50 ? '高' : '中等';
                volatilityInsight.textContent = `市場波動性為${volatilityLevel}水準，建議密切關注價格變化。`;
            }

            if (correlationInsight) {
                const correlation = calculateCorrelation(
                    data.map(d => d.avg_chick_cpi),
                    data.map(d => d.avg_meat_cpi)
                );
                const correlationLevel = correlation > 0.7 ? '強' : correlation > 0.3 ? '中等' : '弱';
                correlationInsight.textContent = `雛鵝與鵝肉價格間存在${correlationLevel}相關性（${correlation.toFixed(2)}）。`;
            }
        }
    } catch (error) {
        console.error('Error updating insights:', error);
    }
}

function calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
}

function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
}

function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        const timeString = now.toLocaleString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        lastUpdate.textContent = timeString;
    }
}

function setupExportFunctions() {
    const exportPNG = document.getElementById('exportPNG');
    const exportCSV = document.getElementById('exportCSV');
    const fullscreen = document.getElementById('fullscreen');

    if (exportPNG) {
        exportPNG.addEventListener('click', function() {
            if (cpiTrendChart) {
                const link = document.createElement('a');
                link.download = '鵝價CPI趨勢圖.png';
                link.href = cpiTrendChart.toBase64Image('image/png', 1.0);
                link.click();
            }
        });
    }

    if (exportCSV) {
        exportCSV.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/cpi-summary');
                const data = await response.json();

                if (data && data.length > 0) {
                    const csvContent = convertToCSV(data);
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', '鵝價CPI數據.csv');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } catch (error) {
                console.error('Error exporting CSV:', error);
            }
        });
    }

    if (fullscreen) {
        fullscreen.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
}

function convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = ['年份', '雛鵝平均CPI', '鵝肉平均CPI', '記錄數量'];
    const csvRows = [
        headers.join(','),
        ...data.map(row => [
            row.year,
            row.avg_chick_cpi ? row.avg_chick_cpi.toFixed(2) : '',
            row.avg_meat_cpi ? row.avg_meat_cpi.toFixed(2) : '',
            row.records_count
        ].join(','))
    ];

    return csvRows.join('\n');
}

function resetZoom(chartId) {
    const chart = window[chartId];
    if (chart && chart.resetZoom) {
        chart.resetZoom();
    }
}

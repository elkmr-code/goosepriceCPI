// Main JavaScript for Goose CPI Query System
document.addEventListener('DOMContentLoaded', function() {
    const queryBtn = document.getElementById('queryBtn');
    const summaryBtn = document.getElementById('summaryBtn');
    const yearFilter = document.getElementById('yearFilter');
    const startYear = document.getElementById('startYear');
    const endYear = document.getElementById('endYear');
    const recordLimit = document.getElementById('recordLimit');
    const results = document.getElementById('results');
    const loading = document.getElementById('loading');

    // Load available years on page load
    loadAvailableYears();

    // Event listeners
    queryBtn.addEventListener('click', queryGooseCPI);
    summaryBtn.addEventListener('click', loadCPISummary);

    // Load available years for dropdown
    async function loadAvailableYears() {
        try {
            const response = await fetch('/api/years');
            const years = await response.json();

            yearFilter.innerHTML = '<option value="">所有年份</option>';
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year + '年';
                yearFilter.appendChild(option);
            });
        } catch (error) {
            console.error('載入年份選項失敗:', error);
        }
    }

    // Query goose CPI data
    async function queryGooseCPI() {
        showLoading();

        try {
            const params = new URLSearchParams();

            if (yearFilter.value) {
                params.append('year', yearFilter.value);
            }

            if (startYear.value) {
                params.append('startYear', startYear.value);
            }

            if (endYear.value) {
                params.append('endYear', endYear.value);
            }

            if (recordLimit.value) {
                params.append('limit', recordLimit.value);
            }

            const response = await fetch(`/api/goose-cpi?${params}`);
            const data = await response.json();

            displayCPIData(data);
        } catch (error) {
            showError('查詢數據時發生錯誤: ' + error.message);
        }
    }

    // Load CPI summary by year
    async function loadCPISummary() {
        showLoading();

        try {
            const response = await fetch('/api/cpi-summary');
            const data = await response.json();

            displayCPISummary(data);
        } catch (error) {
            showError('載入摘要數據時發生錯誤: ' + error.message);
        }
    }

    // Display CPI data in table format
    function displayCPIData(data) {
        if (!data || data.length === 0) {
            results.innerHTML = '<p class="info-text">未找到符合條件的數據</p>';
            return;
        }

        let html = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>年份</th>
                        <th>雛鵝參考價格</th>
                        <th>肉鵝平均價格</th>
                        <th>雛鵝 CPI</th>
                        <th>肉鵝 CPI</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            const chickCPIClass = getCPIClass(row.chick_cpi);
            const meatCPIClass = getCPIClass(row.meat_cpi);

            html += `
                <tr>
                    <td>${formatDate(row.date)}</td>
                    <td>${row.year}</td>
                    <td>NT$ ${row.chick_reference_price}</td>
                    <td>NT$ ${row.meat_goose_average_price}</td>
                    <td class="cpi-value ${chickCPIClass}">${row.chick_cpi}</td>
                    <td class="cpi-value ${meatCPIClass}">${row.meat_cpi}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';

        const summary = `
            <div class="summary-card">
                <h3>查詢結果摘要</h3>
                <p>共找到 <strong>${data.length}</strong> 筆記錄</p>
                <div class="summary-stats">
                    <div class="stat-item">
                        <div class="stat-value">${calculateAverage(data, 'chick_cpi')}</div>
                        <div class="stat-label">平均雛鵝 CPI</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${calculateAverage(data, 'meat_cpi')}</div>
                        <div class="stat-label">平均肉鵝 CPI</div>
                    </div>
                </div>
            </div>
        `;

        results.innerHTML = summary + html;
    }

    // Display CPI summary by year
    function displayCPISummary(data) {
        if (!data || data.length === 0) {
            results.innerHTML = '<p class="info-text">未找到摘要數據</p>';
            return;
        }

        let html = '<h3>年度 CPI 摘要</h3>';

        data.forEach(yearData => {
            html += `
                <div class="summary-card">
                    <h3>${yearData.year} 年度摘要</h3>
                    <div class="summary-stats">
                        <div class="stat-item">
                            <div class="stat-value">${yearData.avg_chick_cpi.toFixed(2)}</div>
                            <div class="stat-label">平均雛鵝 CPI</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${yearData.avg_meat_cpi.toFixed(2)}</div>
                            <div class="stat-label">平均肉鵝 CPI</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${yearData.records_count}</div>
                            <div class="stat-label">記錄筆數</div>
                        </div>
                    </div>
                </div>
            `;
        });

        results.innerHTML = html;
    }

    // Utility functions
    function showLoading() {
        loading.style.display = 'block';
        results.innerHTML = '';
    }

    function showError(message) {
        loading.style.display = 'none';
        results.innerHTML = `<p class="info-text" style="color: #e74c3c;">${message}</p>`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW');
    }

    function getCPIClass(cpi) {
        if (cpi > 110) return 'cpi-high';
        if (cpi < 90) return 'cpi-low';
        return 'cpi-normal';
    }

    function calculateAverage(data, field) {
        const sum = data.reduce((acc, item) => acc + parseFloat(item[field]), 0);
        return (sum / data.length).toFixed(2);
    }

    // Hide loading on completion
    function hideLoading() {
        loading.style.display = 'none';
    }

    // Override display functions to hide loading
    const originalDisplayCPIData = displayCPIData;
    const originalDisplayCPISummary = displayCPISummary;

    displayCPIData = function(data) {
        hideLoading();
        originalDisplayCPIData(data);
    };

    displayCPISummary = function(data) {
        hideLoading();
        originalDisplayCPISummary(data);
    };
});

// Dashboard utility functions and error handling
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupErrorHandling();
        this.addLoadingStates();
        this.setupTooltips();
    }

    // Setup global error handling
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', event.error);
            this.showError('應用程式發生錯誤，請重新整理頁面或聯絡管理員');
        });

        // Handle fetch errors globally
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response;
            } catch (error) {
                console.error('Fetch Error:', error);
                this.showError(`網路請求失敗: ${error.message}`);
                throw error;
            }
        };
    }

    // Add loading states to chart containers
    addLoadingStates() {
        const chartContainers = document.querySelectorAll('.chart-wrapper');
        chartContainers.forEach(container => {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.style.display = 'none';
            container.appendChild(loadingDiv);
        });
    }

    // Setup tooltips for better UX
    setupTooltips() {
        // Add tooltips to API links
        const apiLinks = document.querySelectorAll('.api-info a');
        apiLinks.forEach(link => {
            link.title = '點擊查看 API 回應';
        });
    }

    // Show error message
    showError(message) {
        this.hideAllMessages();
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = this.createMessageDiv('error-message');
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Show success message
    showSuccess(message) {
        this.hideAllMessages();
        let successDiv = document.querySelector('.success-message');
        if (!successDiv) {
            successDiv = this.createMessageDiv('success-message');
        }
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    // Create message div
    createMessageDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        const container = document.querySelector('.container');
        const firstChart = document.querySelector('.charts-container');
        container.insertBefore(div, firstChart);
        return div;
    }

    // Hide all messages
    hideAllMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.style.display = 'none');
    }

    // Show loading state for specific chart
    showLoading(chartId) {
        const chartWrapper = document.querySelector(`#${chartId}`).closest('.chart-wrapper');
        const loading = chartWrapper.querySelector('.loading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    // Hide loading state for specific chart
    hideLoading(chartId) {
        const chartWrapper = document.querySelector(`#${chartId}`).closest('.chart-wrapper');
        const loading = chartWrapper.querySelector('.loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // Format numbers for display
    formatNumber(num, decimals = 1) {
        if (num === null || num === undefined) return 'N/A';
        return Number(num).toFixed(decimals);
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Download chart as image
    downloadChart(chartInstance, filename) {
        const link = document.createElement('a');
        link.download = filename || 'chart.png';
        link.href = chartInstance.toBase64Image();
        link.click();
    }

    // Export data as CSV
    exportToCSV(data, filename) {
        const csvContent = this.convertToCSV(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename || 'data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Convert data to CSV format
    convertToCSV(data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' ? `"${value}"` : value;
                }).join(',')
            )
        ];
        
        return csvRows.join('\n');
    }

    // Check if data is valid
    validateData(data) {
        return data && Array.isArray(data) && data.length > 0;
    }

    // Debounce function for search/filter inputs
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new Dashboard();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+R to refresh data
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (typeof loadInitialData === 'function') {
                loadInitialData();
                window.dashboard.showSuccess('資料已重新載入');
            }
        }
        
        // Escape to hide messages
        if (e.key === 'Escape') {
            window.dashboard.hideAllMessages();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}

// Auto-download JSON functionality
// Add this function to automatically download portfolio.json after any save

// Function to auto-download JSON file
function autoDownloadJSON() {
    const data = window.dataLoader.data;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.json';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ Auto-downloaded portfolio.json');
}

// Override the saveToStorage function to include auto-download
if (window.portfolioManager) {
    const originalSaveToStorage = window.portfolioManager.saveToStorage;
    window.portfolioManager.saveToStorage = function () {
        // Save to localStorage
        localStorage.setItem('portfolioData', JSON.stringify(this.dataLoader.data));
        // Auto-download JSON
        autoDownloadJSON();
    };
}

// Listen for when portfolioManager is initialized
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.portfolioManager && window.portfolioManager.saveToStorage) {
            const originalSaveToStorage = window.portfolioManager.saveToStorage.bind(window.portfolioManager);
            window.portfolioManager.saveToStorage = function () {
                // Save to localStorage
                localStorage.setItem('portfolioData', JSON.stringify(this.dataLoader.data));
                // Auto-download JSON
                autoDownloadJSON();
            };
            console.log('✅ Auto-download enabled for all save operations');
        }
    }, 1000);
});

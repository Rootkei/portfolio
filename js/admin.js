// Admin Panel Logic
class AdminPanel {
    constructor() {
        this.dataLoader = window.dataLoader;
        this.editor = document.getElementById('jsonEditor');
        this.previewFrame = document.getElementById('previewFrame');
        this.statusMessage = document.getElementById('statusMessage');
        this.originalData = null;

        this.init();
    }

    async init() {
        // Load data
        await this.dataLoader.loadData();
        this.originalData = JSON.parse(JSON.stringify(this.dataLoader.data));

        // Display data in editor
        this.displayData();

        // Initialize event listeners
        this.initEventListeners();

        // Check for saved data in localStorage
        this.loadFromLocalStorage();
    }

    displayData() {
        this.editor.value = JSON.stringify(this.dataLoader.data, null, 2);
    }

    initEventListeners() {
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveChanges();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Import file
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetData();
        });

        // Auto-format on blur
        this.editor.addEventListener('blur', () => {
            this.formatJSON();
        });

        // Keyboard shortcuts
        this.editor.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveChanges();
            }

            // Tab key for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.editor.selectionStart;
                const end = this.editor.selectionEnd;
                this.editor.value = this.editor.value.substring(0, start) + '  ' + this.editor.value.substring(end);
                this.editor.selectionStart = this.editor.selectionEnd = start + 2;
            }
        });
    }

    saveChanges() {
        try {
            // Parse JSON
            const newData = JSON.parse(this.editor.value);

            // Validate data structure
            if (!this.validateData(newData)) {
                throw new Error('Invalid data structure');
            }

            // Update data
            this.dataLoader.updateData(newData);

            // Save to localStorage
            localStorage.setItem('portfolioData', JSON.stringify(newData));

            // Reload preview
            this.reloadPreview();

            // Show success message
            this.showStatus('Changes saved successfully!', 'success');
        } catch (error) {
            this.showStatus(`Error: ${error.message}`, 'error');
            console.error('Save error:', error);
        }
    }

    validateData(data) {
        // Basic validation
        if (!data || typeof data !== 'object') return false;
        if (!data.personal || typeof data.personal !== 'object') return false;
        if (!data.personal.name || !data.personal.title) return false;
        return true;
    }

    formatJSON() {
        try {
            const data = JSON.parse(this.editor.value);
            this.editor.value = JSON.stringify(data, null, 2);
        } catch (error) {
            // Invalid JSON, don't format
        }
    }

    exportData() {
        try {
            const data = JSON.parse(this.editor.value);
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `portfolio-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showStatus('Data exported successfully!', 'success');
        } catch (error) {
            this.showStatus(`Export error: ${error.message}`, 'error');
        }
    }

    async importData(file) {
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!this.validateData(data)) {
                        throw new Error('Invalid data structure');
                    }

                    this.dataLoader.updateData(data);
                    this.displayData();
                    this.showStatus('Data imported successfully!', 'success');
                } catch (error) {
                    this.showStatus(`Import error: ${error.message}`, 'error');
                }
            };
            reader.readAsText(file);
        } catch (error) {
            this.showStatus(`Import error: ${error.message}`, 'error');
        }

        // Reset file input
        document.getElementById('importFile').value = '';
    }

    resetData() {
        if (confirm('Are you sure you want to reset to original data? This will discard all changes.')) {
            this.dataLoader.updateData(JSON.parse(JSON.stringify(this.originalData)));
            this.displayData();
            localStorage.removeItem('portfolioData');
            this.reloadPreview();
            this.showStatus('Data reset to original', 'success');
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.dataLoader.updateData(data);
                this.displayData();
                this.showStatus('Loaded saved changes from browser storage', 'success');
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }

    reloadPreview() {
        // Save data to localStorage for preview to access
        localStorage.setItem('portfolioData', JSON.stringify(this.dataLoader.data));

        // Reload preview iframe
        this.previewFrame.src = this.previewFrame.src;
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.statusMessage.style.display = 'none';
        }, 5000);
    }
}

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

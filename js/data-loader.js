// Data Loader - Loads portfolio data from API
class DataLoader {
    constructor() {
        this.data = null;
    }

    // Load data from API or localStorage
    async loadData() {
        try {
            // Try to load from API first
            if (window.apiClient) {
                try {
                    this.data = await window.apiClient.getPortfolio();
                    console.log('✅ Loaded data from API');
                    // Cache to localStorage for offline access
                    localStorage.setItem('portfolioData', JSON.stringify(this.data));
                    return this.data;
                } catch (apiError) {
                    console.warn('⚠️ API not available, trying localStorage...', apiError);
                }
            }

            // Fallback to localStorage (offline mode)
            const savedData = localStorage.getItem('portfolioData');
            if (savedData) {
                try {
                    this.data = JSON.parse(savedData);
                    console.log('📦 Loaded data from localStorage (offline mode)');
                    return this.data;
                } catch (e) {
                    console.warn('Invalid localStorage data');
                }
            }

            // If all fails, return empty structure
            console.error('❌ No data available');
            this.data = this.getDefaultData();
            return this.data;
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            this.data = this.getDefaultData();
            return this.data;
        }
    }

    // Get default data structure
    getDefaultData() {
        return {
            personal: {
                name: "Your Name",
                title: "Developer",
                tagline: "Building amazing things",
                bio: "Passionate developer",
                photo: "https://via.placeholder.com/400",
                email: "email@example.com",
                phone: "+1234567890",
                location: "Your City",
                resume: "#"
            },
            social: [],
            experience: [],
            education: [],
            skills: {},
            projects: [],
            certifications: []
        };
    }

    // Get personal information
    getPersonal() {
        return this.data?.personal || this.getDefaultData().personal;
    }

    // Get social links
    getSocial() {
        return this.data?.social || [];
    }

    // Get experience
    getExperience() {
        return this.data?.experience || [];
    }

    // Get education
    getEducation() {
        return this.data?.education || [];
    }

    // Get skills
    getSkills() {
        return this.data?.skills || {};
    }

    // Get projects
    getProjects() {
        return this.data?.projects || [];
    }

    // Get certifications
    getCertifications() {
        return this.data?.certifications || [];
    }

    // Update data
    updateData(newData) {
        this.data = newData;
    }

    // Export data as JSON
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Import data from file
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.data = data;
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// Create global instance
window.dataLoader = new DataLoader();

// Content Script - Runs on LinkedIn pages
console.log('🔗 LinkedIn Sync Extension loaded');

// Extract LinkedIn profile data
function extractLinkedInData() {
    const data = {
        personal: extractPersonalInfo(),
        experience: extractExperience(),
        education: extractEducation(),
        skills: extractSkills(),
        certifications: extractCertifications()
    };

    return data;
}

// Extract personal information
function extractPersonalInfo() {
    const personal = {
        name: '',
        title: '',
        location: '',
        bio: '',
        photo: ''
    };

    try {
        // Name
        const nameElement = document.querySelector('h1.text-heading-xlarge');
        if (nameElement) {
            personal.name = nameElement.textContent.trim();
        }

        // Title/Headline
        const titleElement = document.querySelector('.text-body-medium.break-words');
        if (titleElement) {
            personal.title = titleElement.textContent.trim();
        }

        // Location
        const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
        if (locationElement) {
            personal.location = locationElement.textContent.trim();
        }

        // About/Bio
        const bioElement = document.querySelector('#about ~ .display-flex .inline-show-more-text span[aria-hidden="true"]');
        if (bioElement) {
            personal.bio = bioElement.textContent.trim();
        }

        // Profile photo
        const photoElement = document.querySelector('img.pv-top-card-profile-picture__image');
        if (photoElement) {
            personal.photo = photoElement.src;
        }
    } catch (error) {
        console.error('Error extracting personal info:', error);
    }

    return personal;
}

// Extract work experience
function extractExperience() {
    const experiences = [];

    try {
        const expSection = document.querySelector('#experience');
        if (!expSection) return experiences;

        const expItems = expSection.parentElement.querySelectorAll('li.artdeco-list__item');

        expItems.forEach(item => {
            try {
                const exp = {
                    id: Math.floor(Date.now() + Math.random() * 1000),
                    company: '',
                    position: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                    highlights: [],
                    technologies: []
                };

                // Position
                const positionElement = item.querySelector('.mr1.t-bold span[aria-hidden="true"]');
                if (positionElement) {
                    exp.position = positionElement.textContent.trim();
                }

                // Company
                const companyElement = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
                if (companyElement) {
                    exp.company = companyElement.textContent.trim().split(' · ')[0];
                }

                // Date range
                const dateElement = item.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
                if (dateElement) {
                    let dateText = dateElement.textContent.trim();

                    // Remove duration info (e.g., "· 2 yrs 1 mo")
                    dateText = dateText.split('·')[0].trim();

                    const dates = parseDateRange(dateText);
                    exp.startDate = dates.start;
                    exp.endDate = dates.end;
                    exp.current = dates.current;
                }

                // Location (if exists, usually in a different element)
                const locationElements = item.querySelectorAll('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
                if (locationElements.length > 1) {
                    // Second element is usually location
                    const locationText = locationElements[1].textContent.trim();
                    // Only set if it doesn't look like a date
                    if (!locationText.match(/\d{4}/) && !locationText.includes('·')) {
                        exp.location = locationText;
                    }
                }

                // Description
                const descElement = item.querySelector('.inline-show-more-text span[aria-hidden="true"]');
                if (descElement) {
                    exp.description = descElement.textContent.trim();
                }

                if (exp.company && exp.position) {
                    experiences.push(exp);
                }
            } catch (error) {
                console.error('Error extracting experience item:', error);
            }
        });
    } catch (error) {
        console.error('Error extracting experience:', error);
    }

    return experiences;
}

// Extract education
function extractEducation() {
    const education = [];

    try {
        const eduSection = document.querySelector('#education');
        if (!eduSection) return education;

        const eduItems = eduSection.parentElement.querySelectorAll('li.artdeco-list__item');

        eduItems.forEach(item => {
            try {
                const edu = {
                    id: Math.floor(Date.now() + Math.random() * 1000),
                    school: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    gpa: '',
                    description: ''
                };

                // School name
                const schoolElement = item.querySelector('.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]');
                if (schoolElement) {
                    edu.school = schoolElement.textContent.trim();
                }

                // Degree and field
                const degreeElement = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
                if (degreeElement) {
                    const degreeText = degreeElement.textContent.trim();
                    const parts = degreeText.split(',');
                    edu.degree = parts[0]?.trim() || '';
                    edu.field = parts[1]?.trim() || '';
                }

                // Date range
                const dateElement = item.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
                if (dateElement) {
                    const dateText = dateElement.textContent.trim();
                    const dates = parseDateRange(dateText);
                    edu.startDate = dates.start;
                    edu.endDate = dates.end;
                }

                if (edu.school) {
                    education.push(edu);
                }
            } catch (error) {
                console.error('Error extracting education item:', error);
            }
        });
    } catch (error) {
        console.error('Error extracting education:', error);
    }

    return education;
}

// Extract skills
function extractSkills() {
    const skills = {};

    try {
        const skillsSection = document.querySelector('#skills');
        if (!skillsSection) return skills;

        const skillItems = skillsSection.parentElement.querySelectorAll('li.artdeco-list__item');

        skillItems.forEach(item => {
            try {
                const skillName = item.querySelector('.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]');
                if (skillName) {
                    const name = skillName.textContent.trim();

                    // Default category
                    if (!skills['Technical Skills']) {
                        skills['Technical Skills'] = [];
                    }

                    skills['Technical Skills'].push({
                        name: name,
                        level: 80 // Default level
                    });
                }
            } catch (error) {
                console.error('Error extracting skill item:', error);
            }
        });
    } catch (error) {
        console.error('Error extracting skills:', error);
    }

    return skills;
}

// Extract certifications
function extractCertifications() {
    const certifications = [];

    try {
        const certSection = document.querySelector('#licenses_and_certifications');
        if (!certSection) return certifications;

        const certItems = certSection.parentElement.querySelectorAll('li.artdeco-list__item');

        certItems.forEach(item => {
            try {
                const cert = {
                    name: '',
                    issuer: '',
                    date: '',
                    url: ''
                };

                // Certification name
                const nameElement = item.querySelector('.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]');
                if (nameElement) {
                    cert.name = nameElement.textContent.trim();
                }

                // Issuer
                const issuerElement = item.querySelector('.t-14.t-normal span[aria-hidden="true"]');
                if (issuerElement) {
                    cert.issuer = issuerElement.textContent.trim();
                }

                // Date
                const dateElement = item.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
                if (dateElement) {
                    cert.date = dateElement.textContent.trim();
                }

                if (cert.name) {
                    certifications.push(cert);
                }
            } catch (error) {
                console.error('Error extracting certification item:', error);
            }
        });
    } catch (error) {
        console.error('Error extracting certifications:', error);
    }

    return certifications;
}

// Parse date range (e.g., "Jan 2020 - Present" or "2018 - 2022")
function parseDateRange(dateText) {
    const result = {
        start: '',
        end: '',
        current: false
    };

    try {
        if (dateText.includes('Present')) {
            result.current = true;
            result.end = 'Present';
        }

        const parts = dateText.split('-').map(p => p.trim());

        if (parts[0]) {
            result.start = convertToISODate(parts[0]);
        }

        if (parts[1] && !result.current) {
            result.end = convertToISODate(parts[1]);
        }
    } catch (error) {
        console.error('Error parsing date range:', error);
    }

    return result;
}

// Convert date string to ISO format (YYYY-MM)
function convertToISODate(dateStr) {
    try {
        const months = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        const parts = dateStr.trim().split(' ');

        if (parts.length === 2) {
            // "Jan 2020" format
            const month = months[parts[0]];
            const year = parts[1];
            return `${year}-${month}`;
        } else if (parts.length === 1 && parts[0].length === 4) {
            // "2020" format
            return `${parts[0]}-01`;
        }
    } catch (error) {
        console.error('Error converting date:', error);
    }

    return dateStr;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
        console.log('📊 Extracting LinkedIn data...');

        // Use async function and send response
        (async () => {
            try {
                const data = extractLinkedInData();
                console.log('✅ Data extracted:', data);
                sendResponse({ success: true, data: data });
            } catch (error) {
                console.error('❌ Error extracting data:', error);
                sendResponse({ success: false, error: error.message });
            }
        })();

        // Return true to indicate async response
        return true;
    }
});

// Notify that we're on LinkedIn
if (window.location.hostname === 'www.linkedin.com') {
    chrome.runtime.sendMessage({ action: 'onLinkedIn', url: window.location.href });
}

// CV Generator - Auto-fill CV from portfolio data
class CVGenerator {
    constructor() {
        this.dataLoader = window.dataLoader;
        this.init();
    }

    async init() {
        // Load portfolio data
        await this.dataLoader.loadData();

        // Generate CV
        this.generateCV();
    }

    generateCV() {
        const data = this.dataLoader.data;

        // Fill header
        this.fillHeader(data.personal);

        // Fill professional summary
        this.fillSummary(data.personal);

        // Fill skills
        this.fillSkills(data.skills);

        // Fill experience
        this.fillExperience(data.experience);

        // Fill projects
        this.fillProjects(data.projects);

        // Fill education
        this.fillEducation(data.education);

        // Fill certifications
        this.fillCertifications(data.certifications);
    }

    fillHeader(personal) {
        document.getElementById('cv-name').textContent = personal.name.toUpperCase();

        const contactInfo = [
            personal.title,
            personal.email,
            personal.phone,
            personal.location
        ].filter(item => item).join(' | ');

        document.getElementById('cv-contact').innerHTML = `<span>${contactInfo}</span>`;
    }

    fillSummary(personal) {
        document.getElementById('cv-summary').textContent = personal.bio || personal.tagline;
    }

    fillSkills(skills) {
        const container = document.getElementById('cv-skills');
        container.innerHTML = '';

        Object.entries(skills).forEach(([category, skillList]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';

            const categoryName = document.createElement('div');
            categoryName.className = 'skill-category-name';
            categoryName.textContent = category;

            const skillListDiv = document.createElement('div');
            skillListDiv.className = 'skill-list';
            const skillNames = skillList.map(s => s.name).join(', ');
            skillListDiv.textContent = skillNames;

            categoryDiv.appendChild(categoryName);
            categoryDiv.appendChild(skillListDiv);
            container.appendChild(categoryDiv);
        });
    }

    fillExperience(experience) {
        const container = document.getElementById('cv-experience');
        container.innerHTML = '';

        experience.forEach(exp => {
            const expDiv = document.createElement('div');
            expDiv.className = 'experience-item';

            const header = document.createElement('div');
            header.className = 'experience-header';

            const title = document.createElement('div');
            title.className = 'experience-title';
            title.textContent = exp.position;

            const company = document.createElement('div');
            company.className = 'experience-company';
            company.textContent = `${exp.company}${exp.location ? ' - ' + exp.location : ''}`;

            const date = document.createElement('div');
            date.className = 'experience-date';
            const endDate = exp.current ? 'Present' : this.formatDate(exp.endDate);
            date.textContent = `${this.formatDate(exp.startDate)} - ${endDate}`;

            const description = document.createElement('p');
            description.className = 'experience-description';
            description.textContent = exp.description;

            header.appendChild(title);
            header.appendChild(company);
            expDiv.appendChild(header);
            expDiv.appendChild(date);
            expDiv.appendChild(description);

            // Highlights
            if (exp.highlights && exp.highlights.length > 0) {
                const highlightsList = document.createElement('ul');
                highlightsList.className = 'experience-highlights';
                exp.highlights.forEach(highlight => {
                    const li = document.createElement('li');
                    li.textContent = highlight;
                    highlightsList.appendChild(li);
                });
                expDiv.appendChild(highlightsList);
            }

            // Technologies
            if (exp.technologies && exp.technologies.length > 0) {
                const tech = document.createElement('div');
                tech.className = 'experience-tech';
                tech.textContent = `Technologies: ${exp.technologies.join(', ')}`;
                expDiv.appendChild(tech);
            }

            container.appendChild(expDiv);
        });
    }

    fillProjects(projects) {
        const container = document.getElementById('cv-projects');
        container.innerHTML = '';

        // Only show featured projects or top 3
        const displayProjects = projects.filter(p => p.featured).slice(0, 3);
        if (displayProjects.length === 0) {
            displayProjects.push(...projects.slice(0, 3));
        }

        displayProjects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';

            const title = document.createElement('div');
            title.className = 'project-title';
            title.textContent = project.title;

            const description = document.createElement('div');
            description.className = 'project-description';
            description.textContent = project.description;

            projectDiv.appendChild(title);
            projectDiv.appendChild(description);

            // Highlights
            if (project.highlights && project.highlights.length > 0) {
                const highlightsList = document.createElement('ul');
                highlightsList.className = 'project-highlights';
                project.highlights.forEach(highlight => {
                    const li = document.createElement('li');
                    li.textContent = highlight;
                    highlightsList.appendChild(li);
                });
                projectDiv.appendChild(highlightsList);
            }

            // Technologies
            if (project.technologies && project.technologies.length > 0) {
                const tech = document.createElement('div');
                tech.className = 'project-tech';
                tech.textContent = `Tech Stack: ${project.technologies.join(', ')}`;
                projectDiv.appendChild(tech);
            }

            container.appendChild(projectDiv);
        });
    }

    fillEducation(education) {
        const container = document.getElementById('cv-education');
        container.innerHTML = '';

        education.forEach(edu => {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'education-item';

            const degree = document.createElement('div');
            degree.className = 'education-degree';
            degree.textContent = `${edu.degree}${edu.field ? ' - ' + edu.field : ''}`;

            const school = document.createElement('div');
            school.className = 'education-school';
            school.textContent = edu.school;

            const date = document.createElement('div');
            date.className = 'education-date';
            date.textContent = `${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}`;

            eduDiv.appendChild(degree);
            eduDiv.appendChild(school);
            eduDiv.appendChild(date);

            if (edu.gpa) {
                const gpa = document.createElement('p');
                gpa.textContent = `GPA: ${edu.gpa}`;
                eduDiv.appendChild(gpa);
            }

            container.appendChild(eduDiv);
        });
    }

    fillCertifications(certifications) {
        if (!certifications || certifications.length === 0) {
            document.getElementById('cv-certifications-section').style.display = 'none';
            return;
        }

        const container = document.getElementById('cv-certifications');
        container.innerHTML = '';

        certifications.forEach(cert => {
            const certDiv = document.createElement('div');
            certDiv.className = 'certification-item';

            const text = document.createElement('p');
            text.textContent = `• ${cert.name} - ${cert.issuer}${cert.date ? ' (' + cert.date + ')' : ''}`;

            certDiv.appendChild(text);
            container.appendChild(certDiv);
        });
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        if (dateStr === 'Present') return 'Present';

        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }
}

// PDF Download Function
function downloadPDF() {
    const element = document.getElementById('cv-content');
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'CV_Professional_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Show loading
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    btn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// Initialize CV Generator
document.addEventListener('DOMContentLoaded', () => {
    window.cvGenerator = new CVGenerator();
});

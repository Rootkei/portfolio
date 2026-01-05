// Portfolio Management Dashboard
class PortfolioManager {
  constructor() {
    this.dataLoader = window.dataLoader;
    this.currentTab = 'personal';
    this.editingItem = null;
    this.editingIndex = null;
    this.editingCategory = null;

    this.init();
  }

  async init() {
    // Load data
    await this.dataLoader.loadData();

    // Initialize UI
    this.initTabs();
    this.initModal();
    this.renderAllTabs();
    this.initEventListeners();
  }

  initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');

    this.currentTab = tabName;
  }

  initModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');

    modalClose.addEventListener('click', () => this.closeModal());
    modalCancel.addEventListener('click', () => this.closeModal());

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
  }

  openModal(title, content, onSave) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    modal.classList.add('active');

    // Set save handler
    const saveBtn = document.getElementById('modalSave');
    saveBtn.onclick = () => {
      if (onSave()) {
        this.closeModal();
      }
    };
  }

  closeModal() {
    document.getElementById('modal').classList.remove('active');
    this.editingItem = null;
    this.editingIndex = null;
    this.editingCategory = null;
  }

  initEventListeners() {
    // Save all button
    document.getElementById('saveAllBtn').addEventListener('click', async () => {
      await this.saveAll();
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.dataLoader.exportData();
      this.showStatus('Đã export JSON thành công!', 'success');
    });
  }

  renderAllTabs() {
    this.renderPersonalTab();
    this.renderExperienceTab();
    this.renderEducationTab();
    this.renderSkillsTab();
    this.renderProjectsTab();
    this.renderSocialTab();
  }

  // ========== PERSONAL INFO ==========
  renderPersonalTab() {
    const personal = this.dataLoader.getPersonal();
    const container = document.getElementById('personalTab');

    container.innerHTML = `
      <div class="form-section">
        <h3><i class="fas fa-user"></i> Thông Tin Cá Nhân</h3>
        <form id="personalForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Họ và Tên *</label>
              <input type="text" id="personal_name" value="${personal.name}" required>
            </div>
            <div class="form-group">
              <label>Chức Danh *</label>
              <input type="text" id="personal_title" value="${personal.title}" required>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" id="personal_email" value="${personal.email}" required>
            </div>
            <div class="form-group">
              <label>Số Điện Thoại</label>
              <input type="tel" id="personal_phone" value="${personal.phone}">
            </div>
            <div class="form-group">
              <label>Địa Điểm</label>
              <input type="text" id="personal_location" value="${personal.location}">
            </div>
            <div class="form-group">
              <label>Link Ảnh Đại Diện</label>
              <input type="url" id="personal_photo" value="${personal.photo}">
              <small>URL của ảnh profile</small>
            </div>
          </div>
          <div class="form-group">
            <label>Tagline *</label>
            <input type="text" id="personal_tagline" value="${personal.tagline}" required>
            <small>Câu giới thiệu ngắn gọn</small>
          </div>
          <div class="form-group">
            <label>Giới Thiệu Bản Thân *</label>
            <textarea id="personal_bio" rows="4" required>${personal.bio}</textarea>
          </div>
          <div class="form-group">
            <label>Link Resume/CV</label>
            <input type="url" id="personal_resume" value="${personal.resume}">
          </div>
          <button type="button" class="btn btn-primary" onclick="portfolioManager.savePersonal()">
            <i class="fas fa-save"></i> Lưu Thông Tin
          </button>
        </form>
      </div>
    `;
  }

  async savePersonal() {
    const personal = {
      name: document.getElementById('personal_name').value,
      title: document.getElementById('personal_title').value,
      email: document.getElementById('personal_email').value,
      phone: document.getElementById('personal_phone').value,
      location: document.getElementById('personal_location').value,
      photo: document.getElementById('personal_photo').value,
      tagline: document.getElementById('personal_tagline').value,
      bio: document.getElementById('personal_bio').value,
      resume: document.getElementById('personal_resume').value
    };

    this.dataLoader.data.personal = personal;
    await this.saveToStorage();
    this.showStatus('Đã lưu thông tin cá nhân!', 'success');
  }

  // ========== EXPERIENCE ==========
  renderExperienceTab() {
    const experience = this.dataLoader.getExperience();
    const container = document.getElementById('experienceTab');

    let html = `
      <div class="form-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <h3><i class="fas fa-briefcase"></i> Kinh Nghiệm Làm Việc</h3>
          <button class="btn btn-primary btn-small" onclick="portfolioManager.addExperience()">
            <i class="fas fa-plus"></i> Thêm Kinh Nghiệm
          </button>
        </div>
        <div class="list-container">
    `;

    if (experience.length === 0) {
      html += `
        <div class="empty-state">
          <i class="fas fa-briefcase"></i>
          <p>Chưa có kinh nghiệm làm việc nào</p>
        </div>
      `;
    } else {
      experience.forEach((exp, index) => {
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">${exp.position}</div>
              <div class="list-item-subtitle">${exp.company}</div>
              <div class="list-item-meta">
                ${this.formatDate(exp.startDate)} - ${exp.current ? 'Hiện tại' : this.formatDate(exp.endDate)}
                ${exp.location ? ' • ' + exp.location : ''}
              </div>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.editExperience(${index})" title="Sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.deleteExperience(${index})" title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  }

  addExperience() {
    this.editingIndex = null;
    const content = this.getExperienceForm();
    this.openModal('Thêm Kinh Nghiệm', content, () => this.saveExperience());
  }

  editExperience(index) {
    this.editingIndex = index;
    const exp = this.dataLoader.getExperience()[index];
    const content = this.getExperienceForm(exp);
    this.openModal('Sửa Kinh Nghiệm', content, () => this.saveExperience());
  }

  getExperienceForm(exp = {}) {
    return `
      <div class="form-group">
        <label>Công Ty *</label>
        <input type="text" id="exp_company" value="${exp.company || ''}" required>
      </div>
      <div class="form-group">
        <label>Vị Trí *</label>
        <input type="text" id="exp_position" value="${exp.position || ''}" required>
      </div>
      <div class="form-group">
        <label>Địa Điểm</label>
        <input type="text" id="exp_location" value="${exp.location || ''}">
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Ngày Bắt Đầu *</label>
          <input type="month" id="exp_startDate" value="${exp.startDate || ''}" required>
        </div>
        <div class="form-group">
          <label>Ngày Kết Thúc</label>
          <input type="month" id="exp_endDate" value="${exp.endDate || ''}" ${exp.current ? 'disabled' : ''}>
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" id="exp_current" ${exp.current ? 'checked' : ''} 
            onchange="document.getElementById('exp_endDate').disabled = this.checked">
          Đang làm việc tại đây
        </label>
      </div>
      <div class="form-group">
        <label>Mô Tả Công Việc *</label>
        <textarea id="exp_description" rows="3" required>${exp.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Thành Tựu (mỗi dòng một mục)</label>
        <textarea id="exp_highlights" rows="4">${exp.highlights ? exp.highlights.join('\n') : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Công Nghệ (cách nhau bởi dấu phẩy)</label>
        <input type="text" id="exp_technologies" value="${exp.technologies ? exp.technologies.join(', ') : ''}">
      </div>
    `;
  }

  saveExperience() {
    const current = document.getElementById('exp_current').checked;
    const exp = {
      id: this.editingIndex !== null ? this.dataLoader.getExperience()[this.editingIndex].id : Date.now(),
      company: document.getElementById('exp_company').value,
      position: document.getElementById('exp_position').value,
      location: document.getElementById('exp_location').value,
      startDate: document.getElementById('exp_startDate').value,
      endDate: current ? 'Present' : document.getElementById('exp_endDate').value,
      current: current,
      description: document.getElementById('exp_description').value,
      highlights: document.getElementById('exp_highlights').value.split('\n').filter(h => h.trim()),
      technologies: document.getElementById('exp_technologies').value.split(',').map(t => t.trim()).filter(t => t)
    };

    const experience = this.dataLoader.getExperience();
    if (this.editingIndex !== null) {
      experience[this.editingIndex] = exp;
    } else {
      experience.push(exp);
    }

    this.dataLoader.data.experience = experience;
    this.saveToStorage();
    this.renderExperienceTab();
    this.showStatus('Đã lưu kinh nghiệm!', 'success');
    return true;
  }

  deleteExperience(index) {
    if (confirm('Bạn có chắc muốn xóa kinh nghiệm này?')) {
      const experience = this.dataLoader.getExperience();
      experience.splice(index, 1);
      this.dataLoader.data.experience = experience;
      this.saveToStorage();
      this.renderExperienceTab();
      this.showStatus('Đã xóa kinh nghiệm!', 'success');
    }
  }

  // ========== EDUCATION ==========
  renderEducationTab() {
    const education = this.dataLoader.getEducation();
    const container = document.getElementById('educationTab');

    let html = `
      <div class="form-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <h3><i class="fas fa-graduation-cap"></i> Học Vấn</h3>
          <button class="btn btn-primary btn-small" onclick="portfolioManager.addEducation()">
            <i class="fas fa-plus"></i> Thêm Học Vấn
          </button>
        </div>
        <div class="list-container">
    `;

    if (education.length === 0) {
      html += `
        <div class="empty-state">
          <i class="fas fa-graduation-cap"></i>
          <p>Chưa có thông tin học vấn</p>
        </div>
      `;
    } else {
      education.forEach((edu, index) => {
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">${edu.degree}</div>
              <div class="list-item-subtitle">${edu.school}</div>
              <div class="list-item-meta">
                ${edu.field ? edu.field + ' • ' : ''}
                ${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}
              </div>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.editEducation(${index})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.deleteEducation(${index})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  }

  addEducation() {
    this.editingIndex = null;
    const content = this.getEducationForm();
    this.openModal('Thêm Học Vấn', content, () => this.saveEducation());
  }

  editEducation(index) {
    this.editingIndex = index;
    const edu = this.dataLoader.getEducation()[index];
    const content = this.getEducationForm(edu);
    this.openModal('Sửa Học Vấn', content, () => this.saveEducation());
  }

  getEducationForm(edu = {}) {
    return `
      <div class="form-group">
        <label>Trường *</label>
        <input type="text" id="edu_school" value="${edu.school || ''}" required>
      </div>
      <div class="form-group">
        <label>Bằng Cấp *</label>
        <input type="text" id="edu_degree" value="${edu.degree || ''}" required>
      </div>
      <div class="form-group">
        <label>Chuyên Ngành</label>
        <input type="text" id="edu_field" value="${edu.field || ''}">
      </div>
      <div class="form-group">
        <label>Địa Điểm</label>
        <input type="text" id="edu_location" value="${edu.location || ''}">
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Ngày Bắt Đầu</label>
          <input type="month" id="edu_startDate" value="${edu.startDate || ''}">
        </div>
        <div class="form-group">
          <label>Ngày Tốt Nghiệp</label>
          <input type="month" id="edu_endDate" value="${edu.endDate || ''}">
        </div>
      </div>
      <div class="form-group">
        <label>GPA</label>
        <input type="text" id="edu_gpa" value="${edu.gpa || ''}">
      </div>
      <div class="form-group">
        <label>Mô Tả</label>
        <textarea id="edu_description" rows="3">${edu.description || ''}</textarea>
      </div>
    `;
  }

  saveEducation() {
    const edu = {
      id: this.editingIndex !== null ? this.dataLoader.getEducation()[this.editingIndex].id : Date.now(),
      school: document.getElementById('edu_school').value,
      degree: document.getElementById('edu_degree').value,
      field: document.getElementById('edu_field').value,
      location: document.getElementById('edu_location').value,
      startDate: document.getElementById('edu_startDate').value,
      endDate: document.getElementById('edu_endDate').value,
      gpa: document.getElementById('edu_gpa').value,
      description: document.getElementById('edu_description').value
    };

    const education = this.dataLoader.getEducation();
    if (this.editingIndex !== null) {
      education[this.editingIndex] = edu;
    } else {
      education.push(edu);
    }

    this.dataLoader.data.education = education;
    this.saveToStorage();
    this.renderEducationTab();
    this.showStatus('Đã lưu học vấn!', 'success');
    return true;
  }

  deleteEducation(index) {
    if (confirm('Bạn có chắc muốn xóa học vấn này?')) {
      const education = this.dataLoader.getEducation();
      education.splice(index, 1);
      this.dataLoader.data.education = education;
      this.saveToStorage();
      this.renderEducationTab();
      this.showStatus('Đã xóa học vấn!', 'success');
    }
  }

  // ========== SKILLS ==========
  renderSkillsTab() {
    const skills = this.dataLoader.getSkills();
    const container = document.getElementById('skillsTab');

    let html = `
      <div class="form-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <h3><i class="fas fa-code"></i> Kỹ Năng</h3>
          <button class="btn btn-primary btn-small" onclick="portfolioManager.addSkillCategory()">
            <i class="fas fa-plus"></i> Thêm Danh Mục
          </button>
        </div>
    `;

    Object.entries(skills).forEach(([category, skillList]) => {
      html += `
        <div class="form-section" style="background: var(--color-bg-secondary);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
            <h4 style="color: var(--color-accent-primary);">${category}</h4>
            <div style="display: flex; gap: var(--spacing-sm);">
              <button class="btn btn-secondary btn-small" onclick="portfolioManager.addSkill('${category}')">
                <i class="fas fa-plus"></i> Thêm Kỹ Năng
              </button>
              <button class="btn btn-secondary btn-icon btn-small" onclick="portfolioManager.deleteSkillCategory('${category}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="list-container">
      `;

      skillList.forEach((skill, index) => {
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">${skill.name}</div>
              <div class="list-item-meta">Level: ${skill.level}%</div>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.editSkill('${category}', ${index})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.deleteSkill('${category}', ${index})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  addSkillCategory() {
    const category = prompt('Tên danh mục kỹ năng:');
    if (category && category.trim()) {
      const skills = this.dataLoader.getSkills();
      if (!skills[category.trim()]) {
        skills[category.trim()] = [];
        this.dataLoader.data.skills = skills;
        this.saveToStorage();
        this.renderSkillsTab();
        this.showStatus('Đã thêm danh mục!', 'success');
      } else {
        alert('Danh mục này đã tồn tại!');
      }
    }
  }

  deleteSkillCategory(category) {
    if (confirm(`Bạn có chắc muốn xóa danh mục "${category}" và tất cả kỹ năng trong đó?`)) {
      const skills = this.dataLoader.getSkills();
      delete skills[category];
      this.dataLoader.data.skills = skills;
      this.saveToStorage();
      this.renderSkillsTab();
      this.showStatus('Đã xóa danh mục!', 'success');
    }
  }

  addSkill(category) {
    this.editingCategory = category;
    this.editingIndex = null;
    const content = this.getSkillForm();
    this.openModal(`Thêm Kỹ Năng - ${category}`, content, () => this.saveSkill());
  }

  editSkill(category, index) {
    this.editingCategory = category;
    this.editingIndex = index;
    const skill = this.dataLoader.getSkills()[category][index];
    const content = this.getSkillForm(skill);
    this.openModal(`Sửa Kỹ Năng - ${category}`, content, () => this.saveSkill());
  }

  getSkillForm(skill = {}) {
    return `
      <div class="form-group">
        <label>Tên Kỹ Năng *</label>
        <input type="text" id="skill_name" value="${skill.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Mức Độ (0-100) *</label>
        <input type="number" id="skill_level" min="0" max="100" value="${skill.level || 50}" required>
      </div>
    `;
  }

  saveSkill() {
    const skill = {
      name: document.getElementById('skill_name').value,
      level: parseInt(document.getElementById('skill_level').value)
    };

    const skills = this.dataLoader.getSkills();
    if (this.editingIndex !== null) {
      skills[this.editingCategory][this.editingIndex] = skill;
    } else {
      skills[this.editingCategory].push(skill);
    }

    this.dataLoader.data.skills = skills;
    this.saveToStorage();
    this.renderSkillsTab();
    this.showStatus('Đã lưu kỹ năng!', 'success');
    return true;
  }

  deleteSkill(category, index) {
    if (confirm('Bạn có chắc muốn xóa kỹ năng này?')) {
      const skills = this.dataLoader.getSkills();
      skills[category].splice(index, 1);
      this.dataLoader.data.skills = skills;
      this.saveToStorage();
      this.renderSkillsTab();
      this.showStatus('Đã xóa kỹ năng!', 'success');
    }
  }

  // ========== PROJECTS ==========
  renderProjectsTab() {
    const projects = this.dataLoader.getProjects();
    const container = document.getElementById('projectsTab');

    let html = `
      <div class="form-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <h3><i class="fas fa-folder"></i> Dự Án</h3>
          <button class="btn btn-primary btn-small" onclick="portfolioManager.addProject()">
            <i class="fas fa-plus"></i> Thêm Dự Án
          </button>
        </div>
        <div class="list-container">
    `;

    if (projects.length === 0) {
      html += `
        <div class="empty-state">
          <i class="fas fa-folder"></i>
          <p>Chưa có dự án nào</p>
        </div>
      `;
    } else {
      projects.forEach((project, index) => {
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">${project.title}</div>
              <div class="list-item-meta">${project.description.substring(0, 100)}...</div>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.editProject(${index})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.deleteProject(${index})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  }

  addProject() {
    this.editingIndex = null;
    const content = this.getProjectForm();
    this.openModal('Thêm Dự Án', content, () => this.saveProject());
  }

  editProject(index) {
    this.editingIndex = index;
    const project = this.dataLoader.getProjects()[index];
    const content = this.getProjectForm(project);
    this.openModal('Sửa Dự Án', content, () => this.saveProject());
  }

  getProjectForm(project = {}) {
    return `
      <div class="form-group">
        <label>Tên Dự Án *</label>
        <input type="text" id="project_title" value="${project.title || ''}" required>
      </div>
      <div class="form-group">
        <label>Mô Tả *</label>
        <textarea id="project_description" rows="3" required>${project.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Link Ảnh</label>
        <input type="url" id="project_image" value="${project.image || ''}">
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Link GitHub</label>
          <input type="url" id="project_github" value="${project.github || ''}">
        </div>
        <div class="form-group">
          <label>Link Demo</label>
          <input type="url" id="project_demo" value="${project.demo || ''}">
        </div>
      </div>
      <div class="form-group">
        <label>Công Nghệ (cách nhau bởi dấu phẩy)</label>
        <input type="text" id="project_technologies" value="${project.technologies ? project.technologies.join(', ') : ''}">
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" id="project_featured" ${project.featured ? 'checked' : ''}>
          Dự án nổi bật
        </label>
      </div>
    `;
  }

  saveProject() {
    const project = {
      id: this.editingIndex !== null ? this.dataLoader.getProjects()[this.editingIndex].id : Date.now(),
      title: document.getElementById('project_title').value,
      description: document.getElementById('project_description').value,
      image: document.getElementById('project_image').value,
      github: document.getElementById('project_github').value,
      demo: document.getElementById('project_demo').value,
      technologies: document.getElementById('project_technologies').value.split(',').map(t => t.trim()).filter(t => t),
      featured: document.getElementById('project_featured').checked
    };

    const projects = this.dataLoader.getProjects();
    if (this.editingIndex !== null) {
      projects[this.editingIndex] = project;
    } else {
      projects.push(project);
    }

    this.dataLoader.data.projects = projects;
    this.saveToStorage();
    this.renderProjectsTab();
    this.showStatus('Đã lưu dự án!', 'success');
    return true;
  }

  deleteProject(index) {
    if (confirm('Bạn có chắc muốn xóa dự án này?')) {
      const projects = this.dataLoader.getProjects();
      projects.splice(index, 1);
      this.dataLoader.data.projects = projects;
      this.saveToStorage();
      this.renderProjectsTab();
      this.showStatus('Đã xóa dự án!', 'success');
    }
  }

  // ========== SOCIAL ==========
  renderSocialTab() {
    const social = this.dataLoader.getSocial();
    const container = document.getElementById('socialTab');

    let html = `
      <div class="form-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <h3><i class="fas fa-share-alt"></i> Mạng Xã Hội</h3>
          <button class="btn btn-primary btn-small" onclick="portfolioManager.addSocial()">
            <i class="fas fa-plus"></i> Thêm Link
          </button>
        </div>
        <div class="list-container">
    `;

    if (social.length === 0) {
      html += `
        <div class="empty-state">
          <i class="fas fa-share-alt"></i>
          <p>Chưa có link mạng xã hội</p>
        </div>
      `;
    } else {
      social.forEach((link, index) => {
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title">${link.name}</div>
              <div class="list-item-meta">${link.url}</div>
            </div>
            <div class="list-item-actions">
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.editSocial(${index})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-secondary btn-icon" onclick="portfolioManager.deleteSocial(${index})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    container.innerHTML = html;
  }

  addSocial() {
    this.editingIndex = null;
    const content = this.getSocialForm();
    this.openModal('Thêm Mạng Xã Hội', content, () => this.saveSocial());
  }

  editSocial(index) {
    this.editingIndex = index;
    const link = this.dataLoader.getSocial()[index];
    const content = this.getSocialForm(link);
    this.openModal('Sửa Mạng Xã Hội', content, () => this.saveSocial());
  }

  getSocialForm(link = {}) {
    return `
      <div class="form-group">
        <label>Tên *</label>
        <input type="text" id="social_name" value="${link.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Icon *</label>
        <select id="social_icon" required>
          <option value="linkedin" ${link.icon === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
          <option value="github" ${link.icon === 'github' ? 'selected' : ''}>GitHub</option>
          <option value="twitter" ${link.icon === 'twitter' ? 'selected' : ''}>Twitter</option>
          <option value="facebook" ${link.icon === 'facebook' ? 'selected' : ''}>Facebook</option>
          <option value="instagram" ${link.icon === 'instagram' ? 'selected' : ''}>Instagram</option>
          <option value="email" ${link.icon === 'email' ? 'selected' : ''}>Email</option>
        </select>
      </div>
      <div class="form-group">
        <label>URL *</label>
        <input type="url" id="social_url" value="${link.url || ''}" required>
      </div>
    `;
  }

  saveSocial() {
    const link = {
      name: document.getElementById('social_name').value,
      icon: document.getElementById('social_icon').value,
      url: document.getElementById('social_url').value
    };

    const social = this.dataLoader.getSocial();
    if (this.editingIndex !== null) {
      social[this.editingIndex] = link;
    } else {
      social.push(link);
    }

    this.dataLoader.data.social = social;
    this.saveToStorage();
    this.renderSocialTab();
    this.showStatus('Đã lưu link mạng xã hội!', 'success');
    return true;
  }

  deleteSocial(index) {
    if (confirm('Bạn có chắc muốn xóa link này?')) {
      const social = this.dataLoader.getSocial();
      social.splice(index, 1);
      this.dataLoader.data.social = social;
      this.saveToStorage();
      this.renderSocialTab();
      this.showStatus('Đã xóa link!', 'success');
    }
  }

  // ========== UTILITIES ==========
  async saveToStorage() {
    // Save to localStorage for offline access
    localStorage.setItem('portfolioData', JSON.stringify(this.dataLoader.data));

    // Save to backend API
    try {
      await window.apiClient.updatePortfolio(this.dataLoader.data);
      console.log('✅ Data saved to backend');
    } catch (error) {
      console.error('❌ Failed to save to backend:', error);
      this.showStatus('Lưu local thành công, nhưng không kết nối được backend!', 'error');
    }
  }

  async saveAll() {
    await this.saveToStorage();
    this.showStatus('Đã lưu tất cả dữ liệu lên backend!', 'success');
  }

  showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;

    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 5000);
  }

  formatDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr === 'Present') return 'Hiện tại';
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('vi-VN', options);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioManager = new PortfolioManager();
});

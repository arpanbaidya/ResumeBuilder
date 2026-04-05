// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial State ---
    let state = {
        personal: {
            name: 'John Doe',
            title: 'Frontend Developer',
            email: 'john@example.com',
            phone: '+1 234 567 890',
            location: 'New York, NY',
            link: 'linkedin.com/in/johndoe',
            summary: 'Creative and detail-oriented Frontend Developer with 4 years of experience building responsive web applications using JavaScript, React, and modern CSS architecture.'
        },
        experience: [
            {
                id: Date.now().toString(),
                title: 'Senior Frontend Engineer',
                company: 'TechCorp Solutions',
                date: 'Present - Jan 2022',
                desc: 'Led the development of a company-wide internal dashboard framework, reducing load times by 40%.'
            }
        ],
        education: [
            {
                id: Date.now().toString(),
                degree: 'B.S. in Computer Science',
                school: 'State University',
                date: 'May 2020'
            }
        ],
        skills: 'JavaScript, HTML5, CSS3, React, Node.js, Git, Figma',
        projects: [
            {
                id: Date.now().toString(),
                name: 'E-commerce React SPA',
                desc: 'A full-stack e-commerce solution with Stripe integration.'
            }
        ],
        certs: [
            {
                id: Date.now().toString(),
                name: 'AWS Certified Cloud Practitioner',
                date: '2023'
            }
        ],
        template: 'minimal'
    };

    // Global reference for initial render
    window.renderPreview = renderPreview;

    const previewContainer = document.getElementById('resume-preview-container');
    const templateSwitcher = document.getElementById('template-switcher');
    const editorTitle = document.getElementById('editor-title');
    
    // Form views
    const forms = {
        personal: document.getElementById('form-personal'),
        experience: document.getElementById('form-experience'),
        education: document.getElementById('form-education'),
        skills: document.getElementById('form-skills'),
        projects: document.getElementById('form-projects'),
        certs: document.getElementById('form-certs')
    };

    // --- Render Logic ---
    function renderPreview() {
        if(!previewContainer) return;
        
        // Fetch HTML from templates.js
        const tmplFn = window.ResumeTemplates[state.template];
        if(tmplFn) {
            previewContainer.innerHTML = tmplFn(state);
        }
    }

    // --- Template Switching ---
    templateSwitcher.addEventListener('change', (e) => {
        state.template = e.target.value;
        renderPreview();
    });

    // --- Left Nav Logic ---
    const navButtons = document.querySelectorAll('.left-panel .nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            navButtons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            const currentBtn = e.target.closest('.nav-btn');
            currentBtn.classList.add('active');
            
            // Switch title
            editorTitle.textContent = currentBtn.textContent.trim();
            
            // Switch form
            const target = currentBtn.getAttribute('data-target');
            Object.values(forms).forEach(f => {
                f.classList.remove('form-active');
                f.classList.add('form-hidden');
            });
            forms[target].classList.remove('form-hidden');
            forms[target].classList.add('form-active');
        });
    });

    // --- Form Bindings (Personal & Skills) ---
    const bindInput = (id, key, objectKey) => {
        const el = document.getElementById(id);
        if(!el) return;
        el.value = state[objectKey][key] || state[objectKey];
        el.addEventListener('input', (e) => {
            if(objectKey === 'skills') {
                state.skills = e.target.value;
            } else {
                state[objectKey][key] = e.target.value;
            }
            renderPreview();
        });
    };

    bindInput('input-name', 'name', 'personal');
    bindInput('input-title', 'title', 'personal');
    bindInput('input-email', 'email', 'personal');
    bindInput('input-phone', 'phone', 'personal');
    bindInput('input-location', 'location', 'personal');
    bindInput('input-link', 'link', 'personal');
    bindInput('input-summary', 'summary', 'personal');
    bindInput('input-skills', '', 'skills');

    // --- Dynamic Lists Binding ---

    // 1. Experience
    const renderExperienceForm = () => {
        const list = document.getElementById('experience-list');
        list.innerHTML = '';
        state.experience.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'multi-entry';
            div.innerHTML = `
                <button class="btn-remove-entry" onclick="window.removeExp('${item.id}')"><i class="ph ph-trash"></i></button>
                <div class="input-group">
                    <label>Job Title</label>
                    <input type="text" class="exp-input" data-id="${item.id}" data-type="title" value="${item.title}">
                </div>
                <div class="input-row" style="margin-top: 10px;">
                    <div class="input-group">
                        <label>Company</label>
                        <input type="text" class="exp-input" data-id="${item.id}" data-type="company" value="${item.company}">
                    </div>
                    <div class="input-group">
                        <label>Dates</label>
                        <input type="text" class="exp-input" data-id="${item.id}" data-type="date" value="${item.date}">
                    </div>
                </div>
                <div class="input-group" style="margin-top: 10px;">
                    <label>Description</label>
                    <textarea class="exp-input" rows="3" data-id="${item.id}" data-type="desc">${item.desc}</textarea>
                </div>
            `;
            list.appendChild(div);
        });
        
        document.querySelectorAll('.exp-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                const exp = state.experience.find(x => x.id === id);
                if(exp) {
                    exp[type] = e.target.value;
                    renderPreview();
                }
            });
        });
    };

    window.removeExp = (id) => {
        state.experience = state.experience.filter(x => x.id !== id);
        renderExperienceForm();
        renderPreview();
    };

    document.getElementById('btn-add-experience').addEventListener('click', () => {
        state.experience.push({ id: Date.now().toString(), title: '', company: '', date: '', desc: '' });
        renderExperienceForm();
        renderPreview();
    });

    renderExperienceForm();

    // 2. Education
    const renderEducationForm = () => {
        const list = document.getElementById('education-list');
        list.innerHTML = '';
        state.education.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'multi-entry';
            div.innerHTML = `
                <button class="btn-remove-entry" onclick="window.removeEdu('${item.id}')"><i class="ph ph-trash"></i></button>
                <div class="input-group">
                    <label>Degree / Course</label>
                    <input type="text" class="edu-input" data-id="${item.id}" data-type="degree" value="${item.degree}">
                </div>
                <div class="input-row" style="margin-top: 10px;">
                    <div class="input-group">
                        <label>School / University</label>
                        <input type="text" class="edu-input" data-id="${item.id}" data-type="school" value="${item.school}">
                    </div>
                    <div class="input-group">
                        <label>Dates</label>
                        <input type="text" class="edu-input" data-id="${item.id}" data-type="date" value="${item.date}">
                    </div>
                </div>
            `;
            list.appendChild(div);
        });

        document.querySelectorAll('.edu-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                const edu = state.education.find(x => x.id === id);
                if(edu) {
                    edu[type] = e.target.value;
                    renderPreview();
                }
            });
        });
    };

    window.removeEdu = (id) => {
        state.education = state.education.filter(x => x.id !== id);
        renderEducationForm();
        renderPreview();
    };

    document.getElementById('btn-add-education').addEventListener('click', () => {
        state.education.push({ id: Date.now().toString(), degree: '', school: '', date: '' });
        renderEducationForm();
        renderPreview();
    });

    renderEducationForm();

    // 3. Projects
    const renderProjectForm = () => {
        const list = document.getElementById('project-list');
        list.innerHTML = '';
        state.projects.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'multi-entry';
            div.innerHTML = `
                <button class="btn-remove-entry" onclick="window.removeProj('${item.id}')"><i class="ph ph-trash"></i></button>
                <div class="input-group">
                    <label>Project Name</label>
                    <input type="text" class="proj-input" data-id="${item.id}" data-type="name" value="${item.name}">
                </div>
                <div class="input-group" style="margin-top: 10px;">
                    <label>Description</label>
                    <textarea class="proj-input" rows="2" data-id="${item.id}" data-type="desc">${item.desc}</textarea>
                </div>
            `;
            list.appendChild(div);
        });

        document.querySelectorAll('.proj-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                const proj = state.projects.find(x => x.id === id);
                if(proj) {
                    proj[type] = e.target.value;
                    renderPreview();
                }
            });
        });
    };

    window.removeProj = (id) => {
        state.projects = state.projects.filter(x => x.id !== id);
        renderProjectForm();
        renderPreview();
    };

    document.getElementById('btn-add-project').addEventListener('click', () => {
        state.projects.push({ id: Date.now().toString(), name: '', desc: '' });
        renderProjectForm();
        renderPreview();
    });

    renderProjectForm();

    // 4. Certifications
    const renderCertForm = () => {
        const list = document.getElementById('cert-list');
        list.innerHTML = '';
        state.certs.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'multi-entry';
            div.innerHTML = `
                <button class="btn-remove-entry" onclick="window.removeCert('${item.id}')"><i class="ph ph-trash"></i></button>
                <div class="input-group">
                    <label>Certification Name</label>
                    <input type="text" class="cert-input" data-id="${item.id}" data-type="name" value="${item.name}">
                </div>
                <div class="input-group" style="margin-top: 10px;">
                    <label>Date</label>
                    <input type="text" class="cert-input" data-id="${item.id}" data-type="date" value="${item.date}">
                </div>
            `;
            list.appendChild(div);
        });

        document.querySelectorAll('.cert-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.getAttribute('data-id');
                const type = e.target.getAttribute('data-type');
                const cert = state.certs.find(x => x.id === id);
                if(cert) {
                    cert[type] = e.target.value;
                    renderPreview();
                }
            });
        });
    };

    window.removeCert = (id) => {
        state.certs = state.certs.filter(x => x.id !== id);
        renderCertForm();
        renderPreview();
    };

    document.getElementById('btn-add-cert').addEventListener('click', () => {
        state.certs.push({ id: Date.now().toString(), name: '', date: '' });
        renderCertForm();
        renderPreview();
    });

    renderCertForm();
});

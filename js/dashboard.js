// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Initial State (ATS-optimised demo content) ---
    let state = {
        personal: {
            name: 'Alex Johnson',
            title: 'Full Stack Engineer',
            email: 'alex.johnson@email.com',
            phone: '+1 (555) 867-5309',
            location: 'San Francisco, CA',
            link: 'linkedin.com/in/alexjohnson',
            summary: 'Results-driven Software Engineer with 5+ years of experience. Designed scalable web applications using React and Node.js. Achieved a 40% improvement in system performance.'
        },
        experience: [
            {
                id: Date.now().toString(),
                title: 'Senior Software Engineer',
                company: 'CloudScale Technologies',
                date: 'Jan 2022 – Present',
                desc: 'Led a team of 6 engineers to design a microservices architecture, reducing deployment time by 60%;Developed a real-time analytics dashboard using React, increasing data visibility for 500+ stakeholders;Coordinated releases achieving 99.9% uptime'
            },
            {
                id: (Date.now() + 1).toString(),
                title: 'Software Engineer',
                company: 'DataBridge Inc.',
                date: 'Jun 2019 – Dec 2021',
                desc: 'Managed development of 3 web applications serving 10,000+ active users;Implemented CI/CD pipelines reducing manual testing by 35%'
            }
        ],
        education: [
            {
                id: Date.now().toString(),
                degree: 'B.S. Computer Science',
                school: 'UC Berkeley',
                date: 'May 2019'
            }
        ],
        skills: 'JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Docker',
        projects: [
            {
                id: Date.now().toString(),
                name: 'TaskFlow SaaS',
                desc: 'Designed a full-stack SaaS application using React and PostgreSQL;Achieved sub-200ms response times through optimised queries'
            }
        ],
        certs: [
            {
                id: Date.now().toString(),
                name: 'AWS Solutions Architect – Assoc.',
                date: '2023'
            }
        ],
        template: 'minimal'
    };
    
    // (Autosave feature removed per user request)

    // Global reference for initial render
    window.renderPreview = renderPreview;

    // Global helper: extract plain text from current state for ATS scoring
    window.getResumeText = () => {
        let text = 'Summary\n';
        if (state.personal) {
            text += `${state.personal.name} ${state.personal.title} ${state.personal.email} ${state.personal.phone} ${state.personal.summary}\n`;
        }
        
        // Helper to format descriptions as bullet points for ATS checker
        const formatDesc = (desc) => {
            if (!desc) return '';
            return desc.split(/[\n;]+/).map(s => s.trim() ? `• ${s.trim()}` : '').join('\n');
        };

        text += 'Experience\n';
        if (state.experience) {
            state.experience.forEach(e => {
                text += `${e.title} ${e.company} ${e.date}\n${formatDesc(e.desc)}\n`;
            });
        }
        text += 'Education\n';
        if (state.education) {
            state.education.forEach(e => {
                text += `${e.degree} ${e.school} ${e.date}\n`;
            });
        }
        text += 'Skills\n' + (state.skills || '') + '\n';
        text += 'Projects\n';
        if (state.projects) {
            state.projects.forEach(p => {
                text += `${p.name}\n${formatDesc(p.desc)}\n`;
            });
        }
        text += 'Certifications\n';
        if (state.certs) {
            state.certs.forEach(c => {
                text += `${c.name} ${c.date}\n`;
            });
        }
        return text;
    };

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
        if (!previewContainer) return;

        // Fetch HTML from templates.js
        const tmplFn = window.ResumeTemplates[state.template];
        if (tmplFn) {
            const html = tmplFn(state);
            previewContainer.innerHTML = html;
            // Sync the fullscreen overlay preview
            const overlayWrapper = document.getElementById('resume-wrapper-overlay');
            if (overlayWrapper) overlayWrapper.innerHTML = html;
        }

        // --- ENFORCE STRICT 1 PAGE LIMIT ---
        const wrapper = document.getElementById('resume-wrapper');
        if (wrapper && previewContainer) {
            // Approx 297mm in pixels at 96dpi (1122.5), giving slight tolerance
            const A4_MAX_HEIGHT = 1122; 
            
            // Measure natural unconstrained height
            wrapper.style.maxHeight = 'none';
            wrapper.style.overflow = 'visible';
            const currentHeight = previewContainer.scrollHeight;
            
            // Reapply strict constraints
            wrapper.style.maxHeight = '297mm';
            wrapper.style.overflow = 'hidden';

            const dashboardPage = document.getElementById('dashboard-page');
            const alertElement = document.getElementById('overflow-alert');

            if (currentHeight > A4_MAX_HEIGHT) {
                document.body.classList.add('page-overflowing');
                if (alertElement) alertElement.classList.add('show');
            } else {
                document.body.classList.remove('page-overflowing');
                if (alertElement) alertElement.classList.remove('show');
            }
        }
    }

    // Intercept typing globally if document is overflowing
    document.addEventListener('keydown', (e) => {
        if (document.body.classList.contains('page-overflowing')) {
            // Check if user is typing inside the editor panel
            if (e.target.closest('.center-panel')) {
                // Allow deletion, navigation, and shortcuts (Ctrl/Cmd)
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'];
                if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    // Jiggle the toast to tell them to delete
                    const alertElement = document.getElementById('overflow-alert');
                    if(alertElement) {
                        alertElement.classList.add('jiggle');
                        setTimeout(() => alertElement.classList.remove('jiggle'), 300);
                    }
                }
            }
        }
    });

    // --- Template Switching ---
    // Sync the select element with the restored state
    if (templateSwitcher) templateSwitcher.value = state.template;

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

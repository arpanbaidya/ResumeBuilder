// templates.js

// CSS configurations for each template injected directly or handled via scoped CSS
const commonResumeStyles = `
    <style>
        .template-body { width: 100%; height: 100%; font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .template-body h1, .template-body h2, .template-body h3, .template-body p { margin: 0; padding: 0; }
        .template-header { margin-bottom: 20px; }
        .section-title { font-weight: 700; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid; padding-bottom: 4px;}
        .item-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
        .item-title { font-weight: 600; font-size: 14px;}
        .item-subtitle { font-style: italic; font-size: 13px; color: #555; }
        .item-date { font-size: 12px; color: #666; font-weight: 500;}
        .item-desc { font-size: 13px; margin-bottom: 12px; line-height: 1.4; color: #333;}
        .skills-list { font-size: 13px; color: #333; }
        
        /* Layouts */
        .layout-split { display: grid; grid-template-columns: 280px 1fr; height: 100%; }
        .sidebar { background: #f3f4f6; padding: 30px; }
        .main-content { padding: 30px 40px; }
    </style>
`;

// Helper: split a description string into bullet lines
const toBullets = (desc) => {
    if (!desc) return '';
    // If the text already contains newlines or semicolons, split on them
    const lines = desc.split(/[\n;]+/).map(s => s.trim()).filter(Boolean);
    if (lines.length <= 1) {
        // single block — emit as one bullet
        return `<div style="margin-bottom:4px;">• ${desc.trim()}</div>`;
    }
    return lines.map(l => `<div style="margin-bottom:3px;">• ${l}</div>`).join('');
};

// Helper function to build lists
const buildExpList = (items) => {
    if (!items || items.length === 0) return '';
    return items.map(item => `
        <div style="margin-bottom:12px;">
            <div class="item-row">
                <span class="item-title">${item.title}</span>
                <span class="item-date">${item.date}</span>
            </div>
            <div class="item-subtitle">${item.company}</div>
            <div class="item-desc" style="margin-top:4px;">${toBullets(item.desc)}</div>
        </div>
    `).join('');
};

const buildEduList = (items) => {
    if(!items || items.length === 0) return '';
    return items.map(item => `
        <div>
            <div class="item-row">
                <span class="item-title">${item.degree}</span>
                <span class="item-date">${item.date}</span>
            </div>
            <div class="item-subtitle">${item.school}</div>
        </div>
    `).join('');
};

const buildProjList = (items) => {
    if (!items || items.length === 0) return '';
    return items.map(item => `
        <div style="margin-bottom:10px;">
            <div class="item-title">${item.name}</div>
            <div class="item-desc" style="margin-top:3px;">${toBullets(item.desc)}</div>
        </div>
    `).join('');
};

window.ResumeTemplates = {
    minimal: (data) => `
        ${commonResumeStyles}
        <div class="template-body" style="padding: 40px; color: #111;">
            <div class="template-header" style="text-align: center;">
                <h1 style="font-size: 32px; letter-spacing: 1px;">${data.personal.name || 'John Doe'}</h1>
                <p style="font-size: 16px; color: #555; margin-top: 5px;">${data.personal.title || 'Professional Title'}</p>
                <div style="font-size: 13px; margin-top: 10px; display: flex; justify-content: center; gap: 15px; color: #444;">
                    ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
                    ${data.personal.phone ? `<span>| ${data.personal.phone}</span>` : ''}
                    ${data.personal.location ? `<span>| ${data.personal.location}</span>` : ''}
                    ${data.personal.link ? `<span>| ${data.personal.link}</span>` : ''}
                </div>
            </div>
            ${data.personal.summary ? `<p style="font-size: 13px; text-align: center; margin-bottom: 25px; line-height: 1.5; padding: 0 40px;">${data.personal.summary}</p>` : ''}
            
            ${data.experience.length ? `
                <div style="margin-bottom: 20px;">
                    <h2 class="section-title" style="border-color: #333; font-size: 16px;">Professional Experience</h2>
                    ${buildExpList(data.experience)}
                </div>
            ` : ''}

            ${data.education.length ? `
                <div style="margin-bottom: 20px;">
                    <h2 class="section-title" style="border-color: #333; font-size: 16px;">Education</h2>
                    ${buildEduList(data.education)}
                </div>
            ` : ''}

            ${data.skills ? `
                <div style="margin-bottom: 20px;">
                    <h2 class="section-title" style="border-color: #333; font-size: 16px;">Skills</h2>
                    <p class="skills-list">${data.skills}</p>
                </div>
            ` : ''}

            ${data.projects.length ? `
                <div style="margin-bottom: 20px;">
                    <h2 class="section-title" style="border-color: #333; font-size: 16px;">Projects</h2>
                    ${buildProjList(data.projects)}
                </div>
            ` : ''}

            ${data.certs.length ? `
                <div style="margin-bottom: 20px;">
                    <h2 class="section-title" style="border-color: #333; font-size: 16px;">Certifications</h2>
                    <ul style="margin:0; padding-left: 20px; font-size: 13px;">
                        ${data.certs.map(c => `<li>${c.name} - ${c.date}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `,

    modern: (data) => `
        ${commonResumeStyles}
        <div class="template-body layout-split" style="color: #1a202c;">
            <div class="sidebar" style="background-color: #2b6cb0; color: white;">
                <h1 style="font-size: 28px; line-height: 1.1; margin-bottom: 10px;">${data.personal.name || 'John Doe'}</h1>
                <p style="font-size: 16px; color: #ebf8ff; margin-bottom: 30px;">${data.personal.title || 'Professional Title'}</p>
                
                <h3 style="font-size: 14px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px;">Contact</h3>
                <div style="font-size: 13px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 30px; opacity: 0.9;">
                    <span>${data.personal.email || 'email@example.com'}</span>
                    <span>${data.personal.phone || 'Phone Number'}</span>
                    <span>${data.personal.location || 'Location'}</span>
                    <span>${data.personal.link || 'LinkedIn/Portfolio'}</span>
                </div>

                ${data.skills ? `
                    <h3 style="font-size: 14px; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 4px;">Skills</h3>
                    <div style="font-size: 13px; display: flex; flex-direction: column; gap: 5px; opacity: 0.9;">
                        ${data.skills.split(',').map(s => `<span>• ${s.trim()}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="main-content">
                ${data.personal.summary ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; color: #2b6cb0; margin-bottom: 10px; text-transform: uppercase;">Profile</h2>
                        <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">${data.personal.summary}</p>
                    </div>
                ` : ''}

                ${data.experience.length ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; color: #2b6cb0; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Experience</h2>
                        ${buildExpList(data.experience)}
                    </div>
                ` : ''}

                ${data.education.length ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; color: #2b6cb0; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Education</h2>
                        ${buildEduList(data.education)}
                    </div>
                ` : ''}

                ${data.projects.length ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; color: #2b6cb0; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Projects</h2>
                        ${buildProjList(data.projects)}
                    </div>
                ` : ''}

                ${data.certs.length ? `
                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; color: #2b6cb0; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Certifications</h2>
                        <ul style="margin:0; padding-left: 20px; font-size: 14px; color: #4a5568;">
                            ${data.certs.map(c => `<li style="margin-bottom:5px"><b>${c.name}</b> — ${c.date}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `,

    creative: (data) => `
        ${commonResumeStyles}
        <div class="template-body" style="padding: 40px; font-family: 'Outfit', sans-serif;">
            <div style="display: flex; gap: 40px; align-items: flex-start; margin-bottom: 30px;">
                <div style="flex: 1;">
                    <h1 style="font-size: 42px; color: #e11d48; margin-bottom: 5px; line-height: 1;">${data.personal.name || 'John<br>Doe'}</h1>
                    <p style="font-size: 20px; font-weight: 500; color: #333;">${data.personal.title || 'Creative Technologist'}</p>
                </div>
                <div style="flex: 1; text-align: right; font-size: 13px; color: #555; display: flex; flex-direction: column; gap: 5px;">
                    <span>${data.personal.email}</span>
                    <span>${data.personal.phone}</span>
                    <span>${data.personal.location}</span>
                    <span style="color: #e11d48; font-weight: 600;">${data.personal.link}</span>
                </div>
            </div>
            
            ${data.personal.summary ? `<div style="background: #fff1f2; padding: 20px; border-left: 4px solid #e11d48; border-radius: 4px; font-size: 14px; margin-bottom: 30px; line-height: 1.6; color: #4c0519;">${data.personal.summary}</div>` : ''}

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
                <div>
                     ${data.experience.length ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 22px; color: #111; margin-bottom: 15px;">Experience</h2>
                            ${buildExpList(data.experience)}
                        </div>
                    ` : ''}

                    ${data.projects.length ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 22px; color: #111; margin-bottom: 15px;">Selected Projects</h2>
                            ${buildProjList(data.projects)}
                        </div>
                    ` : ''}

                    ${data.certs.length ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 22px; color: #111; margin-bottom: 15px;">Certifications</h2>
                            <ul style="list-style: none; margin: 0; padding: 0;">
                                ${data.certs.map(c => `<li style="font-size:14px; margin-bottom:8px;">• <b>${c.name}</b> <span style="color:#666">(${c.date})</span></li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div>
                    ${data.skills ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 22px; color: #111; margin-bottom: 15px;">Expertise</h2>
                            <div style="display:flex; flex-wrap: wrap; gap: 8px;">
                                ${data.skills.split(',').map(s => `<span style="background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;">${s.trim()}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${data.education.length ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 22px; color: #111; margin-bottom: 15px;">Education</h2>
                            ${buildEduList(data.education)}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `,

    corporate: (data) => `
        ${commonResumeStyles}
        <div class="template-body" style="padding: 40px; font-family: 'Times New Roman', serif; color: #000;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="font-size: 28px; text-transform: uppercase; margin-bottom: 5px;">${data.personal.name || 'John Doe'}</h1>
                <div style="font-size: 13px;">
                    ${data.personal.location ? `${data.personal.location} | ` : ''}
                    ${data.personal.phone ? `${data.personal.phone} | ` : ''}
                    ${data.personal.email ? `${data.personal.email}` : ''}
                    ${data.personal.link ? ` | ${data.personal.link}` : ''}
                </div>
            </div>

            ${data.personal.summary ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5px;">Summary</h2>
                    <p style="font-size: 13px; line-height: 1.4;">${data.personal.summary}</p>
                </div>
            ` : ''}

            ${data.experience.length ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 8px;">Professional Experience</h2>
                    ${buildExpList(data.experience)}
                </div>
            ` : ''}

            ${data.education.length ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 8px;">Education</h2>
                    ${buildEduList(data.education)}
                </div>
            ` : ''}

            ${data.projects.length ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 8px;">Projects</h2>
                    ${buildProjList(data.projects)}
                </div>
            ` : ''}

            ${data.certs.length ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 8px;">Certifications</h2>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
                        ${data.certs.map(c => `<li><b>${c.name}</b>, ${c.date}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${data.skills ? `
                <div style="margin-bottom: 15px;">
                    <h2 style="font-size: 14px; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5px;">Technical Skills</h2>
                    <p style="font-size: 13px;">${data.skills}</p>
                </div>
            ` : ''}
        </div>
    `,

    tech: (data) => `
        ${commonResumeStyles}
        <div class="template-body" style="padding: 40px; background: #0f172a; color: #e2e8f0; font-family: monospace;">
            <div style="margin-bottom: 30px;">
                <h1 style="color: #38bdf8; font-size: 32px;">> ${data.personal.name || 'John Doe'}_</h1>
                <p style="font-size: 16px; color: #94a3b8;">${data.personal.title || 'Software Engineer'}</p>
                <div style="font-size: 13px; color: #64748b; margin-top: 10px;">
                    ${data.personal.email} // ${data.personal.phone} // ${data.personal.location} // ${data.personal.link}
                </div>
            </div>

            ${data.personal.summary ? `
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 13px; line-height: 1.6;">/* ${data.personal.summary} */</p>
                </div>
            ` : ''}

            ${data.skills ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 10px;">[ Skills ]</h2>
                    <div style="display:flex; flex-wrap:wrap; gap:10px;">
                        ${data.skills.split(',').map(s => `<span style="border: 1px solid #334155; padding: 2px 8px; font-size: 12px;">${s.trim()}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${data.experience.length ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 15px;">[ Experience ]</h2>
                    ${data.experience.map(item => `
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                <strong style="color: #6ee7b7;">${item.title}</strong>
                                <span style="color: #64748b;">${item.date}</span>
                            </div>
                            <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 5px;">@${item.company}</div>
                            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${data.education.length ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 15px;">[ Education ]</h2>
                    ${data.education.map(item => `
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; font-size: 14px;">
                                <strong>${item.degree}</strong>
                                <span style="color: #64748b;">${item.date}</span>
                            </div>
                            <div style="font-size: 13px; color: #94a3b8;">${item.school}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${data.projects.length ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 15px;">[ Projects ]</h2>
                    ${data.projects.map(item => `
                        <div style="margin-bottom: 15px;">
                            <div style="font-size: 14px;"><strong style="color: #6ee7b7;">${item.name}</strong></div>
                            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 5px;">${item.desc}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${data.certs.length ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 10px;">[ Certifications ]</h2>
                    <ul style="list-style: none; margin: 0; padding: 0;">
                        ${data.certs.map(c => `<li style="font-size:13px; margin-bottom:5px">-- <span style="color:#e2e8f0;">${c.name}</span> (<span style="color:#64748b">${c.date}</span>)</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `,

    elegant: (data) => `
        ${commonResumeStyles}
        <div class="template-body" style="padding: 50px; font-family: 'Georgia', serif; color: #333;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 36px; font-weight: normal; letter-spacing: 2px; color: #000;">${data.personal.name || 'John Doe'}</h1>
                <p style="font-style: italic; color: #666; font-size: 16px; margin: 5px 0 15px 0;">${data.personal.title || 'Professional Title'}</p>
                <div style="font-size: 12px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 1px; color: #888;">
                    ${data.personal.email} &nbsp;·&nbsp; ${data.personal.phone} &nbsp;·&nbsp; ${data.personal.location} &nbsp;·&nbsp; ${data.personal.link}
                </div>
            </div>

            ${data.personal.summary ? `
                <div style="text-align: center; max-width: 80%; margin: 0 auto 40px auto; font-size: 14px; line-height: 1.8; color: #444;">
                    ${data.personal.summary}
                </div>
            ` : ''}

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 40px;">
                <div style="border-right: 1px solid #eee; padding-right: 40px;">
                    ${data.skills ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin-bottom: 15px;">Skills</h2>
                            <p style="font-size: 13px; line-height: 1.8; color: #555;">${data.skills}</p>
                        </div>
                    ` : ''}

                    ${data.education.length ? `
                        <div style="margin-bottom: 30px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin-bottom: 15px;">Education</h2>
                            ${data.education.map(item => `
                                <div style="margin-bottom: 15px;">
                                    <div style="font-weight: bold; font-size: 13px; color: #222;">${item.degree}</div>
                                    <div style="font-size: 12px; color: #666; margin-bottom: 2px;">${item.school}</div>
                                    <div style="font-size: 11px; font-style: italic; color: #999;">${item.date}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div>
                     ${data.experience.length ? `
                        <div style="margin-bottom: 40px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin-bottom: 15px;">Experience</h2>
                            ${data.experience.map(item => `
                                <div style="margin-bottom: 20px;">
                                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                                        <b style="font-size: 15px; color: #222;">${item.company}</b>
                                        <span style="font-size: 12px; font-style: italic; color: #888;">${item.date}</span>
                                    </div>
                                    <div style="font-size: 14px; margin-bottom: 8px; color: #555;">${item.title}</div>
                                    <p style="font-size: 13px; line-height: 1.6; color: #555;">${item.desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${data.projects.length ? `
                        <div style="margin-bottom: 40px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin-bottom: 15px;">Projects</h2>
                            ${data.projects.map(item => `
                                <div style="margin-bottom: 20px;">
                                    <b style="font-size: 15px; color: #222; display:block; margin-bottom:4px;">${item.name}</b>
                                    <p style="font-size: 13px; line-height: 1.6; color: #555;">${item.desc}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${data.certs.length ? `
                        <div style="margin-bottom: 40px;">
                            <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #000; margin-bottom: 15px;">Certifications</h2>
                            <ul style="margin:0; padding-left:15px; font-size:13px; color:#444;">
                                ${data.certs.map(c => `<li><b>${c.name}</b>, ${c.date}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `
};

// Generate mock thumbnails for landing page
document.addEventListener('DOMContentLoaded', () => {
    const landingGrid = document.getElementById('landing-templates-grid');
    if(landingGrid) {
        // Since we don't naturally have images, we will generate placeholder gradient mockups
        const templateKeys = Object.keys(window.ResumeTemplates);
        // Map to nice colors
        const colors = [
            'linear-gradient(to bottom, #fdfbfb, #ebedee)', // minimal
            'linear-gradient(to right, #2b6cb0, #2c5282)', // modern
            'linear-gradient(to right, #ffe4e6, #fff1f2)', // creative
            'linear-gradient(to right, #f8f9fa, #e9ecef)', // corporate
            'linear-gradient(to right, #0f172a, #1e293b)', // tech
            'linear-gradient(to bottom, #fff, #f6f3eb)'    // elegant
        ];
        
        let htmlSnippet = '';
        templateKeys.forEach((key, idx) => {
            htmlSnippet += `
                <div class="template-thumb" id="thumb-${key}">
                    <!-- Mocking the template preview using a background -->
                    <div style="width: 100%; height: 100%; background: ${colors[idx % colors.length]}; display:flex; align-items:center; justify-content:center; flex-direction:column; padding: 20px; text-align:center;">
                        <h3 style="color: ${idx === 4 ? '#38bdf8' : (idx===1 ? '#fff' : '#333')}; font-size: 24px; font-family: ${idx === 4 ? 'monospace' : (idx===5 ? 'Georgia' : 'Inter')};">${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                        <div style="width: 60%; height: 4px; background: rgba(0,0,0,0.1); margin-top: 10px; border-radius: 2px;"></div>
                        <div style="width: 80%; height: 4px; background: rgba(0,0,0,0.1); margin-top: 10px; border-radius: 2px;"></div>
                        <div style="width: 40%; height: 4px; background: rgba(0,0,0,0.1); margin-top: 10px; border-radius: 2px;"></div>
                    </div>
                    <div class="thumb-overlay">
                        <button class="btn btn-primary btn-select-template" data-template="${key}">Use Template</button>
                    </div>
                </div>
            `;
        });
        landingGrid.innerHTML = htmlSnippet;
        
        // Add listeners to Use Template buttons
        landingGrid.querySelectorAll('.btn-select-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tmpl = e.target.getAttribute('data-template');
                // Update the dashboard select AND fire change so state.template syncs
                const dashSelect = document.getElementById('template-switcher');
                if (dashSelect) {
                    dashSelect.value = tmpl;
                    dashSelect.dispatchEvent(new Event('change'));
                }
                // Navigate — renderPreview() runs after with the correct template
                document.getElementById('btn-hero-create').click();
            });
        });
    }
});

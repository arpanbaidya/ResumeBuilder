// ats.js

document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('ats-upload-zone');
    const fileInput = document.getElementById('ats-file-input');
    const btnBrowse = document.getElementById('btn-browse-file');
    const statusDiv = document.getElementById('upload-status');
    const fileNameDisplay = document.getElementById('file-name-display');
    const btnAnalyze = document.getElementById('btn-analyze-resume');
    const jdInput = document.getElementById('ats-jd-input');
    const resultsPanel = document.getElementById('ats-results');
    const btnRemoveFile = document.getElementById('btn-remove-file');
    
    // Scoring UI
    const scoreCirclePath = document.getElementById('score-circle-path');
    const finalScoreDisplay = document.getElementById('final-score');
    const scoreMessage = document.getElementById('score-message');
    const feedbackList = document.getElementById('feedback-list');

    let currentFile = null;
    let extractedText = "";

    // Drag & Drop
    uploadZone.addEventListener('click', (e) => {
        if(e.target !== btnBrowse) fileInput.click();
    });
    btnBrowse.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelection(e.target.files[0]);
        }
    });

    function handleFileSelection(file) {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a PDF or DOCX file.");
            return;
        }
        currentFile = file;
        fileNameDisplay.textContent = file.name;
        statusDiv.classList.remove('hidden');
        uploadZone.style.display = 'none'; // Optional: hide upload zone or keep it
    }

    btnRemoveFile.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = "";
        statusDiv.classList.add('hidden');
        uploadZone.style.display = 'flex';
        resultsPanel.style.display = 'none';
        btnAnalyze.disabled = false;
        btnAnalyze.innerHTML = '<i class="ph ph-magic-wand"></i> Analyze Resume';
        scoreCirclePath.setAttribute('stroke-dasharray', `0, 100`);
        finalScoreDisplay.textContent = '0';
        scoreMessage.textContent = '';
        feedbackList.innerHTML = '';
    });

    btnAnalyze.addEventListener('click', async () => {
        if (!currentFile) {
            alert('Please upload a resume first.');
            return;
        }

        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing...';
        resultsPanel.style.display = 'none';

        try {
            if (currentFile.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(currentFile);
            } else {
                extractedText = await extractTextFromDOCX(currentFile);
            }
            
            const jdText = jdInput.value.trim();
            runATSScoring(extractedText, jdText);

            resultsPanel.style.display = 'flex';
            resultsPanel.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("Extraction error:", error);
            alert("Failed to analyze the file. Please check if it's a valid PDF/DOCX and try again.");
        } finally {
            btnAnalyze.disabled = false;
            btnAnalyze.innerHTML = '<i class="ph ph-magic-wand"></i> Analyze Resume';
        }
    });

    // --- Parsing Functions ---

    async function extractTextFromPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Position-aware extraction: only insert a space between items when
            // the rendered gap is large enough to represent a real word boundary.
            // Naively joining with ' ' breaks tokens like email addresses because
            // pdf.js splits them into many small sub-items.
            let pageText = '';
            let prevRight = null;   // right edge of last item (x + width)
            let prevY    = null;    // baseline y of last item

            textContent.items.forEach(item => {
                if (!item.str) return;
                const x = item.transform[4];  // left edge x
                const y = item.transform[5];  // baseline y
                const w = item.width || 0;

                if (prevRight !== null) {
                    const gap = x - prevRight;
                    const avgCharWidth = w / (item.str.length || 1);

                    if (Math.abs(y - prevY) > 2) {
                        // Different baseline → new line
                        pageText += '\n';
                    } else if (gap > avgCharWidth * 0.25) {
                        // Meaningful horizontal gap → word boundary
                        pageText += ' ';
                    }
                    // gap <= 0.25 char widths → same token (e.g. parts of an email), no space
                }

                pageText += item.str;
                prevRight = x + w;
                prevY     = y;
            });

            text += pageText + "\n";
        }
        return text;
    }

    async function extractTextFromDOCX(file) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        return result.value;
    }

    // --- Scoring Engine ---

    function runATSScoring(text, jdText) {
        let totalScore = 0;
        let maxScore = 100;
        const feedback = [];

        const lowerText = text.toLowerCase();
        
        // 1. Keyword Matching & 4. Skills Relevance & 7. Job Description Match (Combined ~45% impact)
        // If JD is empty, we skip this and scale score.
        let jdWeight = 45;
        if (jdText.length > 10) {
            const jdWords = extractKeywords(jdText);
            let matchCount = 0;
            jdWords.forEach(word => {
                if(lowerText.includes(word)) matchCount++;
            });
            let keywordScore = 0;
            if (jdWords.length > 0) {
                const matchPercentage = matchCount / jdWords.length;
                keywordScore = Math.min(matchPercentage * jdWeight * 1.5, jdWeight); // allow 66% match to be full score
            }
            
            totalScore += keywordScore;

            if (keywordScore > jdWeight * 0.8) {
                feedback.push({ type: 'positive', title: 'Strong Keyword Match', desc: `Your resume matches highly against the provided Job Description.` });
            } else if (keywordScore > jdWeight * 0.4) {
                feedback.push({ type: 'warning', title: 'Moderate Keyword Match', desc: `Consider adding more specific keywords from the Job Description to boost your ATS viability.` });
            } else {
                feedback.push({ type: 'negative', title: 'Low Keyword Match', desc: `Your resume is missing many critical keywords from the Job Description.` });
            }
        } else {
            // JD is empty, adjust max score
            maxScore -= jdWeight;
            feedback.push({ type: 'warning', title: 'No Job Description Provided', desc: `Keyword matching and skill relevance were skipped. Paste a job description for a more accurate ATS score.` });
        }

        // 2. Resume Formatting (15% impact)
        // Check for normal text characters vs strange symbols usually found when tables/icons break parsing
        let formatScore = 15;
        const strangeCharsCount = (text.match(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g) || []).length;
        if (strangeCharsCount > 10) {
            formatScore -= 10;
            feedback.push({ type: 'negative', title: 'Complex Formatting Detected', desc: `Found non-standard characters. ATS scanners prefer standard fonts, left-aligned text, and no tables or text boxes.` });
        } else {
            feedback.push({ type: 'positive', title: 'Clean Formatting', desc: `The text is easily extractable. Standard fonts and clean layouts are best for ATS.` });
        }
        totalScore += formatScore;

        // 3. Section Structure (15% impact)
        // Each entry: { label (friendly name shown to user), synonyms (any match counts) }
        const sectionsToCheck = [
            { label: 'Experience',    synonyms: ['experience', 'work history', 'employment'] },
            { label: 'Education',     synonyms: ['education', 'academic', 'qualification'] },
            { label: 'Skills',        synonyms: ['skills', 'expertise', 'competencies', 'technologies'] },
            { label: 'Summary',       synonyms: ['summary', 'profile', 'objective', 'about', 'overview'] },
        ];
        let sectionScore = 0;
        const foundSections = [];
        const missingSections = [];

        sectionsToCheck.forEach(section => {
            const found = section.synonyms.some(syn => {
                const regex = new RegExp(`\\b${syn}\\b`, 'i');
                return regex.test(text);
            });
            if (found) {
                sectionScore += (15 / sectionsToCheck.length);
                foundSections.push(section.label);
            } else {
                missingSections.push(section.label);
            }
        });
        totalScore += sectionScore;

        if (missingSections.length === 0) {
            feedback.push({ type: 'positive', title: 'Standard Sections Found', desc: `All key sections detected: Experience, Education, Skills, and Summary/Profile.` });
        } else {
            feedback.push({ type: 'negative', title: 'Missing Core Sections', desc: `Ensure you have clear headings for: ${missingSections.join(', ')}.` });
        }


        // 5. Experience Quality (15% impact instead of 10% to fill gap)
        let expScore = 0;
        const actionVerbs = ['designed', 'managed', 'created', 'led', 'developed', 'implemented', 'achieved', 'improved', 'increased', 'coordinated'];
        let verbCount = 0;
        actionVerbs.forEach(verb => {
            if (lowerText.includes(verb)) verbCount++;
        });

        // quantifiable results
        const numbersMatch = (text.match(/\d+(%|\+)?|\$\d+/g) || []).length;

        if (verbCount >= 3) expScore += 7.5; else expScore += (verbCount * 2);
        if (numbersMatch >= 3) expScore += 7.5; else expScore += (numbersMatch * 2);
        
        if (expScore > 15) expScore = 15;
        totalScore += expScore;

        if (expScore >= 12) {
            feedback.push({ type: 'positive', title: 'Strong Experience Descriptions', desc: `Good use of action verbs and quantifiable results (numbers/percentages).` });
        } else {
            feedback.push({ type: 'warning', title: 'Experience Lacks Context', desc: `Boost your experience by adding more action verbs and quantifiable metrics (e.g., "Increased sales by 15%").` });
        }

        // 6. Readability (5% impact)
        let readScore = 5;
        const bulletPoints = (text.match(/•|- |\* /g) || []).length;
        if (bulletPoints < 5) {
            readScore = 2;
            feedback.push({ type: 'warning', title: 'Readability', desc: `Consider using more bullet points instead of long paragraphs. ATS systems parse bulleted lists more reliably.` });
        } else {
            feedback.push({ type: 'positive', title: 'Good Readability', desc: `Good use of bullet points for readability.` });
        }
        totalScore += readScore;

        // 8. Contact Information (5% impact)
        // Strip whitespace around @ and between digit groups before testing,
        // as a secondary safety net for any residual pdf.js extraction artefacts.
        let contactScore = 0;
        const normalised = text.replace(/\s+@\s+/g, '@').replace(/\s+\.\s+/g, '.');
        const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(normalised);
        const hasPhone = /\+?\d[\d\-\s().]{6,}\d/.test(text);
        
        if (hasEmail) contactScore += 2.5;
        if (hasPhone) contactScore += 2.5;

        totalScore += contactScore;

        if (hasEmail && hasPhone) {
            feedback.push({ type: 'positive', title: 'Contact Info Present', desc: `Email and phone number were successfully detected.` });
        } else {
            feedback.push({ type: 'negative', title: 'Missing Contact Info', desc: `Could not reliably detect ${!hasEmail ? 'an email address ' : ''}${!hasEmail && !hasPhone ? 'or ' : ''}${!hasPhone ? 'a phone number' : ''}. Ensure this is clearly listed.` });
        }


        // -- Final Math --
        let finalPercentage = Math.round((totalScore / maxScore) * 100);
        if (finalPercentage > 100) finalPercentage = 100;

        renderResults(finalPercentage, feedback);
    }

    function extractKeywords(text) {
        // Very basic NLP simulation: strip common stop words and return unique words
        const stopWords = ['the','and','a','to','of','in','for','with','on','is','as','you','that','this','be','are','or','it'];
        const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
        const keywords = new Set();
        words.forEach(w => {
            if (w.length > 3 && !stopWords.includes(w)) keywords.add(w);
        });
        return Array.from(keywords);
    }

    function renderResults(score, feedback) {
        // Animate Score
        let currentScore = 0;
        const interval = setInterval(() => {
            currentScore += 2;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(interval);
            }
            finalScoreDisplay.textContent = currentScore;
            scoreCirclePath.setAttribute('stroke-dasharray', `${currentScore}, 100`);
            
            // Color mapping
            scoreCirclePath.className.baseVal = 'circle';
            if(currentScore >= 80) {
                scoreCirclePath.classList.add('good');
                scoreMessage.textContent = "Excellent Score";
                scoreMessage.style.color = "var(--success-color)";
            } else if (currentScore >= 50) {
                scoreCirclePath.classList.add('medium');
                scoreMessage.textContent = "Fair Score";
                scoreMessage.style.color = "#f59e0b";
            } else {
                scoreCirclePath.classList.add('bad');
                scoreMessage.textContent = "Needs Improvement";
                scoreMessage.style.color = "#ef4444";
            }
        }, 20);

        // Render Feedback List
        feedbackList.innerHTML = '';
        feedback.forEach(item => {
            const div = document.createElement('div');
            div.className = `feedback-item ${item.type}`;
            
            let icon = 'ph-info';
            if(item.type === 'positive') icon = 'ph-check-circle';
            else if(item.type === 'negative') icon = 'ph-x-circle';
            else if(item.type === 'warning') icon = 'ph-warning-circle';

            div.innerHTML = `
                <div class="feedback-icon"><i class="ph ${icon}"></i></div>
                <div class="feedback-content">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            `;
            feedbackList.appendChild(div);
        });
    }

    // Expose programmatic ATS analysis for the live resume builder
    window.analyzeTextForATS = (text) => {
        const jdText = jdInput.value.trim();
        
        // Setup UI for analysis
        currentFile = { name: 'Live Resume Build.pdf', type: 'application/pdf' };
        fileNameDisplay.textContent = "Live Resume Build";
        statusDiv.classList.remove('hidden');
        uploadZone.style.display = 'none';
        
        btnAnalyze.disabled = true;
        btnAnalyze.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing...';
        resultsPanel.style.display = 'none';
        
        // Small delay for UI update, then run scoring
        setTimeout(() => {
            runATSScoring(text, jdText);
            resultsPanel.style.display = 'flex';
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
            btnAnalyze.disabled = false;
            btnAnalyze.innerHTML = '<i class="ph ph-magic-wand"></i> Analyze Resume';
        }, 500);
    };

});

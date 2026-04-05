// export.js

document.addEventListener('DOMContentLoaded', () => {
    const btnExport = document.getElementById('btn-export-pdf');
    
    if(btnExport) {
        btnExport.addEventListener('click', () => {
            // Get the element to export
            const element = document.getElementById('resume-preview-container');
            if(!element) return;

            // Change button state
            const originalText = btnExport.innerHTML;
            btnExport.innerHTML = '<i class="ph ph-spinner"></i> Generating PDF...';
            btnExport.disabled = true;

            // Optional: Clone the element or apply specific styles before export if needed.
            // Since our preview is already A4 shaped CSS, html2pdf does an excellent job normally.

            const opt = {
                margin:       0,
                filename:     `resume-${Date.now()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // New Promise-based usage:
            html2pdf().set(opt).from(element).save().then(() => {
                // Restore button state
                btnExport.innerHTML = originalText;
                btnExport.disabled = false;
            }).catch(err => {
                console.error("PDF Export failed:", err);
                btnExport.innerHTML = '<i class="ph ph-warning"></i> Error';
                setTimeout(() => {
                    btnExport.innerHTML = originalText;
                    btnExport.disabled = false;
                }, 2000);
            });
        });
    }
});

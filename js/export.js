// export.js

document.addEventListener('DOMContentLoaded', () => {
    const btnExport = document.getElementById('btn-export-pdf');
    
    if(btnExport) {
        btnExport.addEventListener('click', () => {
            // Revert back to the native browser print, which generates a real textual PDF
            // rather than the image-based PDF created by html2pdf/html2canvas.
            // This is critical for ATS scanners to read the text.
            window.print();
        });
    }
});

// ===========================
// PPH Checklist Web App - JavaScript
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PPH Checklist App Loaded');
    
    // Load any saved data when page loads
    autoLoadForm();
    
    // Auto-save functionality (optional - saves every 30 seconds)
    setInterval(function() {
        if (isFormDirty()) {
            autoSaveForm();
        }
    }, 30000); // 30 seconds
});

// ===========================
// Form State Management
// ===========================

let formDirtyFlag = false;

function isFormDirty() {
    return formDirtyFlag;
}

// Track when form is modified
document.getElementById('pph-form').addEventListener('change', function() {
    formDirtyFlag = true;
});

// ===========================
// Save Form Function
// ===========================

function saveForm() {
    const form = document.getElementById('pph-form');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to a regular object
    for (let [key, value] of formData.entries()) {
        // Handle multiple values for same key (like checkboxes with same name)
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Also save checkboxes that are unchecked
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            data[checkbox.name] = 'unchecked';
        }
    });
    
    // Save to localStorage
    try {
        localStorage.setItem('pph-checklist-data', JSON.stringify(data));
        localStorage.setItem('pph-checklist-timestamp', new Date().toISOString());
        
        // Show success message
        showNotification('Form saved successfully!', 'success');
        formDirtyFlag = false;
    } catch (e) {
        console.error('Error saving form:', e);
        showNotification('Error saving form. Please try again.', 'error');
    }
}

// ===========================
// Load Form Function
// ===========================

function loadForm() {
    try {
        const savedData = localStorage.getItem('pph-checklist-data');
        const timestamp = localStorage.getItem('pph-checklist-timestamp');
        
        if (!savedData) {
            showNotification('No saved data found.', 'info');
            return;
        }
        
        const data = JSON.parse(savedData);
        const form = document.getElementById('pph-form');
        
        // Load each field
        for (let [key, value] of Object.entries(data)) {
            const elements = form.querySelectorAll(`[name="${key}"]`);
            
            elements.forEach(element => {
                if (element.type === 'checkbox') {
                    element.checked = value !== 'unchecked';
                } else if (element.type === 'radio') {
                    if (element.value === value) {
                        element.checked = true;
                    }
                } else {
                    element.value = value;
                }
            });
        }
        
        // Show success with timestamp
        const date = new Date(timestamp);
        const timeString = date.toLocaleString();
        showNotification(`Form loaded successfully! Last saved: ${timeString}`, 'success');
        formDirtyFlag = false;
    } catch (e) {
        console.error('Error loading form:', e);
        showNotification('Error loading saved data.', 'error');
    }
}

// Auto-load form on page load (silent)
function autoLoadForm() {
    try {
        const savedData = localStorage.getItem('pph-checklist-data');
        if (savedData) {
            const data = JSON.parse(savedData);
            const form = document.getElementById('pph-form');
            
            for (let [key, value] of Object.entries(data)) {
                const elements = form.querySelectorAll(`[name="${key}"]`);
                
                elements.forEach(element => {
                    if (element.type === 'checkbox') {
                        element.checked = value !== 'unchecked';
                    } else if (element.type === 'radio') {
                        if (element.value === value) {
                            element.checked = true;
                        }
                    } else {
                        element.value = value;
                    }
                });
            }
            formDirtyFlag = false;
        }
    } catch (e) {
        console.error('Error auto-loading form:', e);
    }
}

// Auto-save form (silent)
function autoSaveForm() {
    const form = document.getElementById('pph-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            data[checkbox.name] = 'unchecked';
        }
    });
    
    try {
        localStorage.setItem('pph-checklist-data', JSON.stringify(data));
        localStorage.setItem('pph-checklist-timestamp', new Date().toISOString());
        formDirtyFlag = false;
        console.log('Form auto-saved');
    } catch (e) {
        console.error('Error auto-saving form:', e);
    }
}

// ===========================
// Clear Form Function
// ===========================

function clearForm() {
    if (confirm('Are you sure you want to clear all form data? This will also delete any saved data.')) {
        // Clear the form
        document.getElementById('pph-form').reset();
        
        // Clear localStorage
        localStorage.removeItem('pph-checklist-data');
        localStorage.removeItem('pph-checklist-timestamp');
        
        showNotification('Form cleared successfully!', 'success');
        formDirtyFlag = false;
    }
}

// ===========================
// Generate PDF Function
// ===========================

function generatePDF() {
    showNotification('Generating PDF... This may take a moment.', 'info');
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const lineHeight = 5;
        let currentY = margin;
        
        // Helper function to add page break if needed
        function checkPageBreak(neededSpace = 10) {
            if (currentY + neededSpace > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
                return true;
            }
            return false;
        }
        
        // Helper function to add text
        function addText(text, x, y, options = {}) {
            const fontSize = options.fontSize || 10;
            const isBold = options.bold || false;
            const color = options.color || [0, 0, 0];
            
            doc.setFontSize(fontSize);
            doc.setFont(undefined, isBold ? 'bold' : 'normal');
            doc.setTextColor(...color);
            doc.text(text, x, y);
        }
        
        // Helper function to get form value
        function getFormValue(name, type = 'text') {
            const element = document.querySelector(`[name="${name}"]`);
            if (!element) return '';
            
            if (type === 'checkbox') {
                return element.checked ? 'Yes' : 'No';
            } else if (type === 'radio') {
                const selected = document.querySelector(`[name="${name}"]:checked`);
                return selected ? selected.value : '';
            }
            return element.value || '';
        }
        
        // Title Page
        doc.setFillColor(139, 0, 0);
        doc.rect(0, 0, pageWidth, 30, 'F');
        addText('OBS UK', margin, 15, { fontSize: 20, bold: true, color: [255, 255, 255] });
        addText('Postpartum Haemorrhage Management Checklist', margin, 22, { fontSize: 12, color: [255, 255, 255] });
        
        currentY = 40;
        
        // Patient Information
        addText('PATIENT INFORMATION', margin, currentY, { fontSize: 14, bold: true });
        currentY += lineHeight + 2;
        addText(`Name: ${getFormValue('patient_name')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Patient ID: ${getFormValue('patient_id')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Date of Birth: ${getFormValue('patient_dob')}`, margin, currentY);
        currentY += lineHeight + 5;
        
        // Stage 0 - PPH Risk Assessment
        checkPageBreak(30);
        doc.setFillColor(144, 238, 144);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
        addText('STAGE 0 - PPH RISK ASSESSMENT', margin + 2, currentY + 7, { fontSize: 12, bold: true });
        currentY += 15;
        
        addText(`Most recent Hb: ${getFormValue('hb_recent')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Plt: ${getFormValue('plt_recent')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Result Date: ${getFormValue('lab_date')}`, margin, currentY);
        currentY += lineHeight + 3;
        
        addText('Antenatal Risk Factors:', margin, currentY, { bold: true });
        currentY += lineHeight;
        
        const antenatalFactors = [
            { name: 'anaemia', label: 'Anaemia or bleeding disorder' },
            { name: 'bmi', label: 'BMI <18 or >35 or Weight <55kg' },
            { name: 'previous_births', label: '≥5 previous vaginal births' },
            { name: 'uterine_surgery', label: 'Previous uterine surgery' },
            { name: 'previous_pph', label: 'Previous PPH >1L' },
            { name: 'multiple_pregnancy', label: 'Multiple pregnancy or fetal weight >4.5kg' },
            { name: 'abnormal_placenta', label: 'Abnormal placental implantation' },
            { name: 'polyhydramnios', label: 'Polyhydramnios' },
            { name: 'abruption', label: 'Abruption or Antepartum Haemorrhage' }
        ];
        
        antenatalFactors.forEach(factor => {
            checkPageBreak();
            const checked = getFormValue(factor.name, 'checkbox');
            addText(`  ${checked === 'Yes' ? '☑' : '☐'} ${factor.label}`, margin + 5, currentY);
            currentY += lineHeight;
        });
        
        currentY += 3;
        addText('Perinatal Risk Factors:', margin, currentY, { bold: true });
        currentY += lineHeight;
        
        const perinatalFactors = [
            { name: 'chorioamnionitis', label: 'Suspicion of chorioamnionitis/Sepsis' },
            { name: 'oxytocin_augment', label: 'Labour augmented with oxytocin' },
            { name: 'prolonged_labour', label: 'Prolonged labour' },
            { name: 'assisted_birth', label: 'Assisted vaginal birth' },
            { name: 'retained_products', label: 'Retained products of conception' }
        ];
        
        perinatalFactors.forEach(factor => {
            checkPageBreak();
            const checked = getFormValue(factor.name, 'checkbox');
            addText(`  ${checked === 'Yes' ? '☑' : '☐'} ${factor.label}`, margin + 5, currentY);
            currentY += lineHeight;
        });
        
        currentY += 5;
        addText(`Suitable for EI blood: ${getFormValue('ei_blood', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`IV access required: ${getFormValue('iv_access_req', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Active 3rd stage planned: ${getFormValue('active_3rd_stage', 'radio')}`, margin, currentY);
        currentY += lineHeight + 3;
        
        addText(`Completed by: ${getFormValue('stage0_completed_by')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Date: ${getFormValue('stage0_date')} Time: ${getFormValue('stage0_time')}`, margin, currentY);
        currentY += lineHeight + 8;
        
        // Stage 1
        checkPageBreak(30);
        doc.setFillColor(255, 215, 0);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
        addText('STAGE 1 - >500ml ONGOING BLOOD LOSS', margin + 2, currentY + 7, { fontSize: 12, bold: true });
        currentY += 15;
        
        addText(`Midwife in charge: ${getFormValue('mw_charge_stage1')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Time arrived: ${getFormValue('mw_charge_time_stage1')}`, margin, currentY);
        currentY += lineHeight + 5;
        
        addText('Cause of bleeding:', margin, currentY, { bold: true });
        currentY += lineHeight;
        const causes1 = ['tone_s1', 'trauma_s1', 'tissue_s1', 'thrombin_s1'];
        const causeLabels = ['Tone', 'Trauma', 'Tissue', 'Thrombin'];
        causes1.forEach((cause, index) => {
            const checked = getFormValue(`cause_${cause}`, 'checkbox');
            addText(`${checked === 'Yes' ? '☑' : '☐'} ${causeLabels[index]}`, margin + 5, currentY);
            currentY += lineHeight;
        });
        
        currentY += 3;
        addText(`Measured blood loss (if stopped): ${getFormValue('mbl_stopped_s1')} ml`, margin, currentY, { bold: true });
        currentY += lineHeight + 3;
        addText(`Completed by: ${getFormValue('stage1_completed_by')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Date: ${getFormValue('stage1_date')} Time: ${getFormValue('stage1_time')}`, margin, currentY);
        currentY += lineHeight + 8;
        
        // Stage 2
        checkPageBreak(30);
        doc.setFillColor(255, 179, 102);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
        addText('STAGE 2 - >1000ml BLOOD LOSS', margin + 2, currentY + 7, { fontSize: 12, bold: true });
        currentY += 15;
        
        addText(`MW in charge: ${getFormValue('mw_charge_s2')} (${getFormValue('mw_charge_time_s2')})`, margin, currentY);
        currentY += lineHeight;
        addText(`Obstetrician: ${getFormValue('obstetrician_s2')} (${getFormValue('obstetrician_time_s2')})`, margin, currentY);
        currentY += lineHeight;
        addText(`Anaesthetist: ${getFormValue('anaesthetist_s2')} (${getFormValue('anaesthetist_time_s2')})`, margin, currentY);
        currentY += lineHeight + 5;
        
        addText('Test Results:', margin, currentY, { bold: true });
        currentY += lineHeight;
        addText(`  VBG - Hb: ${getFormValue('vbg_hb_s2')}, Lactate: ${getFormValue('vbg_lactate_s2')}`, margin + 5, currentY);
        currentY += lineHeight;
        addText(`  ROTEM - FIBTEM A5: ${getFormValue('rotem_fibtem_s2')}, EXTEM CT: ${getFormValue('rotem_extem_s2')}`, margin + 5, currentY);
        currentY += lineHeight + 5;
        
        addText('Cause of bleeding:', margin, currentY, { bold: true });
        currentY += lineHeight;
        const causes2 = ['tone_s2', 'trauma_s2', 'tissue_s2', 'thrombin_s2'];
        causes2.forEach((cause, index) => {
            const checked = getFormValue(`cause_${cause}`, 'checkbox');
            addText(`${checked === 'Yes' ? '☑' : '☐'} ${causeLabels[index]}`, margin + 5, currentY);
            currentY += lineHeight;
        });
        
        currentY += 3;
        addText(`Completed by: ${getFormValue('stage2_completed_by')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Date: ${getFormValue('stage2_date')} Time: ${getFormValue('stage2_time')}`, margin, currentY);
        currentY += lineHeight + 3;
        addText(`Transfer to theatre time: ${getFormValue('theatre_arrival_time')}`, margin, currentY);
        currentY += lineHeight + 8;
        
        // Stage 3
        checkPageBreak(30);
        doc.setFillColor(255, 107, 107);
        doc.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
        addText('STAGE 3 - >1500ml BLOOD LOSS', margin + 2, currentY + 7, { fontSize: 12, bold: true, color: [255, 255, 255] });
        currentY += 15;
        
        addText('MOH Protocol Activated', margin, currentY, { bold: true });
        currentY += lineHeight + 3;
        
        addText('Cause of bleeding:', margin, currentY, { bold: true });
        currentY += lineHeight;
        const causes3 = ['tone_s3', 'trauma_s3', 'tissue_s3', 'thrombin_s3'];
        causes3.forEach((cause, index) => {
            const checked = getFormValue(`cause_${cause}`, 'checkbox');
            addText(`${checked === 'Yes' ? '☑' : '☐'} ${causeLabels[index]}`, margin + 5, currentY);
            currentY += lineHeight;
        });
        
        currentY += 3;
        addText(`Completed by: ${getFormValue('stage3_completed_by')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Date: ${getFormValue('stage3_date')} Time: ${getFormValue('stage3_time')}`, margin, currentY);
        currentY += lineHeight + 8;
        
        // Post-event Information
        checkPageBreak(30);
        addText('POST-EVENT CHECKLIST', margin, currentY, { fontSize: 14, bold: true });
        currentY += lineHeight + 3;
        
        addText(`WHO sign-out completed: ${getFormValue('who_signout', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Drugs prescribed: ${getFormValue('drugs_prescribed', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Datix form needed: ${getFormValue('datix_needed', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        if (getFormValue('datix_number')) {
            addText(`  Datix number: ${getFormValue('datix_number')}`, margin + 5, currentY);
            currentY += lineHeight;
        }
        addText(`Event discussed with patient: ${getFormValue('patient_discussion', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`Team debrief needed: ${getFormValue('team_debrief', 'radio')}`, margin, currentY);
        currentY += lineHeight + 5;
        
        addText('Post-event Monitoring:', margin, currentY, { bold: true });
        currentY += lineHeight;
        addText(`  Level of care: ${getFormValue('care_level', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`  Syntocinon infusion: ${getFormValue('syntocinon', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`  LMWH: ${getFormValue('lmwh', 'radio')}`, margin, currentY);
        currentY += lineHeight;
        addText(`  TEDS: ${getFormValue('teds', 'radio')}`, margin, currentY);
        currentY += lineHeight + 5;
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by OBS UK PPH Checklist Web App', margin, pageHeight - 5);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 50, pageHeight - 5);
        
        // Save the PDF
        const filename = `PPH_Checklist_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        showNotification('PDF generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF. Please try using the Print function instead.', 'error');
    }
}

// ===========================
// Notification System
// ===========================

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            notification.style.color = 'white';
            break;
        case 'info':
            notification.style.backgroundColor = '#17a2b8';
            notification.style.color = 'white';
            break;
        default:
            notification.style.backgroundColor = '#6c757d';
            notification.style.color = 'white';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Export Functions
// ===========================

// Export form data as JSON file
function exportJSON() {
    const form = document.getElementById('pph-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        data[checkbox.name] = checkbox.checked;
    });
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PPH_Checklist_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Form data exported as JSON', 'success');
}

// Import form data from JSON file
function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                const form = document.getElementById('pph-form');
                
                for (let [key, value] of Object.entries(data)) {
                    const elements = form.querySelectorAll(`[name="${key}"]`);
                    
                    elements.forEach(element => {
                        if (element.type === 'checkbox') {
                            element.checked = value === true || value === 'on';
                        } else if (element.type === 'radio') {
                            if (element.value === value) {
                                element.checked = true;
                            }
                        } else {
                            element.value = value;
                        }
                    });
                }
                
                showNotification('Form data imported successfully!', 'success');
            } catch (error) {
                console.error('Error importing JSON:', error);
                showNotification('Error importing file. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// ===========================
// Prevent accidental page close
// ===========================

window.addEventListener('beforeunload', function(e) {
    if (isFormDirty()) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// ===========================
// Utility Functions
// ===========================

// Calculate total blood loss
function calculateTotalBloodLoss() {
    let total = 0;
    for (let i = 1; i <= 6; i++) {
        const value = parseFloat(getFormValue(`loss_${i}`)) || 0;
        total += value;
    }
    return total;
}

// Validate required fields
function validateForm() {
    const requiredFields = [
        'patient_name',
        'patient_id',
        'patient_dob'
    ];
    
    let isValid = true;
    const missing = [];
    
    requiredFields.forEach(field => {
        const value = getFormValue(field);
        if (!value) {
            isValid = false;
            missing.push(field);
        }
    });
    
    if (!isValid) {
        showNotification(`Missing required fields: ${missing.join(', ')}`, 'error');
    }
    
    return isValid;
}

console.log('PPH Checklist App - All functions loaded successfully');

# OBS UK PPH Management Checklist - Web Application

## Overview

This is a web-based interactive version of the OBS UK Postpartum Haemorrhage Management Checklist. It allows healthcare professionals to:
- Fill out the checklist digitally
- Save progress locally
- Generate PDFs of completed forms
- Print forms directly from the browser

## Files Included

1. **index.html** - The main HTML structure with all form elements
2. **styles.css** - Complete styling matching the original PDF design
3. **script.js** - JavaScript functionality for save/load/PDF generation
4. **TUTORIAL.md** - Comprehensive tutorial on how the app works
5. **README.md** - This file

## Features

### ✅ Complete Form Implementation
- All stages (0-3) from the original PDF
- Color-coded sections matching the original
- All input fields including checkboxes, radio buttons, text, time, and number inputs
- Page 3: Blood test results and medication tracking
- Page 4: Post-event checklist

### 💾 Data Management
- **Auto-save**: Form data auto-saves every 30 seconds
- **Manual save**: Click "Save Form" button
- **Load saved data**: Retrieve previously saved information
- **Clear form**: Reset all fields and delete saved data
- **Browser storage**: Data stored locally (not sent to any server)

### 📄 Export Options
- **Generate PDF**: Creates a comprehensive PDF of all entered data
- **Print**: Use browser print for immediate printing
- **Local storage**: Data persists between sessions

### 🎨 Design Features
- Responsive layout (works on desktop, tablet, mobile)
- Color-coded stages matching original PDF
- Print-optimized styling
- Accessible form controls

## Quick Start

### Option 1: Open Locally

1. Download all files to a folder on your computer
2. Double-click `index.html` to open in your web browser
3. Start filling out the form

### Option 2: Deploy to Web Server

#### Using GitHub Pages (Free)

1. Create a GitHub account (if you don't have one)
2. Create a new repository
3. Upload the three main files:
   - index.html
   - styles.css
   - script.js
4. Go to Settings → Pages
5. Select your main branch
6. Your site will be live at: `https://yourusername.github.io/repository-name`

#### Using Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Sign up for a free account
3. Drag and drop your folder onto the Netlify dashboard
4. Your site will be live in seconds

#### Using Your Own Domain

If you own a domain and have hosting:

1. Upload files via FTP or cPanel File Manager
2. Place files in your web root directory (usually `public_html`)
3. Access at: `https://yourdomain.com`

## Browser Requirements

### Recommended Browsers
- **Chrome/Edge** (latest version) - Best experience
- **Firefox** (latest version) - Fully supported
- **Safari** (latest version) - Fully supported

### Minimum Requirements
- JavaScript enabled
- Local storage enabled
- Modern browser (released within last 2 years)

### Mobile Support
- iOS Safari 12+
- Chrome for Android
- Responsive design adapts to screen size

## Using the Application

### 1. Starting a New Form

1. Open the application
2. Fill in patient information at the top
3. Complete Stage 0 risk assessment
4. Progress through stages as needed

### 2. Saving Your Progress

**Auto-save**: Runs automatically every 30 seconds when form is modified

**Manual save**:
- Click "Save Form" button
- Data stored in browser's local storage
- Persists until you clear browser data or click "Clear Form"

### 3. Loading Saved Data

- Click "Load Saved" button
- Last saved data will populate all fields
- Timestamp shown in notification

### 4. Generating PDF

1. Fill out the required sections
2. Click "Generate PDF" button
3. PDF will download automatically
4. Includes all entered data in organized format

### 5. Printing

1. Click "Print" button (or Ctrl+P / Cmd+P)
2. Browser print dialog appears
3. Adjust settings as needed
4. Print to paper or "Save as PDF"

### 6. Clearing the Form

1. Click "Clear Form" button
2. Confirm the action
3. All fields reset and saved data deleted

## Data Storage and Privacy

### Local Storage Only
- **No server transmission**: All data stays in your browser
- **No cloud backup**: Data not sent anywhere
- **Your responsibility**: Backup important data
- **Privacy**: No third parties can access the data

### Important Notes
- Data deleted if you clear browser data
- Data not shared between devices
- For medical records, follow your facility's policies
- This app does NOT replace official medical records systems

### Security Considerations
- Use in secure environment
- Don't use on shared/public computers without clearing data
- For HIPAA compliance, consult your IT/compliance team
- Consider using in conjunction with your facility's EMR system

## Troubleshooting

### PDF Generation Issues

**Problem**: PDF doesn't generate
- **Solution**: Check browser console for errors (F12)
- Try using Print function instead (Ctrl+P)
- Ensure jsPDF library loaded (check internet connection)

**Problem**: PDF missing data
- **Solution**: Ensure all fields filled before generating
- Some browsers block popup windows - allow popups for this site

### Save/Load Issues

**Problem**: Data doesn't save
- **Solution**: Check if local storage enabled in browser
- Clear browser cache and try again
- Try different browser

**Problem**: Data disappears
- **Solution**: Browser data may have been cleared
- Check if using incognito/private mode (doesn't save)
- Ensure not switching between different browsers

### Display Issues

**Problem**: Layout looks broken
- **Solution**: Clear browser cache (Ctrl+Shift+Delete)
- Ensure CSS file loaded properly
- Try different browser
- Check internet connection (if using CDN resources)

**Problem**: Form doesn't fit screen
- **Solution**: Form is responsive and should adapt
- Try zooming in/out (Ctrl+/Ctrl-)
- Rotate device (mobile)

## Customization

### Changing Colors

Edit `styles.css` and modify the CSS variables:

```css
:root {
    --stage0-bg: #90EE90;  /* Change stage 0 color */
    --stage1-bg: #FFD700;  /* Change stage 1 color */
    /* etc. */
}
```

### Adding Fields

1. Add HTML input in `index.html`
2. Give it a unique `name` attribute
3. Field will automatically save/load with others

### Modifying Layout

- Edit `styles.css` for visual changes
- Use CSS Grid/Flexbox for repositioning
- Maintain print styles in `@media print` section

## Technical Details

### Technologies Used
- **HTML5**: Form structure and semantic markup
- **CSS3**: Styling, layout (Grid/Flexbox), print styles
- **JavaScript (ES6+)**: Form logic and functionality
- **jsPDF**: PDF generation library
- **LocalStorage API**: Browser-based data storage

### Browser APIs Used
- LocalStorage (data persistence)
- FormData (form handling)
- Blob (file generation)
- Print API (printing)

### No Server Required
This is a static web application:
- No backend/server needed
- No database required
- Can run entirely offline (after initial load)
- Works from local file system

## Maintenance and Updates

### Updating the Form

1. Edit `index.html` for structure changes
2. Edit `styles.css` for styling changes
3. Edit `script.js` for functionality changes
4. Test thoroughly before deploying
5. Keep backups of working versions

### Version Control

Recommended to use Git for tracking changes:
```bash
git init
git add .
git commit -m "Initial version"
```

## Support and Contact

### For Technical Issues
- Check the TUTORIAL.md file for detailed explanations
- Review browser console for error messages (F12)
- Ensure all files are in same directory

### For Clinical Content
- This tool is based on OBS UK guidelines
- For questions about clinical protocols, contact: OBSUK@cardiff.ac.uk
- Always follow your local hospital protocols

## Disclaimer

**IMPORTANT**: This is a digital tool to assist with documentation. It is:
- NOT a substitute for clinical judgment
- NOT a replacement for official medical records
- NOT validated for all clinical environments
- NOT a comprehensive clinical guideline

Always follow your institution's policies and procedures. This tool should be used as an aid to documentation and should not replace proper medical record-keeping systems.

## License and Attribution

Based on the OBS UK PPH Management Checklist, produced by OBS UK (Obstetric Bleeding Study UK).

For more information about OBS UK: OBSUK@cardiff.ac.uk

This web application is provided as-is for educational and clinical documentation purposes.

## Future Enhancements

Potential improvements to consider:
- Export to CSV format
- Import from Excel
- Multi-language support
- Cloud sync capability
- Audit trail logging
- Digital signatures
- Integration with EMR systems
- Real-time collaboration
- Analytics dashboard

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Complete form implementation
- Save/load functionality
- PDF generation
- Print support
- Responsive design

---

**Last Updated**: 2025
**Created**: Based on OBS UK PPH Checklist v4 (26 Dec 2024)

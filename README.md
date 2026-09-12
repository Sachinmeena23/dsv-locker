# DSV Locker 🛅 - Document Management System

A complete, single-page, highly functional personal and business document/asset management system built with **Google Apps Script**, integrated with **Google Sheets** (database) and **Google Drive** (file storage).

---

## 🎯 Features

### Core Functionality
✅ **Dynamic Document Management** - Store and organize personal, business, video, and website documents
✅ **Google Drive Integration** - Auto-upload files to Google Drive with secure links
✅ **Google Sheets Database** - All records stored in organized spreadsheet
✅ **Advanced OCR Processing** - Auto-detect and fill document info (name, ID, date)
✅ **Smart Filtering** - Category-based tabs + live search by name, date, tags
✅ **File Preview & Download** - In-app preview for images, PDFs, videos + direct download
✅ **Approval Workflow** - Approve/Reject records with auto-delete timer (30 seconds)
✅ **Dark/Light Mode** - Beautiful glassmorphism UI with theme toggle
✅ **Responsive Design** - Works seamlessly on mobile and desktop

### Document Categories
- 📸 **Personal Documents** - Photos, identity files (PDF/JPG/PNG)
- 📄 **Business Documents** - Aadhaar, PAN, government IDs (PDF/JPG/PNG)
- 🎬 **Video Links & Files** - Upload MP4/WebM or paste YouTube/Vimeo URLs
- 🌐 **Website Links** - Store and organize web URLs

---

## 📋 Prerequisites

- Google Account with Google Drive access
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic familiarity with Google Apps Script

---

## 🚀 Installation & Setup

### Step 1: Create a New Google Apps Script Project

1. Go to **[script.google.com](https://script.google.com)**
2. Click **"New Project"**
3. Name it: `DSV Locker`

### Step 2: Set Up the Backend (Code.gs)

1. In the Apps Script editor, **delete** the default `myFunction()` code
2. **Copy the entire contents** from `Code.gs` file in this repository
3. **Paste it** into the Code.gs file in your project
4. **Save** the project (Ctrl+S / Cmd+S)

### Step 3: Set Up the Frontend (Index.html)

1. In the Apps Script editor, click **"+ New File"** → **"HTML"**
2. Name the file exactly: **`Index`** (without .html extension)
3. **Delete** the default `<h1>Hello world!</h1>` code
4. **Copy the entire contents** from `Index.html` file in this repository
5. **Paste it** into your new Index.html file
6. **Save** the project

### Step 4: Create Google Sheets Database

1. Go to **[Google Sheets](https://sheets.google.com)**
2. Create a new spreadsheet named: **DSV Locker**
3. Copy the spreadsheet ID from the URL:
   - Example: `https://docs.google.com/spreadsheets/d/`**`1A2B3C4D5E6F7G8H9I0J`**/edit
   - The ID is the bold part above

### Step 5: Create Google Drive Folder

1. Go to **[Google Drive](https://drive.google.com)**
2. Create a new folder named: **DSV_Locker_Files**
3. Right-click the folder → **"Share"** → Change to **"Anyone with the link can view"**
4. Copy the folder ID from the URL:
   - Example: `https://drive.google.com/drive/folders/`**`1XyZ9AbCdEfGhIjKlMnOpQrStUvWxYz`**
   - The ID is the bold part above

### Step 6: Configure Properties in Apps Script

1. Back in your Apps Script project
2. Open **Project Settings** (gear icon)
3. Scroll to **"Script Properties"**
4. Add these two properties:
   ```
   Key: SPREADSHEET_ID
   Value: [Your spreadsheet ID from Step 4]
   
   Key: DRIVE_FOLDER_ID
   Value: [Your folder ID from Step 5]
   ```
5. Click **"Save Project Settings"**

### Step 7: Deploy as Web App

1. Click **"Deploy"** → **"New Deployment"**
2. Click the gear icon and select **"Web app"**
3. Configure:
   - **Execute as:** Your Google Account
   - **Who has access:** Anyone (or select specific users/groups)
4. Click **"Deploy"**
5. Copy the deployment URL provided
6. Click **"Manage deployments"** and note your app URL

---

## 🎮 How to Use

### Adding Documents

1. Click **"+ Add Document"** button
2. Select a **Category**:
   - Personal Documents
   - Business Documents
   - Video Links & Files
   - Website Links
3. Fill in document details:
   - **Title:** Document name (required)
   - **Name:** Auto-filled by OCR, can edit manually
   - **Document/ID Number:** Auto-filled by OCR, can edit manually
   - **Date:** Optional date field
   - **Tags:** Add searchable tags
4. Based on category:
   - **Personal/Business:** Upload PDF or image (JPG/PNG)
   - **Videos:** Upload MP4/WebM OR paste YouTube/Vimeo/MP4 URL
   - **Websites:** Paste the website URL
5. Click **"Save Document"**

### OCR Auto-Fill

When you upload a document (image/PDF), the OCR scanner processes it in the background and auto-fills:
- Document title
- Person's name
- ID/Aadhaar/PAN number
- Date of issue/expiry

*Note: Frontend OCR uses Tesseract.js. For server-side OCR, integrate Google Vision API.*

### Filtering & Search

- **Category Tabs:** Click tabs at the top to filter by document type
- **Search Bar:** Type name, date, or tags to instantly find documents
- **Combined:** Use both filters and search together

### Managing Records

**Viewing Documents:**
- Click **"View"** button to preview in modal
- Supports images, PDFs, videos, and web links
- Videos can autoplay or open in new tab

**Downloading:**
- Click **"Download"** button for direct file download
- Works for all uploaded files

**Approval Workflow:**
- Click **"Approve"** - Record marked as Approved (stays in system)
- Click **"Reject"** - Starts 30-second countdown
- After 30 seconds - Record auto-deletes from Sheets & Drive

### Dark/Light Mode

- Click the **moon/sun icon** in the top-right corner
- Theme preference saved to browser

---

## 📊 Data Structure (Google Sheets)

The app automatically creates columns:

| Column | Purpose |
|--------|---------|
| ID | Unique identifier (UUID) |
| Timestamp | Creation date/time |
| Category | Personal/Business/Video/Website |
| Title | Document name |
| Name | Person's name (OCR-filled) |
| DocumentNumber | ID/Aadhaar/PAN (OCR-filled) |
| Date | Document date |
| Status | Approved/Rejected/Pending |
| FileLink | Google Drive shareable link |
| DriveFileId | File ID in Drive |
| Tags | Search tags |
| VideoUrl | Video URL or uploaded file link |
| WebLink | Website URL |
| Notes | Additional notes |
| RejectionTimer | Countdown timer start |
| OCRData | Raw OCR text (JSON) |

---

## 🔐 Security & Privacy

✅ **File Sharing:** Uploaded files are shared "Anyone with the link can view"
✅ **Data Encryption:** Google Drive & Sheets provide encryption at rest
✅ **Access Control:** Configure who can access the web app during deployment
✅ **Auto-Delete:** Rejected files permanently deleted from Drive after 30s

---

## 🛠️ Advanced Customization

### Enable Server-Side OCR (Google Vision API)

1. Enable **Google Vision API** in Apps Script project
2. Modify `processOCR()` function in Code.gs to use Vision API
3. Update `handleRequest()` to call enhanced OCR processing

### Customize Colors & Gradients

Edit the CSS `:root` variables in Index.html:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  /* ... more gradients ... */
}
```

### Add More Categories

1. Update `categoryIcons` object in Index.html JavaScript
2. Add new option in category dropdown
3. Add new filter tab in HTML
4. Update Code.gs to handle new category

### Modify Auto-Delete Timer

Change `30000` (milliseconds) to desired delay:
```javascript
const rejectionTime = new Date(Date.now() + 30000); // Change 30000 to your value
```

---

## ⚠️ Troubleshooting

### Error: "No HTML file named Index was found"
**Solution:** Make sure the HTML file is named exactly **"Index"** (capital I, no .html extension)

### Files not uploading to Google Drive
**Solution:** Verify DRIVE_FOLDER_ID is correct and folder is shared "Anyone with link"

### Sheets not updating
**Solution:** Confirm SPREADSHEET_ID matches your actual sheet, and project has Google Sheets API enabled

### OCR not working
**Solution:** Tesseract.js has limitations. Consider:
- Using higher quality document scans
- Manually correcting OCR results
- Setting up Google Vision API for server-side processing

### Deployment issues
**Solution:** 
- Re-deploy the app
- Check "Who has access" is set correctly
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| Mobile Safari (iOS) | ✅ Full |
| Chrome Mobile (Android) | ✅ Full |

---

## 🎨 UI Features

- **Glassmorphism Design** - Modern frosted glass effect
- **Smooth Animations** - Slide-in cards, fade transitions
- **Color-Coded Categories** - Each category has unique gradient
- **Status Badges** - Visual Approved/Rejected/Pending indicators
- **Live Rejection Timer** - Visible countdown for auto-delete
- **Responsive Grid** - Adapts from mobile to desktop
- **Micro-interactions** - Hover effects, button animations
- **Dark/Light Theme** - Toggle with localStorage persistence

---

## 📝 API Reference

### Backend Functions (Code.gs)

```javascript
// Get all records
getAllRecords()

// Add new record
addRecord(category, title, name, documentNumber, date, status, tags, videoUrl, webLink, notes)

// Upload file to Drive
uploadFile(base64Data, fileName, mimeType, category)

// Process OCR on document
processOCR(driveFileId)

// Update existing record
updateRecord(id, updates)

// Delete record permanently
deleteRecord(id)

// Reject record (starts 30s timer)
rejectRecord(id)

// Approve record
approveRecord(id)

// Search records
searchRecords(keyword)

// Filter by category
filterByCategory(category)

// Auto-delete rejected records
autoDeleteRejected()
```

---

## 🤝 Contributing

To contribute improvements:
1. Fork the repository
2. Make changes to Code.gs or Index.html
3. Test thoroughly in your Apps Script project
4. Submit pull request with description

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💬 Support & Issues

For issues or feature requests:
1. Check the Troubleshooting section above
2. Review the setup steps carefully
3. Open an issue in the GitHub repository

---

## 🎉 Credits

Built with:
- **Google Apps Script** - Backend serverless platform
- **Google Sheets** - Cloud database
- **Google Drive** - Cloud file storage
- **Bootstrap 5** - Frontend framework
- **Tesseract.js** - Client-side OCR
- **Font Awesome** - Icons
- **Animate.css** - Animations

---

**Happy organizing with DSV Locker! 🛅**

*Last Updated: September 2024*

// DSV Locker 🛅 - Google Apps Script Backend
// Handles Google Sheets CRUD, Google Drive file management, OCR processing, and auto-delete timers

const SPREADSHEET_ID = PropertiesService.getUserProperties().getProperty('SPREADSHEET_ID') || ''; // Set this in deployment
const DRIVE_FOLDER_ID = PropertiesService.getUserProperties().getProperty('DRIVE_FOLDER_ID') || ''; // Set this in deployment
const SHEET_NAME = 'DSV_Locker_Data';

// Initialize the spreadsheet
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.addSheet(SHEET_NAME);
    const headers = [
      'ID', 'Timestamp', 'Category', 'Title', 'Name', 'DocumentNumber', 
      'Date', 'Status', 'FileLink', 'DriveFileId', 'Tags', 'VideoUrl', 
      'WebLink', 'Notes', 'RejectionTimer', 'OCRData'
    ];
    sheet.appendRow(headers);
  }
  return sheet;
}

// Get all records from Google Sheets
function getAllRecords() {
  const sheet = initializeSheet();
  const data = sheet.getDataRange().getValues();
  const records = [];
  
  for (let i = 1; i < data.length; i++) {
    records.push({
      id: data[i][0],
      timestamp: data[i][1],
      category: data[i][2],
      title: data[i][3],
      name: data[i][4],
      documentNumber: data[i][5],
      date: data[i][6],
      status: data[i][7],
      fileLink: data[i][8],
      driveFileId: data[i][9],
      tags: data[i][10],
      videoUrl: data[i][11],
      webLink: data[i][12],
      notes: data[i][13],
      rejectionTimer: data[i][14],
      ocrData: data[i][15]
    });
  }
  
  return records;
}

// Add new record to Google Sheets
function addRecord(category, title, name, documentNumber, date, status, tags, videoUrl, webLink, notes) {
  const sheet = initializeSheet();
  const id = Utilities.getUuid();
  const timestamp = new Date();
  
  sheet.appendRow([
    id, timestamp, category, title, name, documentNumber, 
    date, status || 'Pending', '', '', tags, videoUrl, webLink, notes, '', ''
  ]);
  
  return id;
}

// Handle file upload to Google Drive
function uploadFile(base64Data, fileName, mimeType, category) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = folder.createFile(blob);
    
    // Set permissions to anyone with link
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    
    const fileLink = file.getUrl();
    const driveFileId = file.getId();
    
    return {
      success: true,
      fileLink: fileLink,
      driveFileId: driveFileId,
      fileName: fileName
    };
  } catch (error) {
    Logger.log('Upload error: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

// OCR Processing - Extract text from image/PDF
function processOCR(driveFileId) {
  try {
    const file = DriveApp.getFileById(driveFileId);
    const mimeType = file.getMimeType();
    
    // For images and PDFs, use Vision API or Tesseract
    // This requires Vision API setup. Fallback: return structured empty object
    
    const ocrData = {
      documentTitle: '',
      name: '',
      idNumber: '',
      aadharNumber: '',
      panNumber: '',
      date: '',
      rawText: ''
    };
    
    // If file is image, attempt OCR
    if (mimeType.includes('image')) {
      const blob = file.getBlob();
      const resource = {
        title: file.getName(),
        mimeType: blob.getContentType()
      };
      
      // Advanced OCR could use Google Vision API here
      // For now, return template for frontend to process with Tesseract.js
      ocrData.rawText = '[OCR Ready - Process in Frontend]';
    }
    
    return ocrData;
  } catch (error) {
    Logger.log('OCR error: ' + error.toString());
    return { error: error.toString() };
  }
}

// Update record in Google Sheets
function updateRecord(id, updates) {
  const sheet = initializeSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      if (updates.title) sheet.getRange(i + 1, 4).setValue(updates.title);
      if (updates.name) sheet.getRange(i + 1, 5).setValue(updates.name);
      if (updates.documentNumber) sheet.getRange(i + 1, 6).setValue(updates.documentNumber);
      if (updates.date) sheet.getRange(i + 1, 7).setValue(updates.date);
      if (updates.status) sheet.getRange(i + 1, 8).setValue(updates.status);
      if (updates.fileLink) sheet.getRange(i + 1, 9).setValue(updates.fileLink);
      if (updates.tags) sheet.getRange(i + 1, 11).setValue(updates.tags);
      if (updates.videoUrl) sheet.getRange(i + 1, 12).setValue(updates.videoUrl);
      if (updates.webLink) sheet.getRange(i + 1, 13).setValue(updates.webLink);
      if (updates.ocrData) sheet.getRange(i + 1, 16).setValue(JSON.stringify(updates.ocrData));
      if (updates.rejectionTimer) sheet.getRange(i + 1, 15).setValue(updates.rejectionTimer);
      
      return { success: true, id: id };
    }
  }
  
  return { success: false, error: 'Record not found' };
}

// Delete record from Sheets and Drive
function deleteRecord(id) {
  const sheet = initializeSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      const driveFileId = data[i][9];
      
      // Delete from Google Drive
      if (driveFileId) {
        try {
          DriveApp.getFileById(driveFileId).setTrashed(true);
        } catch (e) {
          Logger.log('Could not delete file: ' + e.toString());
        }
      }
      
      // Delete from Sheets
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  return { success: false, error: 'Record not found' };
}

// Mark record as rejected and set 30-second timer
function rejectRecord(id) {
  const rejectionTime = new Date(Date.now() + 30000); // 30 seconds from now
  const updates = {
    status: 'Rejected',
    rejectionTimer: rejectionTime.toISOString()
  };
  
  updateRecord(id, updates);
  
  // Schedule auto-delete using time-based trigger
  ScriptApp.newTrigger('autoDeleteRejected')
    .timeBased()
    .at(rejectionTime)
    .create();
  
  return { success: true, deleteTime: rejectionTime };
}

// Auto-delete rejected records (runs on schedule)
function autoDeleteRejected() {
  const records = getAllRecords();
  const now = new Date();
  
  records.forEach(record => {
    if (record.status === 'Rejected' && record.rejectionTimer) {
      const deleteTime = new Date(record.rejectionTimer);
      if (now >= deleteTime) {
        deleteRecord(record.id);
        Logger.log('Auto-deleted rejected record: ' + record.id);
      }
    }
  });
}

// Approve record
function approveRecord(id) {
  return updateRecord(id, { status: 'Approved', rejectionTimer: '' });
}

// Get record by ID
function getRecord(id) {
  const records = getAllRecords();
  return records.find(r => r.id === id) || null;
}

// Search records by keyword
function searchRecords(keyword) {
  const records = getAllRecords();
  const lowerKeyword = keyword.toLowerCase();
  
  return records.filter(record => {
    return (
      record.title.toLowerCase().includes(lowerKeyword) ||
      record.name.toLowerCase().includes(lowerKeyword) ||
      record.tags.toLowerCase().includes(lowerKeyword) ||
      record.date.toString().includes(lowerKeyword)
    );
  });
}

// Filter records by category
function filterByCategory(category) {
  const records = getAllRecords();
  if (category === 'All') return records;
  return records.filter(r => r.category === category);
}

// Google Apps Script Web App Entry Point
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// API endpoint for frontend calls
function handleRequest(action, data) {
  switch (action) {
    case 'getAllRecords':
      return getAllRecords();
    case 'addRecord':
      return addRecord(data.category, data.title, data.name, data.documentNumber, 
                      data.date, data.status, data.tags, data.videoUrl, data.webLink, data.notes);
    case 'uploadFile':
      return uploadFile(data.base64, data.fileName, data.mimeType, data.category);
    case 'updateRecord':
      return updateRecord(data.id, data.updates);
    case 'deleteRecord':
      return deleteRecord(data.id);
    case 'rejectRecord':
      return rejectRecord(data.id);
    case 'approveRecord':
      return approveRecord(data.id);
    case 'getRecord':
      return getRecord(data.id);
    case 'searchRecords':
      return searchRecords(data.keyword);
    case 'filterByCategory':
      return filterByCategory(data.category);
    case 'processOCR':
      return processOCR(data.driveFileId);
    default:
      return { error: 'Unknown action' };
  }
}

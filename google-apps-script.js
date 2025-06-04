/**
 * Google Apps Script for Howdy Cafe Newsletter Subscription
 * 
 * Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SPREADSHEET_ID with your actual spreadsheet ID
 * 5. Deploy as web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and use it in your React app
 */

// Your Google Sheets ID from the URL
const SPREADSHEET_ID = '1cNTY0-ZcM9A8L0Tj2TYurdOJXqm7Fsu6z9LFMFO1VSw';

/**
 * Handle POST requests for newsletter subscriptions
 */
function doPost(e) {
  // Add CORS headers
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    let email;
    
    // Handle different types of POST data
    if (e.postData && e.postData.contents) {
      const data = JSON.parse(e.postData.contents);
      email = data.email;
    } else if (e.parameter && e.parameter.email) {
      email = e.parameter.email;
    } else {
      return output.setContent(JSON.stringify({
        success: false,
        message: 'No email provided'
      }));
    }
    
    const timestamp = new Date().toLocaleString();
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return output.setContent(JSON.stringify({
        success: false,
        message: 'Invalid email address'
      }));
    }
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 3).setValues([['Email', 'Timestamp', 'Status']]);
    }
    
    // Check if email already exists (only if there are rows)
    if (sheet.getLastRow() > 1) {
      const emailColumn = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
      const emailExists = emailColumn.some(row => row[0] === email);
      
      if (emailExists) {
        return output.setContent(JSON.stringify({
          success: false,
          message: 'Email already subscribed'
        }));
      }
    }
    
    // Add the new subscription
    sheet.appendRow([email, timestamp, 'Active']);
    
    // Return success response
    return output.setContent(JSON.stringify({
      success: true,
      message: 'Successfully subscribed to newsletter'
    }));
      
  } catch (error) {
    console.error('Error processing subscription:', error);
    
    return output.setContent(JSON.stringify({
      success: false,
      message: 'Internal server error: ' + error.toString()
    }));
  }
}

/**
 * Handle GET requests (for testing and CORS preflight)
 */
function doGet(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Handle email parameter for GET requests (fallback method)
  if (e.parameter && e.parameter.email) {
    return doPost(e);
  }
  
  return output.setContent(JSON.stringify({
    message: 'Howdy Cafe Newsletter API is running',
    timestamp: new Date().toISOString(),
    methods: ['GET', 'POST'],
    parameters: ['email']
  }));
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get all subscribers (optional function for admin use)
 */
function getSubscribers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    return data;
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return [];
  }
} 
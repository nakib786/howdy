# Newsletter Google Sheets Integration Setup

This guide will help you connect your Howdy Cafe newsletter subscription form to your Google Sheets for automatic email collection.

## 📋 Prerequisites

- Google account with access to Google Sheets and Google Apps Script
- Your Google Sheets URL: `https://docs.google.com/spreadsheets/d/1cNTY0-ZcM9A8L0Tj2TYurdOJXqm7Fsu6z9LFMFO1VSw/edit?usp=sharing`

## 🚀 Step-by-Step Setup

### Step 1: Prepare Your Google Sheet

1. Open your Google Sheet: [Your Newsletter Sheet](https://docs.google.com/spreadsheets/d/1cNTY0-ZcM9A8L0Tj2TYurdOJXqm7Fsu6z9LFMFO1VSw/edit?usp=sharing)

2. Make sure the sheet has the following column headers in row 1:
   - **Column A**: Email
   - **Column B**: Timestamp  
   - **Column C**: Status

3. Ensure the sheet is set to "Anyone with the link can edit" for the script to work

### Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)

2. Click **"New Project"**

3. Replace the default `Code.gs` content with the code from `google-apps-script.js` file in this project

4. Save the project with a name like "Howdy Cafe Newsletter API"

### Step 3: Deploy as Web App

1. In Google Apps Script, click **"Deploy"** → **"New Deployment"**

2. Choose type: **"Web app"**

3. Set the following configuration:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
   
4. Click **"Deploy"**

5. **Copy the Web App URL** - you'll need this for the next step

6. Grant necessary permissions when prompted

### Step 4: Update Your React App

1. Open `src/components/Footer.tsx`

2. Find the `handleSubscribe` function

3. Replace the simulation code with the actual API call:

```typescript
const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !email.includes('@')) {
    setSubscriptionStatus('Please enter a valid email address');
    return;
  }

  setIsSubscribing(true);
  setSubscriptionStatus('');

  try {
    // Replace YOUR_WEB_APP_URL with the URL from Step 3
    const response = await fetch('YOUR_WEB_APP_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });

    const result = await response.json();

    if (result.success) {
      setSubscriptionStatus('Thank you for subscribing! 🎉');
      setEmail('');
      
      setTimeout(() => {
        setSubscriptionStatus('');
      }, 3000);
    } else {
      setSubscriptionStatus(result.message || 'Something went wrong. Please try again.');
    }
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    setSubscriptionStatus('Something went wrong. Please try again.');
  } finally {
    setIsSubscribing(false);
  }
};
```

### Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the footer newsletter section

3. Enter a test email and click "Subscribe"

4. Check your Google Sheet to see if the email was added

## 🔧 Features

- ✅ **Email Validation**: Checks for valid email format
- ✅ **Duplicate Prevention**: Prevents the same email from subscribing twice
- ✅ **Timestamp Tracking**: Records when each subscription occurred
- ✅ **Status Tracking**: Marks subscriptions as "Active"
- ✅ **Error Handling**: Provides user-friendly error messages
- ✅ **Auto Headers**: Automatically creates column headers if they don't exist

## 📊 Google Sheet Structure

Your sheet will automatically be organized as:

| Email | Timestamp | Status |
|-------|-----------|--------|
| user@example.com | 1/15/2024, 2:30:45 PM | Active |
| another@email.com | 1/15/2024, 3:15:22 PM | Active |

## 🛠️ Troubleshooting

### Common Issues:

1. **"Permission denied" error**
   - Make sure your Google Sheet is set to "Anyone with the link can edit"
   - Ensure the Apps Script is deployed with "Anyone" access

2. **CORS errors**
   - Google Apps Script handles CORS automatically when deployed as a web app

3. **Script not updating**
   - After making changes to the Apps Script, create a new deployment
   - Use the new deployment URL in your React app

4. **Emails not appearing in sheet**
   - Check the browser console for error messages
   - Verify the Web App URL is correct
   - Test the Apps Script directly in the editor

## 🔒 Security Notes

- The Google Apps Script runs with your permissions
- Only email addresses are collected (no sensitive data)
- Consider adding rate limiting for production use
- Monitor the script execution logs in Google Apps Script

## 📈 Analytics

You can track newsletter performance by:
- Counting total subscribers in your Google Sheet
- Monitoring subscription dates and times
- Exporting data for further analysis

---

**Need Help?** Check the Google Apps Script execution logs or browser console for detailed error messages. 
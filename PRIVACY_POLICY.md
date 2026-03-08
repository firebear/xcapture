# 🔒 Privacy Policy for XCapture

**Last Updated: March 8, 2026**

## 📋 Overview

XCapture ("we", "our", or "the extension") is committed to protecting your privacy. This privacy policy explains how our Chrome extension handles information when you use it.

## 🎯 What We Do NOT Collect

**XCapture does NOT:**
- ❌ Collect any personal information
- ❌ Track your browsing activity
- ❌ Store any data on external servers
- ❌ Share any information with third parties
- ❌ Use cookies or tracking technologies
- ❌ Access your X.com account or credentials

## 💻 How XCapture Works

XCapture operates entirely **locally** in your browser:

1. **Tweet Detection**: The extension detects tweets on x.com using browser APIs
2. **Screenshot Capture**: Screenshots are generated locally using the html-to-image library
3. **Image Storage**: Captured images are temporarily stored in your browser's memory
4. **Export Options**: You can copy images to clipboard or download them to your device

**All processing happens in your browser. Nothing is sent to external servers.**

## 🔐 Permissions We Request

XCapture requests the following permissions:

### Required Permissions:

1. **`activeTab`**
   - Purpose: To detect and capture tweets when you click the screenshot button
   - Usage: Only when you actively use the extension on x.com
   - Data: None collected

2. **`clipboardWrite`**
   - Purpose: To copy captured images to your clipboard
   - Usage: Only when you click "Copy to clipboard" button
   - Data: Only the image you captured

### Host Permissions:

1. **`https://x.com/*` and `https://twitter.com/*`**
   - Purpose: To inject the screenshot button into tweets
   - Usage: Only on x.com and twitter.com
   - Data: None collected

## 📸 What Happens to Your Screenshots

- **Storage**: Screenshots are stored temporarily in your browser's memory
- **Lifetime**: Screenshots are deleted immediately after you:
  - Close the preview modal
  - Copy to clipboard
  - Download the image
  - Refresh the page
- **External Access**: Screenshots never leave your device

## 🌐 Third-Party Services

XCapture does NOT use any third-party services, analytics, or tracking tools.

## 👥 User Responsibilities

**Important**: While using XCapture, you are responsible for:

1. **X.com Terms of Service**: Your use of X.com must comply with [Twitter's Terms of Service](https://twitter.com/en/tos) and [X.com's Terms of Service](https://x.com/en/tos)

2. **Content Rights**: Ensure you have the right to capture and use the content you screenshot:
   - Respect copyright and intellectual property
   - Follow X.com's guidelines on content usage
   - Obtain necessary permissions for third-party content

3. **Privacy of Others**: When capturing tweets:
   - Respect other users' privacy
   - Do not capture private or direct messages without consent
   - Be mindful of sharing screenshots that contain others' information

4. **Legal Compliance**: Use XCapture in compliance with all applicable laws and regulations

**XCapture is a tool provided "as is". We are not responsible for how you use the captured content.**

## 🛡️ Security

We take security seriously:

- **Open Source**: Our code can be reviewed for transparency
- **Minimal Permissions**: We only request necessary permissions
- **Local Processing**: No data leaves your browser
- **No External Servers**: Eliminates server-side security risks

## 📧 Contact Us

If you have questions about this privacy policy, please contact us:

- **Email**: [your-email@example.com]
- **GitHub**: https://github.com/firebear/xcapture/issues

## 🔄 Changes to This Policy

We may update this privacy policy from time to time. Changes will be posted on:
- Our GitHub repository
- Chrome Web Store listing

Continued use of XCapture after changes constitutes acceptance of the updated policy.

## ✅ Your Consent

By installing and using XCapture, you consent to this privacy policy.

## 📜 License

XCapture is open source software released under the MIT License.

---

## 🙏 Thank You

Thank you for trusting XCapture. We're committed to providing a privacy-focused tool that helps you capture tweets easily and securely.

**Remember**: Your privacy is our priority. Everything happens locally in your browser.

# 🚀 Chrome Web Store Submission Checklist

## ✅ Pre-Submission (Completed)

- [x] All materials created
  - [x] Screenshots (3)
  - [x] Small promotional image
  - [x] Large promotional image
- [x] Documentation prepared
  - [x] Privacy policy
  - [x] Store listing content
  - [x] Changelog
- [x] Code prepared
  - [x] Version number reset to 1.0.0
  - [x] Build created
  - [x] ZIP file generated

---

## 📋 Chrome Web Store Submission Steps

### Step 1: Developer Account (5 minutes)

1. **Visit Chrome Developer Dashboard**
   - URL: https://chrome.google.com/webstore/devconsole
   - Sign in with Google account

2. **Pay Registration Fee** (if first time)
   - One-time fee: $5 USD
   - Required for publishing extensions

3. **Complete Developer Profile**
   - Developer name
   - Email address
   - Website URL (optional)
   - Contact email (optional)

---

### Step 2: Upload Extension (10 minutes)

1. **Click "Add new item"**

2. **Upload ZIP file**
   - File: `xcapture-v1.0.2.zip`
   - Generate it with `npm run package:store`
   - Size: ~24KB

3. **Wait for processing**
   - Usually takes 1-2 minutes
   - Check for any validation errors

---

### Step 3: Store Listing Information (15 minutes)

#### Basic Information

**Extension Name** (45 chars max):
```
XCapture - Tweet Screenshot Tool
```

**Short Description** (132 chars max):
```
Capture tweets as images with one click. Preserve styling, copy or download easily. Free, no ads, privacy-focused.
```

**Detailed Description:**

Copy from `STORE_LISTING.md` → "Detailed Description" → "English" section

**Category:**
- Primary: **Productivity**
- Secondary: Photos (if available)

**Language:**
- Primary: **English**
- Secondary: Chinese (Simplified) - if you created Chinese version

---

#### Images

**Screenshots** (at least 1, up to 5):
- [ ] `store-assets/screenshots/screenshot-1-main.png` (1280x800)
- [ ] `store-assets/screenshots/screenshot-2-modal.png` (1280x800)
- [ ] `store-assets/screenshots/screenshot-3-features.png` (1280x800)

**Small Promotional Image** (required):
- [ ] `store-assets/promo/promo-small.png` (440x280)

**Large Promotional Image** (recommended):
- [ ] `store-assets/promo/promo-large.png` (920x680)

**Icon:**
- [ ] Automatically imported from manifest.json
- [ ] 16x16, 48x48, 128x128 PNG

---

#### Links

**Support URL** (required):
```
https://github.com/firebear/xcapture/issues
```

**Homepage URL** (optional):
```
https://github.com/firebear/xcapture
```

**Privacy Policy URL** (required):
```
https://github.com/firebear/xcapture/blob/master/PRIVACY_POLICY.md
```

**Important:** You need to push this repo to GitHub first!

---

### Step 4: Targeting (5 minutes)

**Regions:**
- [ ] All regions (recommended) OR
- [ ] Specific regions:
  - United States
  - United Kingdom
  - Canada
  - Australia
  - Taiwan
  - Hong Kong
  - Singapore
  - Malaysia

**Visibility:**
- [x] Public (recommended)
- [ ] Unlisted
- [ ] Private

---

### Step 5: Content Rating (5 minutes)

Answer questionnaire:
- **Violence:** None
- **Nudity/Sexual Content:** None
- **Profanity:** None
- **Mature Topics:** None
- **Alcohol/Drugs:** None
- **Gambling:** None

**Result:** Everyone (all ages)

---

### Step 6: Review and Submit (5 minutes)

1. **Review all information**
   - Check for typos
   - Verify all images
   - Confirm links work

2. **Click "Submit for review"**

3. **Wait for approval**
   - Usually 24-72 hours
   - Check email for updates

---

## 📧 After Submission

### Monitor Status
- Check Developer Dashboard daily
- Watch for email notifications
- Be ready to respond to feedback

### If Approved ✅
1. **Test installation**
   - Install from store
   - Test on x.com
   - Verify all features work

2. **Promote** (optional)
   - Share on social media
   - Announce on GitHub
   - Collect user feedback

### If Rejected ❌
1. **Read feedback carefully**
2. **Make necessary changes**
3. **Resubmit**

---

## 🔧 Troubleshooting

### Common Issues

**"Missing required files"**
- Ensure the uploaded ZIP expands with `manifest.json` at the ZIP root
- Check all icon files exist in `assets/`
- Run `npm run validate:release` before uploading

**"Invalid version number"**
- Use format: major.minor.patch (e.g., 1.0.0)
- No build numbers

**"Privacy policy URL invalid"**
- Ensure URL is publicly accessible
- Must be HTTPS
- Must contain privacy policy text

**"Screenshots too small/large"**
- Must be 1280x800 or 640x400
- PNG or JPEG only
- Max 5 screenshots

---

## 📊 Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Developer account | 5 min | ⏳ Pending |
| Upload extension | 10 min | ⏳ Pending |
| Store listing | 15 min | ⏳ Pending |
| Review wait | 24-72 hours | ⏳ Pending |
| **Total** | **~1 hour + wait** | |

---

## ✅ Final Checklist

Before clicking "Submit":

- [ ] Extension name is correct
- [ ] Short description is under 132 chars
- [ ] Detailed description is complete
- [ ] All screenshots uploaded (at least 1)
- [ ] Small promo image uploaded
- [ ] Support URL is valid
- [ ] Privacy policy URL is valid
- [ ] Category selected
- [ ] Language selected
- [ ] Target regions selected
- [ ] Content rating completed
- [ ] All links work
- [ ] No typos

---

## 🎉 After Approval

1. **Celebrate!** 🎊
2. **Test installation from store**
3. **Monitor user feedback**
4. **Plan next version**
5. **Respond to reviews**

---

## 📞 Support During Submission

If you encounter issues:
1. Check Chrome Web Store documentation
2. Search for error messages
3. Ask me for help
4. Check GitHub issues

---

**Good luck with your submission!** 🚀

Remember: Take your time, double-check everything, and don't rush. Quality over speed!

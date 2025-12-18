# Vyntyra Invoice Maker

This is a standalone HTML/JS application for generating professional invoices with dynamic features.

## Features

### 1. Invoice Generation
- **Real-time Preview:** Split-screen view with Admin Form on the left and Invoice Preview on the right.
- **Dynamic Fields:** Edit Invoice #, Date, Client Details, and Line Items instantly.
- **Calculations:** Automatic subtotal and total calculations.

### 2. Payment Settings
- **UPI QR Code:** Generate a dynamic UPI QR code by entering your UPI ID.
- **Image Upload:** Option to upload a custom QR code image (e.g., Paytm/GPay screenshot).
- **Toggle:** Switch between UPI generation and Image upload modes.

### 3. Digital Signatures
- **Upload Signatures:** Upload signature images for both "Authorized Signatory" and "Client Acceptance".
- **Annexure B Integration:** Signatures are automatically placed in the "Final Signoff" section of Annexure B.
- **Share Link:** "Share Signing Link" button (simulates copying a link to clipboard).

### 4. Annexure Customization
- **Hosting Links:** Add/Edit hosting URLs (Vercel, Netlify) in Annexure A.
- **Future Phase:** Customize the "Future Phase Commitment" title and description.

### 5. Export & Share
- **Print/PDF:** "Print / Save PDF" button formatted to hide the sidebar and print only the invoice pages (A4 size).
- **WhatsApp/Email:** Quick buttons to share the invoice details via WhatsApp or Email.

## Usage
1. Open `InvoiceMaker.html` in any modern web browser (Chrome, Edge, Firefox).
2. Fill in the details in the left sidebar.
3. Upload necessary images (QR, Signatures).
4. Click "Print / Save PDF" to save the invoice as a PDF file.

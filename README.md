# Wang-Jiaxin-s-personal-website
Personal website.

## Add a result attachment

1. Put the new file in the `PDF/` folder.
2. Open `attachments.js`.
3. Copy one existing item in `window.attachments`, then change:
   - `title`: the result name shown on the page
   - `description`: the attachment content shown below the title
   - `file`: the file path, usually `PDF/your-file.pdf`
   - `buttonText`: the button text

Only the first item needs `open: true`; remove it from other items if you do not want them expanded by default.

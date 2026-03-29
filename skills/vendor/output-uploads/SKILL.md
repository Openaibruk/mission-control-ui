---
name: output-uploads
version: 1.0.0
description: "Upload documents to Google Drive and share links as output."
---

# Document Output Uploads

## Rule
Any time you create a document (PPTX, PDF, MD, XLSX, CSV, etc.), ALWAYS:
1. Upload to Google Drive: `gws drive +upload <file> --format table`
2. Make shareable: `gws drive permissions create --params '{"fileId":"<ID>"}' --json '{"role":"reader","type":"anyone"}'`
3. Share the link: `https://drive.google.com/file/d/<ID>/view`
4. Include the link in the output path / response to the user

## Examples
```bash
# Upload
gws drive +upload ./report.pdf --format table

# Share (get file ID from upload response)
gws drive permissions create --params '{"fileId":"<ID>"}' --json '{"role":"reader","type":"anyone"}'

# Link
# https://drive.google.com/file/d/<ID>/view
```

## Output Format
Always provide:
1. Direct Google Drive link (clickable)
2. File name and size
3. Brief description of contents

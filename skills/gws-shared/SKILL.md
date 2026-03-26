---
name: gws-shared
version: 1.1.0
description: "Shared config for Google Workspace CLI skills."
metadata:
  openclaw:
    category: "system"
---

# Google Workspace CLI Setup

The `gws` command-line tool is now **fully authenticated natively** on the VPS. 

Agents no longer need to use `gcloud auth print-access-token` or manual Bearer tokens.

You can simply run `gws` commands directly, and the CLI will automatically handle token refresh in the background securely via the local keyring.

**Example usage:**
```bash
gws drive files list --params '{"q": "name='\''04_PROJECTS'\''"}'
gws docs documents create --title "My New Doc"
```

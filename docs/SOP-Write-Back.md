# SOP: Agent Write-Back Loop to Google Drive

This Standard Operating Procedure outlines how AI agents should publish their final reports (in `.md` or `.pdf` format) directly to the `04_PROJECTS` folder in Google Drive upon completion of a task.

## Prerequisites

- The `gws` (Google Workspace CLI) is installed and authenticated in the agent's environment.
- The `gcloud` CLI is installed and authenticated for generating access tokens.

## Target Folder

The target Google Drive folder for project reports is `04_PROJECTS`.
**Folder ID:** `1YhGgHJhAH7VjoHGlK5OwCkaOC5rIjGTI`

## Procedure

Agents must execute the following commands in their shell environment to ensure proper authentication and then to upload or create documents in Google Drive.

### 1. Set up Environment Variables

Before running any `gws` commands, ensure your `PATH` includes the `gcloud` binary and that you have an active Google Workspace CLI token.

```bash
export PATH=$PATH:/home/ubuntu/.openclaw/workspace/google-cloud-sdk/bin
export GOOGLE_WORKSPACE_CLI_TOKEN=$(gcloud auth print-access-token)
```
**Note:** The `GOOGLE_WORKSPACE_CLI_TOKEN` is short-lived. It should be regenerated for each new session or if the token expires during a long-running task.

### 2. Uploading a File (Markdown or PDF)

To upload an existing `.md` or `.pdf` file to the `04_PROJECTS` folder, use the `gws drive upload` command:

```bash
# Example: Uploading a Markdown report
gws drive upload --parent 1YhGgHJhAH7VjoHGlK5OwCkaOC5rIjGTI --file /path/to/your/final_report.md

# Example: Uploading a PDF report
gws drive upload --parent 1YhGgHJhAH7VjoHGlK5OwCkaOC5rIjGTI --file /path/to/your/final_report.pdf
```
- `--parent`: Specifies the ID of the parent folder in Google Drive.
- `--file`: Specifies the path to the local file you wish to upload.

### 3. Creating a Google Docs Document

If the final report is generated as text and you want to create a new Google Docs document directly in the `04_PROJECTS` folder, use `gws docs documents create`:

```bash
# Example: Creating a new Google Doc from a Markdown file's content
# First, get the content of your markdown file
REPORT_CONTENT=$(cat /path/to/your/final_report.md)

# Then, create the document with the content and set the parent folder
gws docs documents create \
  --title "Final Project Report - [Your Project Name]" \
  --parent 1YhGgHJhAH7VjoHGlK5OwCkaOC5rIjGTI \
  --initial-content "$REPORT_CONTENT"
```
- `--title`: Sets the title of the new Google Docs document.
- `--parent`: Specifies the ID of the parent folder in Google Drive.
- `--initial-content`: Provides the initial text content for the document.

## Completion

Once the report is successfully uploaded or created in Google Drive, the agent's write-back loop task is considered complete.
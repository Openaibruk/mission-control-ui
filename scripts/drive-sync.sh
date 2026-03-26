#!/bin/bash

# Export necessary variables for gcloud and gws CLI
export PATH=$PATH:/home/ubuntu/.openclaw/workspace/google-cloud-sdk/bin
export GOOGLE_WORKSPACE_CLI_TOKEN=$(gcloud auth print-access-token)

# Define the target Drive folder ID and local knowledge directory
DRIVE_FOLDER_ID="1yyI14_bQ1uYv4__WRfr4gnVRD0JM_xiQ"
KNOWLEDGE_DIR="/home/ubuntu/.openclaw/workspace/knowledge"

# Create the knowledge directory if it doesn't exist
mkdir -p "$KNOWLEDGE_DIR"

echo "Syncing Google Drive folder $DRIVE_FOLDER_ID to $KNOWLEDGE_DIR..."

# List files in the specified Drive folder
gws drive files list --params '{"q":"\"'$DRIVE_FOLDER_ID'\" in parents and trashed = false", "fields":"files(id,name,mimeType)"}' | jq -c '.files[]' | while read -r file; do
    FILE_ID=$(echo "$file" | jq -r '.id')
    FILE_NAME=$(echo "$file" | jq -r '.name')
    MIME_TYPE=$(echo "$file" | jq -r '.mimeType')

    echo "Processing file: $FILE_NAME (ID: $FILE_ID, Type: $MIME_TYPE)"

    # Determine the output file path
    OUTPUT_NAME=$(echo "$FILE_NAME" | sed 's/\.[^.]*$//') # Remove original extension
    OUTPUT_PATH="$KNOWLEDGE_DIR/$OUTPUT_NAME.md" # Default to .md

    case "$MIME_TYPE" in
        "application/vnd.google-apps.document")
            echo "  Exporting Google Doc as markdown/plain text..."
            # Try to export as markdown first
            gws drive files export --params '{"fileId":"'$FILE_ID'", "mimeType":"text/markdown"}' --output "$OUTPUT_PATH" > /dev/null 2>&1
            if [ $? -ne 0 ]; then
                echo "  Markdown export failed, falling back to plain text."
                gws drive files export --params '{"fileId":"'$FILE_ID'", "mimeType":"text/plain"}' --output "$OUTPUT_PATH"
            fi
            ;;
        "application/vnd.google-apps.spreadsheet")
            echo "  Exporting Google Sheet as CSV for now (no direct markdown conversion)..."
            # Change output path to .csv for spreadsheets
            OUTPUT_PATH="$KNOWLEDGE_DIR/$FILE_NAME.csv"
            gws drive files export --params '{"fileId":"'$FILE_ID'", "mimeType":"text/csv"}' --output "$OUTPUT_PATH"
            ;;
        "application/vnd.google-apps.presentation")
            echo "  Exporting Google Slide as plain text (no direct markdown conversion)..."
            gws drive files export --params '{"fileId":"'$FILE_ID'", "mimeType":"text/plain"}' --output "$OUTPUT_PATH"
            ;;
        *)
            echo "  Unsupported MIME type: $MIME_TYPE. Skipping direct conversion, attempting plain text export if possible."
            # For other files, try to download as plain text if it's a convertible type
            if gws drive files export --params '{"fileId":"'$FILE_ID'", "mimeType":"text/plain"}' --output "$OUTPUT_PATH" > /dev/null 2>&1; then
                echo "  Downloaded as plain text."
            else
                echo "  Could not export as plain text. Skipping."
                rm -f "$OUTPUT_PATH" # Remove the empty file if export failed
            fi
            ;;
    esac
done

echo "Drive sync complete."

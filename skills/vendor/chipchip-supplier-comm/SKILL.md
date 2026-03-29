---
name: telegram-supplier-communicator
version: 0.1.0
description: A skill to send automated messages to farmers/suppliers via a Telegram bot API.
metadata:
  openclaw:
    category: Communication
---

# Telegram Supplier Communicator Skill

This skill allows agents to send automated messages to registered suppliers via a Telegram bot.

## Usage

To use this skill, you need a Telegram bot token and the chat ID of the supplier you want to communicate with.

### Example: Send a simple message

```bash
curl -s -X POST \
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -d chat_id=<SUPPLIER_CHAT_ID> \
  -d text="Hello supplier! Your new order details are ready."
```

### Example: Send an order update

```bash
curl -s -X POST \
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -d chat_id=<SUPPLIER_CHAT_ID> \
  -d text="Order #12345: New quantity for item X is 150 units. Please confirm." \
  -d parse_mode="Markdown"
```

## Configuration

Set the Telegram bot token and supplier chat IDs as environment variables or retrieve them from a secure store within your agent's context.

-   `TELEGRAM_BOT_TOKEN`: Your Telegram bot's API token.
-   `TELEGRAM_SUPPLIER_CHAT_ID_<SUPPLIER_NAME>`: The chat ID for a specific supplier.

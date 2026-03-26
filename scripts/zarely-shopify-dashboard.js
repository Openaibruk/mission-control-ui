// Shopify Integration Dashboard mock backend
console.log("Zarely Shopify Dashboard Backend Initialized");
module.exports = {
  fetchAgentMetrics: async () => {
    return { support_chats: 45, low_stock_alerts: 2, blogs_drafted: 1 };
  }
}

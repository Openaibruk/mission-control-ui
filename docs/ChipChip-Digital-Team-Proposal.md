# ChipChip Digital Team Proposal

## Core Business Goals

Based on the provided documents, ChipChip's core business goals are to transition from an operationally heavy, asset-owning model to an "asset-light" orchestrator model. This involves:

*   **Shifting Volume to Better Channels:** Moving away from low-quality, operationally expensive volume towards B2B (HORECA, Direct Restaurants), B2B2C (Super Leaders), and export channels.
*   **Improving Operational Efficiency & Reducing Costs:** Eliminating the central warehouse, reducing last-mile fragmentation, improving route density, and pushing physical risks (handling, storage, delivery, damage) outwards to suppliers and Super Leaders.
*   **Controlling Flows, Not Assets:** ChipChip aims to become a demand aggregator, flow designer, settlement engine, risk controller, and SLA enforcer, taking margin on coordination rather than handling.
*   **Strengthening Digital and Financial Leverage:** Leveraging data visibility (order frequency, SKU velocity, seasonality, payment discipline), payment control (BNPL with strict discipline), and potentially blockchain-backed trade credit ledgers to create a structural competitive advantage.
*   **Automating Internal Processes:** Optimizing internal activity, identifying repeated tasks, reducing manual follow-up, and automating control and reporting to create a permanent company improvement engine.
*   **Enforcing Discipline:** Implementing strict rules around cut-off times, volume commitments, supplier liability, and margin floors (CP1 auto-block) due to the absence of a warehouse buffer.

## Proposed AI Team

The proposed AI team is designed to support ChipChip's transition to an asset-light, digitally-driven orchestrator, focusing on demand aggregation, flow control, and financial discipline.

### 1. @DemandOrchestrator

*   **Role:** Manages and optimizes demand aggregation across all channels (B2B, B2B2C, FMCG), ensuring pricing discipline and volume commitments.
*   **Responsibilities:**
    *   Aggregating restaurant orders and generating consolidated Purchase Orders (POs) for suppliers.
    *   Managing Super Leader weekly volume commitments and offer discovery.
    *   Enforcing cut-off times and volume commitment rules.
    *   Monitoring CP1 (Contribution Profit 1) and automatically blocking orders that fail the margin floor.
    *   Coordinating FMCG demand with direct distributors for drop-shipment.

### 2. @SupplierSLAEnforcer

*   **Role:** Ensures strict adherence to Supplier Service Level Agreements (SLAs) and manages supplier relations in the asset-light model.
*   **Responsibilities:**
    *   Onboarding and managing an approved supplier list.
    *   Tracking SLA compliance and delivery performance.
    *   Processing and verifying delivery confirmations (potentially leveraging immutable digital records/blockchain).
    *   Facilitating supplier communication regarding orders, pricing, and delivery.
    *   Managing supplier liability for damage, late deliveries, or incorrect quantities.

### 3. @CreditRiskAnalyst

*   **Role:** Manages the BNPL (Buy Now Pay Later) program, focusing on credit scoring, risk mitigation, and financial discipline.
*   **Responsibilities:**
    *   Developing and implementing internal credit scoring for restaurants and Super Leaders.
    *   Enforcing short-cycle repayment terms (7-14 days max) and hard caps on exposure.
    *   Automatically blocking credit extensions for non-compliant entities.
    *   Tracking repayment behavior and default risk.
    *   Exploring and potentially integrating with a blockchain-backed trade credit ledger.

### 4. @ProcessOptimizer

*   **Role:** Identifies and automates internal operational inefficiencies and manual tasks, contributing to the internal AI feedback loop.
*   **Responsibilities:**
    *   Mining existing workflows (e.g., `workflow.csv`) to identify repeated manual work.
    *   Prioritizing automation opportunities based on impact and frequency.
    *   Implementing selected automations (e.g., fuel reimbursement verification, purchase request creation, payment reconciliation, inventory discrepancy investigation, vendor coordination).
    *   Automating internal control and reporting.

## Required Custom Skills

To enable the proposed AI team, the following specific OpenClaw skills should be built:

*   **`demand-aggregator-po-generator`**: A skill for @DemandOrchestrator to consolidate digital orders from restaurants and Super Leaders and automatically generate Purchase Orders (POs) for suppliers, including pricing and quantity details.
*   **`superleader-commit-manager`**: A skill for @DemandOrchestrator to manage weekly volume commitments from Super Leaders, including sending reminders and validating against forecasts.
*   **`pricing-gate-enforcer`**: A skill for @DemandOrchestrator to automatically check CP1 margins for every order and block orders that fall below the predefined margin floor.
*   **`supplier-sla-tracker`**: A skill for @SupplierSLAEnforcer to track and report on supplier delivery performance, timeliness, and quality based on predefined SLAs. This could include integrating with a system for digital delivery confirmations.
*   **`trade-credit-scorer`**: A skill for @CreditRiskAnalyst to implement and maintain a credit scoring model for restaurants and Super Leaders, evaluating their payment history, default risk, and eligibility for BNPL.
*   **`bnpl-auto-blocker`**: A skill for @CreditRiskAnalyst to automatically enforce BNPL rules, including setting credit caps, short repayment cycles, and blocking further credit for non-compliant entities.
*   **`blockchain-ledger-integrator`**: A skill for @CreditRiskAnalyst to interact with a blockchain-backed trade credit ledger for recording B2B transactions, verifiable credit history, and delivery proofs (Phase 2).
*   **`telegram-supplier-communicator`**: A skill for @SupplierSLAEnforcer to send automated messages, order details, and SLA reminders to suppliers via Telegram or other relevant communication platforms.
*   **`google-sheets-inventory-reader`**: A skill for @DemandOrchestrator or @SupplierSLAEnforcer to read inventory levels and product availability from supplier-managed Google Sheets.
*   **`google-forms-data-extractor`**: A skill for @ProcessOptimizer to extract data from Google Forms used for internal requests (e.g., Material and Pitty cash request).
*   **`gws-docs-creator`**: A skill for @ProcessOptimizer to automate the creation of documents like "Purchase Request Document" based on triggers or extracted data.
*   **`gws-sheets-reconciler`**: A skill for @ProcessOptimizer to verify and reconcile customer payment records or inventory discrepancies within Google Sheets.

## Execution Plan

The execution plan prioritizes building the foundational elements for the asset-light model and addressing critical areas identified in the strategy documents.

**Phase 1: Foundation and Discipline (Immediate - aligned with ChipChip's Phase 1)**

1.  **`pricing-gate-enforcer` (High Priority):** This skill is crucial for enforcing CP1 discipline, a non-negotiable rule in the asset-light model. It directly supports the "Kill warehouse" and "Tight BNPL discipline" goals.
2.  **`demand-aggregator-po-generator` (High Priority):** This skill enables the core B2B orchestration flow, consolidating orders and generating POs without physical touch.
3.  **`superleader-commit-manager` (High Priority):** Essential for managing demand in the B2B2C Super Leader model, ensuring volume commitments and reducing forecasting inaccuracies.
4.  **`trade-credit-scorer` & `bnpl-auto-blocker` (High Priority):** These skills are fundamental for establishing strict BNPL discipline and building internal credit scoring, which is a critical moat for ChipChip.
5.  **`telegram-supplier-communicator` (Medium Priority):** Enhances supplier coordination, crucial when physical interaction is reduced.
6.  **`google-sheets-inventory-reader` (Medium Priority):** Supports better visibility into supplier-held inventory.

**Phase 2: Optimization and Advanced Leverage (After Phase 1 is stable)**

1.  **`supplier-sla-tracker` (High Priority):** Once the basic flows are stable, robust SLA tracking is vital for maintaining trust and enforcing supplier liability.
2.  **`gws-docs-creator` & `google-forms-data-extractor` (Medium Priority):** Focus on automating internal processes like purchase requests, reducing manual effort as identified in `workflow.csv`.
3.  **`gws-sheets-reconciler` (Medium Priority):** Automating financial and inventory reconciliation tasks to further optimize internal activities.
4.  **`blockchain-ledger-integrator` (Strategic Priority):** This skill is a longer-term strategic play to build a defensible trade credit ledger, aligning with ChipChip's Phase 2 goal of moving to a structured trade ledger and potentially blockchain-backed credit history. This should only be pursued once BNPL is stable and disciplined.

import databaseService from "../services/databaseService";

/**
 * Script to fix currency format in existing withdrawal updates
 * Run with: npx ts-node src/scripts/fix-withdrawal-updates.ts
 */

async function fixWithdrawalUpdates() {
  try {
    console.log("Starting to fix withdrawal update formats...");

    // Get all withdrawal updates with old format
    const updates = await databaseService.query(
      `SELECT id, description FROM campaign_updates
       WHERE title = 'Pencairan Dana'
       AND is_automatic = TRUE
       AND description LIKE '%Rp%00.00%'`
    );

    console.log(`Found ${updates.length} updates to fix`);

    for (const update of updates) {
      // Extract the amount from old format
      // Example: "Dana sebesar Rp 25000.00,- telah dicairkan..."
      const match = update.description.match(/Rp\s*([0-9,.]+)/);

      if (match) {
        const oldAmountStr = match[1].replace(/[,.-]/g, ''); // Remove all separators
        const amount = parseInt(oldAmountStr);

        // Format to new format
        const formattedAmount = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);

        // Replace in description
        const newDescription = update.description.replace(
          /Dana sebesar Rp\s*[0-9,.]+[,-]*/,
          `Dana sebesar ${formattedAmount}`
        );

        // Update database
        await databaseService.execute(
          "UPDATE campaign_updates SET description = ? WHERE id = ?",
          [newDescription, update.id]
        );

        console.log(`Fixed update ${update.id}: ${formattedAmount}`);
      }
    }

    console.log("✅ All updates fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing updates:", error);
    process.exit(1);
  }
}

// Run the script
fixWithdrawalUpdates();

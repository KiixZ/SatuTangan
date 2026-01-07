import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "tangansatu",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function recalculateCollectedAmounts() {
  let connection;

  try {
    console.log("=== RECALCULATE COLLECTED AMOUNTS SCRIPT ===");
    console.log("Connecting to database...");

    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to database");

    // Get current statistics before update
    console.log("\n--- BEFORE UPDATE ---");
    const [beforeStats] = await connection.query(
      `SELECT
        COUNT(*) as total_campaigns,
        SUM(collected_amount) as total_collected_before
       FROM campaigns`
    );
    console.log("Before:", beforeStats);

    // Get donations statistics
    const [donationStats] = await connection.query(
      `SELECT
        COUNT(*) as total_donations,
        SUM(amount) as total_amount,
        status
       FROM donations
       GROUP BY status`
    );
    console.log("\nDonation breakdown:");
    console.table(donationStats);

    // Show campaigns with their current vs actual collected amounts
    console.log("\n--- CAMPAIGN ANALYSIS ---");
    const [campaignAnalysis] = await connection.query(
      `SELECT
        c.id,
        c.title,
        c.collected_amount as current_collected,
        COALESCE(SUM(d.amount), 0) as actual_collected,
        (COALESCE(SUM(d.amount), 0) - c.collected_amount) as difference
       FROM campaigns c
       LEFT JOIN donations d ON d.campaign_id = c.id AND d.status = 'SUCCESS'
       GROUP BY c.id, c.title, c.collected_amount
       ORDER BY difference DESC`
    );
    console.table(campaignAnalysis);

    // Update all campaigns
    console.log("\n--- UPDATING CAMPAIGNS ---");
    const [updateResult] = await connection.query(
      `UPDATE campaigns c
       SET collected_amount = (
         SELECT COALESCE(SUM(d.amount), 0)
         FROM donations d
         WHERE d.campaign_id = c.id AND d.status = 'SUCCESS'
       )`
    );
    console.log("Update result:", updateResult);

    // Get statistics after update
    console.log("\n--- AFTER UPDATE ---");
    const [afterStats] = await connection.query(
      `SELECT
        COUNT(*) as total_campaigns,
        SUM(collected_amount) as total_collected_after
       FROM campaigns`
    );
    console.log("After:", afterStats);

    // Show updated campaigns
    console.log("\n--- UPDATED CAMPAIGNS ---");
    const [updatedCampaigns] = await connection.query(
      `SELECT
        c.id,
        c.title,
        c.collected_amount,
        c.goal_amount,
        ROUND((c.collected_amount / c.goal_amount) * 100, 2) as progress_percentage
       FROM campaigns
       WHERE collected_amount > 0
       ORDER BY collected_amount DESC`
    );
    console.table(updatedCampaigns);

    // Summary
    console.log("\n=== SUMMARY ===");
    const before = (beforeStats as any)[0].total_collected_before || 0;
    const after = (afterStats as any)[0].total_collected_after || 0;
    const difference = after - before;

    console.log(`Total campaigns: ${(afterStats as any)[0].total_campaigns}`);
    console.log(`Total collected before: Rp ${before.toLocaleString("id-ID")}`);
    console.log(`Total collected after: Rp ${after.toLocaleString("id-ID")}`);
    console.log(`Difference: Rp ${difference.toLocaleString("id-ID")}`);

    if (difference !== 0) {
      console.log("\n✅ Collected amounts have been recalculated!");
    } else {
      console.log("\n✅ All amounts were already correct!");
    }

    console.log("\n=== SCRIPT COMPLETED SUCCESSFULLY ===");
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

// Run the script
recalculateCollectedAmounts()
  .then(() => {
    console.log("\nExiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nScript failed:", error);
    process.exit(1);
  });

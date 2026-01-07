import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function generateAdminCredentials() {
  const password = "admin123"; // Default password
  const hashedPassword = await hashPassword(password);

  console.log("=== ADMIN CREDENTIALS ===");
  console.log("Email: admin@donationcampaign.com");
  console.log("Password: admin123");
  console.log("Role: ADMIN");
  console.log("");
  console.log("=== HASHED PASSWORD FOR DATABASE ===");
  console.log(hashedPassword);
  console.log("");
  console.log("=== SQL INSERT STATEMENT ===");
  console.log(
    `INSERT INTO users (id, email, password, full_name, phone_number, role, is_email_verified) VALUES (UUID(), 'admin@donationcampaign.com', '${hashedPassword}', 'Admin User', '081234567890', 'ADMIN', TRUE);`,
  );
}

generateAdminCredentials().catch(console.error);

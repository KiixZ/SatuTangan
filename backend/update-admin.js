const mysql = require('mysql2/promise');

async function updateAdminRole() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'donation_campaign'
  });

  try {
    const email = 'adminbaru@tangansatu.com';
    const role = 'ADMIN';

    const [result] = await connection.execute(
      'UPDATE users SET role = ? WHERE email = ?',
      [role, email]
    );

    console.log('✓ User role updated to ADMIN successfully!');
    console.log('Rows affected:', result.affectedRows);
    console.log('');
    console.log('=== ADMIN LOGIN CREDENTIALS ===');
    console.log('Email: adminbaru@tangansatu.com');
    console.log('Password: Admin123!');
    console.log('Role: ADMIN');
    console.log('');
    console.log('Login di: http://localhost:5175/login');

    // Verify the update
    const [rows] = await connection.execute(
      'SELECT email, role FROM users WHERE email = ?',
      [email]
    );
    console.log('Verification:', rows[0]);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

updateAdminRole();

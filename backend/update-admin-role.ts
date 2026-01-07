import databaseService from './services/databaseService';

async function updateUserToAdmin() {
  const email = 'adminbaru@tangansatu.com';
  const role = 'ADMIN';

  try {
    await databaseService.query(
      'UPDATE users SET role = ? WHERE email = ?',
      [role, email]
    );

    console.log('✓ User role updated to ADMIN successfully!');
    console.log('');
    console.log('=== ADMIN LOGIN CREDENTIALS ===');
    console.log('Email: adminbaru@tangansatu.com');
    console.log('Password: Admin123!');
    console.log('Role: ADMIN');
    console.log('');
    console.log('Login di: http://localhost:5175/login');
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    process.exit(0);
  }
}

updateUserToAdmin();

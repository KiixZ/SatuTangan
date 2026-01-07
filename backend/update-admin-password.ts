import databaseService from '../services/databaseService';

async function updateAdminPassword() {
  const newHashedPassword = '$2a$10$MPaB.kub0XnhCLS11bBTB.nCLZo1GgSe2FrmQfr14fKaZp5dqVcsG';
  const email = 'admin@donationcampaign.com';

  try {
    await databaseService.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [newHashedPassword, email]
    );

    console.log('✓ Admin password updated successfully!');
    console.log('Email: admin@donationcampaign.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    process.exit(0);
  }
}

updateAdminPassword();

# Integration Tests

This directory contains comprehensive integration tests for the backend API, database operations, and external service integrations.

## Overview

Integration tests verify that different components of the system work together correctly. Unlike unit tests that test individual functions in isolation, integration tests test the complete flow from API endpoints through services to the database and external services.

## Test Files

### 1. API Endpoint Tests

#### `auth.api.test.ts`
Tests authentication API endpoints:
- **POST /api/auth/register**: User registration with validation
- **POST /api/auth/login**: User authentication and token generation
- **GET /api/auth/me**: Current user retrieval with JWT authentication
- **Email verification flow**: Token generation and validation
- **Password reset flow**: Reset token generation and password update

**Key Test Scenarios:**
- Successful registration and login
- Duplicate email rejection
- Invalid credentials handling
- Token authentication and authorization
- Email verification process

#### `campaign.api.test.ts`
Tests campaign management API endpoints:
- **GET /api/campaigns**: Campaign listing with pagination and filters
- **GET /api/campaigns/:id**: Campaign detail retrieval
- **POST /api/campaigns**: Campaign creation (authenticated)
- **PATCH /api/campaigns/:id/status**: Campaign status updates
- **Emergency campaign toggle**: Priority campaign management

**Key Test Scenarios:**
- Campaign listing with filters (category, search, status)
- Emergency campaign prioritization
- Campaign creation with authentication
- Status management (DRAFT, ACTIVE, COMPLETED, SUSPENDED)
- Authorization checks for creator-only operations

#### `donation.api.test.ts`
Tests donation processing API endpoints:
- **POST /api/donations**: Donation creation with Midtrans integration
- **GET /api/donations/:id**: Donation detail retrieval
- **GET /api/campaigns/:id/donations**: Campaign donor list
- **GET /api/campaigns/:id/prayers**: Campaign prayer/review list

**Key Test Scenarios:**
- Donation creation with valid data
- Anonymous donation handling
- Invalid amount rejection
- Non-existent campaign handling
- Donor and prayer list retrieval
- Anonymous donor name masking

### 2. Database Tests

#### `database.test.ts`
Tests database connectivity and operations:
- **Connection Management**: Pool connections, connection reuse
- **Query Operations**: SELECT, INSERT, UPDATE, DELETE
- **Transaction Handling**: Commit, rollback, multi-operation transactions
- **Error Handling**: Constraint violations, foreign key errors, invalid SQL

**Key Test Scenarios:**
- Database connection establishment
- Concurrent connection handling
- CRUD operations with prepared statements
- Transaction commit on success
- Transaction rollback on error
- Constraint and foreign key validation
- Connection pool management

### 3. External Service Tests

#### `midtrans.test.ts`
Tests Midtrans payment gateway integration:
- **Transaction Creation**: Snap token generation
- **Signature Verification**: Webhook signature validation
- **Transaction Status**: Status checking and updates
- **Payment Methods**: Support for multiple payment types

**Key Test Scenarios:**
- Transaction creation with various amounts
- Valid signature verification
- Invalid signature rejection
- Tampered data detection
- Transaction status retrieval
- Multiple payment method support
- Error handling for invalid data
- Network error handling

**Note:** These tests use Midtrans sandbox environment for safe testing without real transactions.

#### `email.test.ts`
Tests email service functionality:
- **Email Verification**: Verification email sending
- **Password Reset**: Reset email with token
- **Verification Approval/Rejection**: Creator verification notifications
- **Withdrawal Notification**: Fund withdrawal alerts
- **Report Warning**: Campaign warning emails

**Key Test Scenarios:**
- Email sending with valid data
- Email template rendering
- Invalid email address handling
- Multiple concurrent email sends
- Email format validation
- SMTP connection error handling
- Email content verification

**Note:** In test environment, emails are not actually sent but the service functionality is verified.

## Setup and Configuration

### Prerequisites

1. **Database**: MySQL database must be running and accessible
2. **Environment Variables**: Configure `.env` file with test database credentials
3. **Dependencies**: Install all required packages with `npm install`

### Environment Setup

Create a `.env.test` file or use existing `.env` with test database:

```env
# Test Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=donation_campaign_test
DB_PORT=3306

# JWT Configuration
JWT_SECRET=test-secret-key

# Midtrans Sandbox Configuration
MIDTRANS_SERVER_KEY=your-sandbox-server-key
MIDTRANS_CLIENT_KEY=your-sandbox-client-key
MIDTRANS_IS_PRODUCTION=false

# Email Configuration (Test SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-test-smtp-user
SMTP_PASS=your-test-smtp-pass

# Frontend URLs
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Database Setup

Before running integration tests, ensure your test database is set up:

```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS donation_campaign_test;"

# Run migrations
npm run migrate
```

## Running Tests

### Run All Integration Tests
```bash
npm run test:integration
```

### Run Specific Test File
```bash
npm test -- auth.api.test.ts
npm test -- campaign.api.test.ts
npm test -- donation.api.test.ts
npm test -- database.test.ts
npm test -- midtrans.test.ts
npm test -- email.test.ts
```

### Run All Tests (Unit + Integration)
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Structure

All integration tests follow a consistent structure:

```typescript
describe('Feature Integration Tests', () => {
  beforeAll(async () => {
    // Setup test database connection
    await setupTestDatabase();
  });

  beforeEach(async () => {
    // Create test data for each test
    // e.g., create test users, campaigns, etc.
  });

  afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestData();
  });

  afterAll(async () => {
    // Close database connections
    await closeTestDatabase();
  });

  describe('Specific Feature', () => {
    it('should perform expected behavior', async () => {
      // Arrange: Setup test data
      // Act: Execute the operation
      // Assert: Verify the results
    });
  });
});
```

## Test Helpers

### `setup.ts`
Provides utility functions for test setup and cleanup:

- `setupTestDatabase()`: Initialize database connection
- `cleanupTestData()`: Remove all test data from database
- `closeTestDatabase()`: Close database connections
- `createTestUser()`: Create a test user with specified role
- `createTestCategory()`: Create a test category
- `createTestCampaign()`: Create a test campaign

### Usage Example

```typescript
import { createTestUser, createTestCategory, createTestCampaign } from './setup';

// Create test data
const creatorId = await createTestUser('creator@test.com', 'CREATOR');
const categoryId = await createTestCategory('Test Category');
const campaignId = await createTestCampaign(creatorId, categoryId);
```

## Best Practices

### 1. Test Isolation
- Each test should be independent and not rely on other tests
- Use `beforeEach` to set up fresh test data
- Use `afterEach` to clean up test data

### 2. Test Data Naming
- Prefix all test data with "test-" or "Test" for easy identification
- Use unique identifiers (timestamps, random strings) to avoid conflicts
- Clean up test data after tests complete

### 3. Async/Await
- Always use async/await for asynchronous operations
- Handle promise rejections properly
- Use try-catch blocks for error scenarios

### 4. Assertions
- Use specific assertions (toBe, toEqual, toContain, etc.)
- Test both success and failure scenarios
- Verify response structure and data types

### 5. Database Transactions
- Tests run with `--runInBand` flag to avoid race conditions
- Clean up test data in reverse order of dependencies
- Use transactions where appropriate for data consistency

## Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running and credentials in `.env` are correct

### Test Timeout
```
Error: Timeout - Async callback was not invoked within the 5000 ms timeout
```
**Solution**: Increase Jest timeout or optimize slow operations

### Midtrans API Errors
```
Error: Midtrans API returned error
```
**Solution**: Verify Midtrans sandbox credentials are correct in `.env`

### Email Service Errors
```
Error: Invalid login: 535 Authentication failed
```
**Solution**: Check SMTP credentials or use a test SMTP service like Mailtrap

## Coverage Goals

- **API Endpoints**: 90%+ coverage
- **Database Operations**: 95%+ coverage
- **External Services**: 85%+ coverage
- **Critical Paths**: 100% coverage

## Continuous Integration

Integration tests should be run in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Integration Tests
  run: |
    npm run test:integration
  env:
    DB_HOST: localhost
    DB_USER: root
    DB_PASSWORD: password
    DB_NAME: donation_campaign_test
```

## Future Improvements

1. **Performance Testing**: Add tests for API response times
2. **Load Testing**: Test system behavior under high load
3. **Security Testing**: Add tests for SQL injection, XSS, etc.
4. **End-to-End Testing**: Add full user journey tests
5. **Mock External Services**: Add option to mock Midtrans and email for faster tests
6. **Test Data Factories**: Create factories for generating test data
7. **Snapshot Testing**: Add snapshot tests for API responses

## Contributing

When adding new integration tests:

1. Follow the existing test structure and naming conventions
2. Add appropriate setup and cleanup in `beforeEach`/`afterEach`
3. Test both success and failure scenarios
4. Update this README with new test descriptions
5. Ensure tests pass locally before committing
6. Maintain test isolation and independence

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Midtrans API Documentation](https://docs.midtrans.com/)
- [Nodemailer Documentation](https://nodemailer.com/)

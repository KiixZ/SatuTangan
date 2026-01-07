# Backend Unit Tests

This directory contains comprehensive unit tests for the backend services and validators.

## Test Coverage

### Services

#### 1. AuthService (`services/authService.test.ts`)
Tests for authentication-related functionality:
- **register**: User registration with email validation, password hashing, and verification token generation
- **login**: User authentication with credential validation and JWT token generation
- **verifyEmail**: Email verification token validation and account activation
- **forgotPassword**: Password reset token generation
- **resetPassword**: Password reset with token validation
- **getUserById**: User retrieval by ID

**Total Tests**: 15

#### 2. CampaignService (`services/campaignService.test.ts`)
Tests for campaign management functionality:
- **getCampaigns**: Paginated campaign listing with filters (category, status, emergency, search)
- **getCampaignById**: Campaign detail retrieval with related data
- **createCampaign**: Campaign creation with validation
- **updateCampaign**: Campaign field updates
- **deleteCampaign**: Campaign deletion
- **updateCampaignStatus**: Status management (DRAFT, ACTIVE, COMPLETED, SUSPENDED)
- **toggleEmergency**: Emergency flag management
- **isCreator**: Creator ownership verification
- **updateCollectedAmount**: Donation amount tracking
- **Campaign Photos**: Photo upload, retrieval, and deletion
- **Campaign Updates**: Update creation and retrieval

**Total Tests**: 23

#### 3. DonationService (`services/donationService.test.ts`)
Tests for donation processing functionality:
- **createDonation**: Donation creation with Midtrans integration
- **updateDonationStatus**: Payment status updates and campaign amount synchronization
- **getDonationById**: Donation retrieval with campaign details
- **getDonationByOrderId**: Donation lookup by Midtrans order ID
- **getUserDonationHistory**: User donation history including pre-registration donations
- **getCampaignDonations**: Recent donor list with anonymous handling
- **getCampaignPrayers**: Prayer/review list with anonymous handling

**Total Tests**: 13

### Validators

#### 4. AuthValidator (`validators/authValidator.test.ts`)
Tests for authentication input validation:
- **registerValidation**: Email, password strength, full name, phone number, and captcha validation
- **loginValidation**: Email and password validation
- **forgotPasswordValidation**: Email validation
- **resetPasswordValidation**: Password strength and confirmation matching

**Total Tests**: 15

#### 5. CampaignValidator (`validators/campaignValidator.test.ts`)
Tests for campaign input validation:
- **createCampaignValidator**: Title, description, category, target amount, dates, and status validation
- **updateCampaignValidator**: Partial update validation
- **updateStatusValidator**: Status change validation
- **toggleEmergencyValidator**: Emergency flag validation
- **getCampaignsValidator**: Query parameter validation (pagination, filters)

**Total Tests**: 21

#### 6. DonationValidator (`validators/donationValidator.test.ts`)
Tests for donation input validation:
- **createDonationValidator**: Campaign ID, donor details, amount, prayer, and anonymous flag validation
- **getDonationByIdValidator**: Donation ID format validation
- **getCampaignDonationsValidator**: Campaign ID and limit validation
- **getCampaignPrayersValidator**: Campaign ID and limit validation

**Total Tests**: 20

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- authService.test.ts
```

## Test Structure

All tests follow a consistent structure:
1. **Setup**: Mock dependencies and clear state before each test
2. **Arrange**: Prepare test data and mock responses
3. **Act**: Execute the function being tested
4. **Assert**: Verify expected outcomes

## Mocking Strategy

- **Database Service**: Mocked to avoid actual database connections
- **External Services**: Midtrans, email, and file services are mocked
- **Utilities**: JWT and bcrypt utilities are mocked for predictable behavior

## Key Testing Principles

1. **Isolation**: Each test is independent and doesn't rely on others
2. **Clarity**: Test names clearly describe what is being tested
3. **Coverage**: Tests cover both success and failure scenarios
4. **Minimal Mocking**: Only mock external dependencies, not internal logic
5. **Real Validation**: Validators test actual validation logic without mocks

## Test Results Summary

- **Total Test Suites**: 6
- **Total Tests**: 107
- **Status**: All Passing ✓

## Coverage Goals

- Services: 80%+ code coverage
- Validators: 90%+ code coverage
- Critical paths: 100% coverage

## Future Improvements

1. Add integration tests for API endpoints
2. Add tests for middleware functions
3. Add tests for utility functions
4. Increase edge case coverage
5. Add performance benchmarks

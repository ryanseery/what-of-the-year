## Get started

1. Install dependencies

   ```bash
   bun i
   ```

2. Start the app

   ```bash
   bun start
   ```

## Running E2E Tests

This project uses [Maestro](https://maestro.mobile.dev/) for end-to-end testing. Maestro is a standalone CLI tool that requires **zero dependencies** in your project.

### Quick Start

1. Install Maestro (one-time setup):
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. Start the app on a simulator/emulator:
   ```bash
   bun ios    # For iOS
   bun android # For Android
   ```

3. Run the tests:
   ```bash
   # For Expo Go (development)
   maestro test --app-id host.exp.exponent .maestro/
   
   # For production builds, use your app's bundle identifier
   maestro test --app-id com.yourcompany.whatoftheyear .maestro/
   
   # Add --debug flag for verbose output
   maestro test --debug --app-id host.exp.exponent .maestro/
   ```

For more details, see [.maestro/README.md](.maestro/README.md)

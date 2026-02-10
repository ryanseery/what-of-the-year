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
   # Run all tests in the .maestro directory
   maestro test .maestro/
   
   # Run a specific test
   maestro test .maestro/home-screen.yaml
   
   # Add --debug-output flag for verbose output
   maestro test --debug-output=./output .maestro/
   
   # Run tests on a specific device (if multiple are connected)
   maestro test --device "iPhone 15" .maestro/
   ```

> **Note:** Each test file contains an `appId: host.exp.Exponent` configuration at the top, which tells Maestro which app to test (Expo Go in development). For production builds, update the `appId` in each `.yaml` file to match your app's bundle identifier.

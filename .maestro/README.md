# Maestro E2E Tests

This directory contains end-to-end tests for the What of the Year app using [Maestro](https://maestro.mobile.dev/).

## Test Files

- `app-launch.yaml` - Tests that the app launches successfully and displays the main screen
- `select-topic-and-year.yaml` - Tests the flow of selecting a topic/year and navigating to the next screen

## Dependencies

**Zero dependencies required!** Maestro is a standalone CLI tool that doesn't require any npm/yarn packages or code changes to your app.

## Running Tests

### 1. Install Maestro

Install Maestro CLI (one-time setup):

```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Add to PATH (if not already added)
export PATH="$PATH":"$HOME/.maestro/bin"
```

For Windows or other installation methods, see the [official installation guide](https://maestro.mobile.dev/getting-started/installing-maestro).

### 2. Start Your App

Make sure your app is running on a simulator/emulator or physical device:

```bash
# For iOS Simulator
bun ios

# For Android Emulator
bun android
```

### 3. Run Tests

When running tests with Expo Go (development):

```bash
maestro test --app-id host.exp.exponent .maestro/
```

When running tests with a production build, you'll need to specify your app's bundle identifier:

```bash
# iOS: Use your bundle identifier from Xcode
maestro test --app-id com.yourcompany.whatoftheyear .maestro/

# Android: Use your package name from app.json or build.gradle
maestro test --app-id com.yourcompany.whatoftheyear .maestro/
```

Run a specific test:

```bash
maestro test --app-id host.exp.exponent .maestro/app-launch.yaml
```

Run with verbose output:

```bash
maestro test --debug --app-id host.exp.exponent .maestro/
```

## Writing New Tests

Maestro tests are written in YAML. Here's a simple example:

```yaml
# Test description
- launchApp
- assertVisible: "Start"
- tapOn: "Start"
- assertVisible: "Movies"
```

**Note:** The test files don't include an `appId` field at the top. This is intentional to make the tests work with both Expo Go (development) and production builds. You specify the app ID using the `--app-id` flag when running tests.

For more information on writing Maestro tests, see the [official documentation](https://maestro.mobile.dev/api-reference/commands).

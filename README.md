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

### Local Testing

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
   
   # Run a specific test
   maestro test --app-id host.exp.exponent .maestro/home-screen.yaml
   
   # Add --debug flag for verbose output
   maestro test --debug --app-id host.exp.exponent .maestro/
   ```

### CI/CD Testing with Maestro Cloud

The project includes a GitHub Actions workflow that runs Maestro tests on Maestro Cloud for every pull request.

#### Required Secrets

To enable Maestro Cloud testing in CI, add the following secrets to your GitHub repository:

1. **`MAESTRO_CLOUD_API_KEY`**: Your Maestro Cloud API key
   - Sign up at [https://console.mobile.dev/](https://console.mobile.dev/)
   - Generate an API key from your account settings
   - Add it to GitHub: Repository Settings → Secrets and variables → Actions → New repository secret

2. **`EXPO_TOKEN`**: Your Expo access token (for EAS builds)
   - Generate at [https://expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)
   - Add it to GitHub: Repository Settings → Secrets and variables → Actions → New repository secret

#### Workflow Details

The Maestro workflow (`.github/workflows/maestro.yml`):
- Triggers on pull requests to `main` and can be manually triggered
- Builds an iOS simulator app using EAS Build
- Uploads the app to Maestro Cloud
- Runs all tests in `.maestro/` directory on real devices
- Reports results back to the PR

See [MAESTRO_COSTS.md](./docs/MAESTRO_COSTS.md) for cost estimates and pricing details.

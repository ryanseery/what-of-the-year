# Maestro Cloud Cost Estimates

This document outlines the estimated costs for running Maestro tests in CI using Maestro Cloud.

## Maestro Cloud Pricing

Maestro Cloud operates on a usage-based pricing model. As of 2026, the pricing structure is:

### Pricing Tiers

1. **Free Tier**
   - Limited monthly test minutes (typically 100-300 minutes/month)
   - Good for small projects or evaluation
   - May have slower queue times during peak hours

2. **Pro Tier** (~$40-80/month)
   - Increased monthly test minutes (typically 1000-2000 minutes)
   - Priority queue access
   - Faster test execution

3. **Team/Enterprise Tiers** (Custom pricing)
   - Unlimited or high monthly test minutes
   - Dedicated infrastructure
   - Custom SLA
   - Priority support

### What Affects Costs

1. **Number of Test Flows**: Each YAML file in `.maestro/` counts as a test flow
2. **Test Duration**: Longer tests consume more minutes
3. **Number of PRs**: Each PR triggers a full test suite run
4. **Device Time**: Time spent on devices (includes app launch, test execution, teardown)

## Current Project Estimates

### Test Inventory

This project currently has **4 test flows**:
- `home-screen.yaml` - Home screen verification (~30 seconds)
- `setup-screen.yaml` - Setup flow verification (~45 seconds)
- `round-screen.yaml` - Round screen flow (~60 seconds)
- `select-topic-and-year.yaml` - Topic/year selection (~60 seconds)

**Estimated total test time per run**: ~3-4 minutes (including overhead)

### Monthly Cost Scenarios

#### Low Activity (5 PRs/month)
- Test runs: 5 PRs
- Total test time: 5 × 4 minutes = **20 minutes/month**
- **Cost**: Free tier (within limits)
- **Recommendation**: Free tier is sufficient

#### Medium Activity (20 PRs/month)
- Test runs: 20 PRs
- Total test time: 20 × 4 minutes = **80 minutes/month**
- **Cost**: Free tier or Pro tier depending on other usage
- **Recommendation**: Free tier likely sufficient, monitor usage

#### High Activity (50 PRs/month)
- Test runs: 50 PRs
- Total test time: 50 × 4 minutes = **200 minutes/month**
- **Cost**: Pro tier recommended ($40-80/month)
- **Recommendation**: Pro tier for faster queue times and reliability

#### Very High Activity (100+ PRs/month)
- Test runs: 100 PRs
- Total test time: 100 × 4 minutes = **400+ minutes/month**
- **Cost**: Pro or Team tier ($80-150/month estimated)
- **Recommendation**: Consider Team tier for better performance

## Additional Costs to Consider

### EAS Build Costs

The workflow uses Expo Application Services (EAS) to build the app before testing:

- **Free Tier**: 30 builds/month for iOS, 30 for Android
- **Production Plan**: $29/month - unlimited builds (priority queue)
- **Enterprise Plan**: Custom pricing

For this project (iOS builds only):
- Each PR requires 1 iOS build
- Free tier: Up to 30 PRs/month (sufficient for most cases)
- Beyond 30 PRs/month: Consider Production plan ($29/month)

### Total Estimated Monthly Costs

| PR Volume | Maestro Cloud | EAS Builds | Total Est. |
|-----------|--------------|------------|------------|
| 5/month   | $0 (Free)    | $0 (Free)  | **$0**     |
| 20/month  | $0 (Free)    | $0 (Free)  | **$0**     |
| 30/month  | $0 (Free)    | $0 (Free)  | **$0**     |
| 50/month  | $40-80 (Pro) | $29 (Prod) | **$69-109** |
| 100/month | $80+ (Team)  | $29 (Prod) | **$109+**  |

## Cost Optimization Strategies

1. **Run Tests Selectively**
   - Add path filters to only run tests when relevant code changes
   - Example: Only run on changes to `src/`, `.maestro/`, or config files

2. **Use workflow_dispatch Only**
   - Remove automatic PR triggers
   - Manually trigger tests only when needed
   - Good for low-traffic or early-stage projects

3. **Batch Testing**
   - Run tests on schedule (e.g., nightly) instead of per-PR
   - Suitable for less critical projects

4. **Optimize Test Duration**
   - Keep tests focused and fast
   - Remove unnecessary waits
   - Use parallel test execution when available

## Recommendations

For this project:

1. **Start with Free Tier**: Current test suite is lightweight (~4 min/run)
2. **Monitor Usage**: Track actual PR volume and test execution times
3. **Set Budget Alerts**: Configure alerts in Maestro Cloud console
4. **Consider Filters**: Add GitHub Actions path filters if PR volume increases:

```yaml
on:
  pull_request:
    branches:
      - main
    paths:
      - 'src/**'
      - '.maestro/**'
      - 'app.json'
      - 'package.json'
```

## Getting Started

1. **Sign up for Maestro Cloud**: [https://console.mobile.dev/](https://console.mobile.dev/)
   - Start with free tier
   - No credit card required initially

2. **Set up EAS**: [https://expo.dev/](https://expo.dev/)
   - Free tier includes 30 builds/month
   - Sufficient for getting started

3. **Configure Secrets**: Add `MAESTRO_CLOUD_API_KEY` and `EXPO_TOKEN` to GitHub

4. **Monitor and Adjust**: Review usage after first month and upgrade if needed

## Support and Resources

- Maestro Documentation: [https://maestro.mobile.dev/](https://maestro.mobile.dev/)
- Maestro Cloud Pricing: [https://www.mobile.dev/pricing](https://www.mobile.dev/pricing)
- EAS Pricing: [https://expo.dev/pricing](https://expo.dev/pricing)
- GitHub Actions Usage: [https://github.com/settings/billing](https://github.com/settings/billing)

export function isTestDataEnabled() {
  return process.env.USE_TEST_DATA === "true" || !process.env.MONGODB_URI;
}

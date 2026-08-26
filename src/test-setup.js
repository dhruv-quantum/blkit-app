import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Explicitly registered rather than relying on auto-detection, so each
// test's render() is fully unmounted before the next test runs.
afterEach(() => {
  cleanup();
});

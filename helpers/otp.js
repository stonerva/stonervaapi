// generateOtp-browser.js
function uniformRandomInt(max) {
  // rejection sampling using 32-bit unsigned integers
  const UINT32_MAX = 0xFFFFFFFF + 1; // 2^32
  const limit = Math.floor(UINT32_MAX / max) * max;

  const arr = new Uint32Array(1);
  while (true) {
    window.crypto.getRandomValues(arr);
    const r = arr[0];
    if (r < limit) {
      return r % max;
    }
    // otherwise reject and retry
  }
}

function generateNumericOTP(digits = 6) {
  if (!Number.isInteger(digits) || digits <= 0) throw new Error("digits must be a positive integer");
  const max = 10 ** digits; // e.g. 1_000_000 for 6 digits
  const num = uniformRandomInt(max);
  return String(num).padStart(digits, "0");
}

// Usage (6-digit OTP)
console.log(generateNumericOTP(6)); // e.g. "042371"

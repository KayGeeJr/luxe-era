const crypto = require("crypto");

function toQueryString(data) {
  const keys = Object.keys(data)
    .filter((key) => data[key] !== undefined && data[key] !== null && data[key] !== "")
    .sort();

  return keys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]).trim())}`)
    .join("&");
}

function generatePayfastSignature(data, passphrase = "") {
  let payload = toQueryString(data);
  if (passphrase) {
    payload = `${payload}&passphrase=${encodeURIComponent(passphrase)}`;
  }
  return crypto.createHash("md5").update(payload).digest("hex");
}

module.exports = {
  toQueryString,
  generatePayfastSignature,
};

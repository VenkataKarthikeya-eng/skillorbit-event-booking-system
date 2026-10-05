const crypto = require('crypto');

/**
 * Generates a unique, professional booking reference formatted as EVT-YYYYMMDD-XXXX
 * @returns {string} E.g., "EVT-20261001-A4F9"
 */
const generateBookingReference = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `EVT-${dateStr}-${randomSuffix}`;
};

module.exports = generateBookingReference;

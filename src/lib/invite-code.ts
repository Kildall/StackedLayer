const VALID_TIERS = ["TEMP", "PREM", "FREE"] as const;

const CHARSET = {
  ALPHANUMERIC: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  SPECIAL: "23456789ABCDEFGHJKLMNPQRSTUVWXYZ", // Removed similar-looking characters
};

type InviteCodeParts = {
  tier: string;
  sequence: string;
  unique: string;
  checksum: string;
  timestamp: string;
  created: Date;
};

function generateChecksum(parts: {
  tier: string;
  sequence: string;
  unique: string;
}): string {
  const input = `${parts.tier}${parts.sequence}${parts.unique}`;
  let checksum = 0;

  // Deterministic checksum algorithm
  for (let i = 0; i < input.length; i++) {
    checksum = ((checksum << 5) - checksum + input.charCodeAt(i)) >>> 0;
  }

  // Convert to base36 and pad with a deterministic pattern
  const base36 = checksum.toString(36).toUpperCase();
  return base36.padStart(4, "X").slice(-4);
}

function generateTimestampHash(date: Date = new Date()): string {
  const timestamp = date.getTime();
  const hash = ((timestamp & 0xffffff) ^ (timestamp >>> 24))
    .toString(36)
    .toUpperCase();
  return hash.padStart(4, "X");
}

function decodeTimestamp(hash: string): Date {
  const decoded = parseInt(hash, 36);
  // Simple timestamp decoding - multiply by 1000 to convert to milliseconds
  return new Date(decoded * 1000);
}

function validateInviteCode(code: string): {
  isValid: boolean;
  parts?: InviteCodeParts;
  error?: string;
} {
  // Basic format check
  const formatRegex =
    /^([A-Z]{4})-(\d{4})-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{5})$/;
  const match = code.match(formatRegex);

  if (!match) {
    return {
      isValid: false,
      error: "Invalid format. Expected: XXXX-YYYY-ZZZZ-WWWW-VVVVV",
    };
  }

  const [_, tier, sequence, unique, checksum, timestamp] = match;

  // Validate tier
  if (!VALID_TIERS.includes(tier as any)) {
    return {
      isValid: false,
      error: `Invalid tier. Must be one of: ${VALID_TIERS.join(", ")}`,
    };
  }

  // Validate checksum
  const expectedChecksum = generateChecksum({ tier, sequence, unique });
  if (checksum !== expectedChecksum) {
    return {
      isValid: false,
      error: "Invalid checksum - code may have been altered",
    };
  }

  // If all validations pass, return the parsed parts
  const created = decodeTimestamp(timestamp);
  const parts: InviteCodeParts = {
    tier,
    sequence,
    unique,
    checksum,
    timestamp,
    created,
  };

  return {
    isValid: true,
    parts,
  };
}

function generateInviteCode(
  tier: (typeof VALID_TIERS)[number],
  sequence: number,
  date: Date = new Date()
): string {
  const sequenceStr = sequence.toString().padStart(4, "0");
  const unique = generateUniqueString();
  const checksum = generateChecksum({ tier, sequence: sequenceStr, unique });
  const timestamp = generateTimestampHash(date);

  return `${tier}-${sequenceStr}-${unique}-${checksum}-${timestamp}`;
}

function generateUniqueString(): string {
  const chars = CHARSET.ALPHANUMERIC;
  return Array.from({ length: 4 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export { generateInviteCode, validateInviteCode };

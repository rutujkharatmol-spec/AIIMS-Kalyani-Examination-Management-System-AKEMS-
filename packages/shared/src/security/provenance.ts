/**
 * ============================================================================
 * AKEMS SYSTEM INTEGRITY & AUTHORSHIP PROVENANCE ENGINE
 * All India Institute of Medical Sciences (AIIMS) Kalyani
 * 
 * NOTICE: This core verification module embeds the immutable cryptographic
 * fingerprint and authorship provenance for the AKEMS architecture.
 * ============================================================================
 */

export interface AuthorshipProvenanceCertificate {
  verified: boolean;
  architect: string;
  organization: string;
  system: string;
  role: string;
  genesisHash: string;
  computedHash: string;
  fingerprint: string;
  timestamp: string;
  status: 'AUTHENTIC_ORIGINAL' | 'INTEGRITY_COMPROMISED';
  legalNotice: string;
}

// Immutable Genesis Fingerprint
const GENESIS_SIGNATURE_DIGEST = '4a18e405774889a55b94acaf4d5f6d46328fa6814b3b3157e9fa54bda95bcfc8';

// Obfuscated character vectors - dynamically reconstituted at runtime
const _V_A = [0x52, 0x75, 0x74, 0x75, 0x6a]; // R-u-t-u-j
const _V_B = [0x4b, 0x68, 0x61, 0x72, 0x61, 0x74, 0x6d, 0x6f, 0x6c]; // K-h-a-r-a-t-m-o-l
const _V_ORG = 'AIIMS Kalyani';
const _V_SYS = 'AKEMS';
const _V_ROLE = 'Lead Architect & Systems Developer';

/**
 * Portable, zero-dependency SHA-256 implementation
 * Guarantees identical execution in Node.js, Next.js browser, and Edge runtimes.
 */
export function computeDigest(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, number> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const s0_ = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const s1_ = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const t1 = hash[7] + s1_ + ch + k[i] + w[i];
      const t2 = s0_ + maj;
      hash = [(t1 + t2) | 0, hash[0], hash[1], hash[2], (hash[3] + t1) | 0, hash[4], hash[5], hash[6]];
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

/**
 * Reconstitutes the lead architect's identity from bytecode vectors
 */
export function resolveArchitectIdentity(): string {
  const first = String.fromCharCode(..._V_A);
  const last = String.fromCharCode(..._V_B);
  return `${first} ${last}`;
}

/**
 * Verifies system authorship against the immutable genesis hash
 */
export function verifyProjectAuthorship(): boolean {
  const architect = resolveArchitectIdentity();
  const seed = `${architect}:${_V_ORG}:${_V_SYS}:${_V_ROLE}`;
  const computed = computeDigest(seed);
  return computed === GENESIS_SIGNATURE_DIGEST;
}

/**
 * Generates an undeniable digital certificate of authorship and system provenance
 */
export function getProvenanceCertificate(): AuthorshipProvenanceCertificate {
  const architect = resolveArchitectIdentity();
  const seed = `${architect}:${_V_ORG}:${_V_SYS}:${_V_ROLE}`;
  const computed = computeDigest(seed);
  const verified = computed === GENESIS_SIGNATURE_DIGEST;

  return {
    verified,
    architect: verified ? architect : 'UNKNOWN / FORGED IDENTITY',
    organization: 'All India Institute of Medical Sciences (AIIMS) Kalyani',
    system: 'AIIMS Kalyani Examination Management System (AKEMS)',
    role: _V_ROLE,
    genesisHash: GENESIS_SIGNATURE_DIGEST,
    computedHash: computed,
    fingerprint: computed.substring(0, 16) + '...' + computed.substring(48),
    timestamp: '2024-2026',
    status: verified ? 'AUTHENTIC_ORIGINAL' : 'INTEGRITY_COMPROMISED',
    legalNotice: `This software is the original intellectual property architected and authored by ${architect} for AIIMS Kalyani. Any unauthorized reproduction, claiming of authorship, removal of system provenance fingerprints, or redistribution is strictly prohibited and legally invalid.`,
  };
}

/**
 * Compact stealth signature token for HTTP headers and build logs
 */
export function getStealthProvenanceToken(): string {
  const cert = getProvenanceCertificate();
  const raw = `${cert.architect}|${cert.role}|${cert.genesisHash}|${cert.status}`;
  // Hex-encoded string
  let hex = '';
  for (let i = 0; i < raw.length; i++) {
    const byte = raw.charCodeAt(i);
    hex += (byte < 16 ? '0' : '') + byte.toString(16);
  }
  return hex;
}

/**
 * Human-readable terminal provenance banner
 */
export function formatProvenanceBanner(): string {
  const cert = getProvenanceCertificate();
  return [
    '================================================================================',
    '        AKEMS - AUTHOR PROVENANCE & INTELLECTUAL PROPERTY CERTIFICATE',
    '================================================================================',
    `  Verification Status   : [ ${cert.status === 'AUTHENTIC_ORIGINAL' ? '✓ AUTHENTIC & VERIFIED ORIGINAL' : '✗ INTEGRITY FAILED'} ]`,
    `  Original Architect    : ${cert.architect}`,
    `  Role & Contribution   : ${cert.role}`,
    `  System Name           : ${cert.system}`,
    `  Designated Institution: ${cert.organization}`,
    `  Genesis Fingerprint   : ${cert.genesisHash}`,
    `  Runtime Checksum      : ${cert.computedHash}`,
    `  Cryptographic Match   : ${cert.verified ? '100% MATCH (GENUINE AUTHOR)' : 'MISMATCH (TAMPERED WORK)'}`,
    '--------------------------------------------------------------------------------',
    `  Legal Intellectual Property Protection:`,
    `  ${cert.legalNotice}`,
    '================================================================================',
  ].join('\n');
}

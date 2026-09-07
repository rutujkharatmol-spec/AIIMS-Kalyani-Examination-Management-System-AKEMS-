#!/usr/bin/env node
/**
 * ============================================================================
 * AKEMS SYSTEM PROVENANCE & INTELLECTUAL PROPERTY VERIFIER
 * Run via: pnpm verify-author
 * ============================================================================
 */

const { 
  getProvenanceCertificate, 
  verifyProjectAuthorship, 
  formatProvenanceBanner 
} = require('../packages/shared/dist/index.js');

try {
  const isVerified = verifyProjectAuthorship();
  const cert = getProvenanceCertificate();
  const banner = formatProvenanceBanner();

  console.log('\n' + banner + '\n');

  if (!isVerified) {
    console.error('❌ WARNING: INTEGRITY CHECK FAILED. Codebase appears to be altered or authorship compromised.');
    process.exit(1);
  } else {
    console.log('✅ CRYPTOGRAPHIC VERIFICATION PASSED (100% Match)');
    console.log(`🔒 Lead Architect: ${cert.architect}`);
    console.log(`🏛️ Institution: ${cert.organization}`);
    console.log(`🔑 Genesis Digest: ${cert.genesisHash}\n`);
    process.exit(0);
  }
} catch (err) {
  console.error('Failed to run verification:', err);
  process.exit(1);
}

export async function getKeyPair() {
  let keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["wrapKey", "unwrapKey"]
  );
  return keyPair;
}

export async function keyToJwk(key) {
  const jwk = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(jwk, null, " ");
}

export const publicJwk = {
  alg: "RSA-OAEP-256",
  e: "AQAB",
  ext: true,
  key_ops: ["wrapKey"],
  kty: "RSA",
  kid: "Ezygrr41abY4aTryEo0REdxQq5oQF641QNoSgycEoQo",
  n: "wHAvMwyKesnOs-LxrYNz2eBdLmBvhwCmQqyUPvoSBbSuQR1rNw065dBQwuFDlsAQJnCwk3yjC_TR1vGyh_Epj4WIcgbQEqZoFOHzOWE-66ROYMg379Q3-E-q6ETtvhxM5BJRxXBEnIfKvmeRVBPnTZc60kbST9WMkxYA_MMhE5MX5jLlLJxG3mShCOyfUYG-UocRdGOqvrQUl35zWg6H21p4U6AVX10khYW5q2981haoRG3kevppEmcPkGPI6qXG1Xkt_a1R9rchwO2pg1kBi8gLGoiV-Ew4UfBOMPygD_1ullND7YWjfaS4mhq7xsFbYexSVn8o5v_G6tGR9veEMw",
};
export const privateJwk = {
  alg: "RSA-OAEP-256",
  d: "SZrfQsxaL0r_R-jW_cIYzs41deam4eFKtpfiABCQUiRgvkEtYBosW_iI23Fj88Y0py9VKqRyjMEwfeFmov6IIgA2Rz752RhTGSGvcVQTx_fJjtUmKBJo8g4u1bZ_pMaYVmf3ZOhjJef-kUN1383ZG-FrO0Chcq3AngW9jPBpt11S2_sNIweMW9e42ZJvUW3o_8GF178XC-0xbGHrPu8YvUKoZ3hKSK3I-3DC_Rlb5RggFT6YTvmRXVvHT70SO3nOVGu1tAP7SceI1vkhPLfvigTM9GfqpccMHz0TNOXAzJKFfo6aZ29gRs_FUtK4xUKB0V2GMI_29iuodsCi520wsQ",
  dp: "LaAGgRn0IGjPfe58_VZYXK30hnLTfdWKsn89dkgUtD2AVG-29b1smChfa2GMW7PEPif4sfepYin_qXvtd2GEcFw83VQ2CaGgSc8fNIcWQv4nlyBcrbSotmzWDwozafcMuRD7eI-IQ-DX0AIj7Vy0S9XKD5HCB7KlBtSdvlNuqvk",
  dq: "rnyU_u5vNl_pV8l1Mi742XCjmfWL2wjiQsQrWuYUsLcluxaRu-OLYHtPGXd6zL9JV_s96M2yDT7sh9kkHRFqRtZDLEOWnirZb2RAsKxEK4Q3__Llf9OZaLeDqYfF3YmbV_Zkrn6_6D2iiLLZ3fNdr1wc-dTsmI3G9R93SUGwgxk",
  e: "AQAB",
  ext: true,
  key_ops: ["unwrapKey"],
  kty: "RSA",
  kid: "Ezygrr41abY4aTryEo0REdxQq5oQF641QNoSgycEoQo",
  n: "wHAvMwyKesnOs-LxrYNz2eBdLmBvhwCmQqyUPvoSBbSuQR1rNw065dBQwuFDlsAQJnCwk3yjC_TR1vGyh_Epj4WIcgbQEqZoFOHzOWE-66ROYMg379Q3-E-q6ETtvhxM5BJRxXBEnIfKvmeRVBPnTZc60kbST9WMkxYA_MMhE5MX5jLlLJxG3mShCOyfUYG-UocRdGOqvrQUl35zWg6H21p4U6AVX10khYW5q2981haoRG3kevppEmcPkGPI6qXG1Xkt_a1R9rchwO2pg1kBi8gLGoiV-Ew4UfBOMPygD_1ullND7YWjfaS4mhq7xsFbYexSVn8o5v_G6tGR9veEMw",
  p: "5EEdzdM72DsX0Q9MwevxrRvt83r-_ykMbfEltOkntzDJtg3S7O89UIgpCIoKG6yD_CyIhOR44iC1uvg9qTa2yxfxfcsRY6hVRSrHFj6Wv5kGb09qMUWd4Z942F-5uvKbjnSPE9XOMgyUORnLThoj98FEqHLII2xa3CcsYPODNns",
  q: "19SH-2qwuEwvfCBbqn-VC-_PHYhExKLRB2s2R7NFHzKf0NMI9Ja6NKZiO6VRuGTgojbFpbZUbLgFQEF10DPBIXFs0-oAIlTuLUgTT-W9Hjb5Iolpd0Hn8vpkZh7y_pTtmAUMJX3VvJrNkCbl8kE8guj_akORsFr9KwnQs2XCl6k",
  qi: "BrSBnL2joR7faO5BjTyHESg_8AlSY5arz8VFr9Qsm1EuYmFHCRRdNCQdiPbd81x2DDnxqjA7yk6eIGuxka8G7exV_7xRr1aGrVZSXSf8_hgrbBv5YAaInURBHIJBd1yWTq4v8x9pLn2X-zdl2yMREeC5GPM188ZUgw87xmJe-pg",
};

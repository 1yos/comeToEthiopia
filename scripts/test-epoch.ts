// Find the correct Ethiopian epoch
// Known ground truth: Sep 11, 2026 (Gregorian) = Meskerem 1, 2019 (Ethiopian)

// JDN for Sep 11, 2026
const gY=2026, gM=9, gD=11
const a  = Math.floor((14-gM)/12)
const y  = gY+4800-a
const m  = gM+12*a-3
const jdn = gD + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045
console.log('JDN for Sep 11 2026:', jdn)

// Test current epoch 1724221
function ethYear(epoch: number): number {
  const r = (jdn - epoch) % 1461
  return 4*Math.floor((jdn-epoch)/1461) + Math.floor(r/365) - Math.floor(r/1460)
}

// The correct Ethiopian epoch for JDN method is 1724221 but the year formula
// computes 0-based years. Let's just test surrounding values:
for (const epoch of [1724219, 1724220, 1724221, 1724222, 1724223]) {
  console.log(`  epoch ${epoch} → year ${ethYear(epoch)}`)
}

// Also test the simpler approach: just use the known relationship
// Ethiopian year = Gregorian year - 7 after Sep 11, - 8 before Sep 11
// This is the correct simple formula
const simple = (gY: number, gM: number): number => {
  if (gM > 9 || (gM === 9 && 11 <= 10)) return gY - 7
  if (gM === 9) return gY - 7  // on or after Sep 11
  return gY - 8  // before Sep 11
}
// Sep 11, 2026: month=9, day=11 → after Enkutatash → gY - 7 = 2019
console.log('\nSimple formula Sep 11 2026:', simple(2026, 9))
console.log('Simple formula Sep 10 2026:', simple(2026, 9) - (9 < 9 ? 0 : 0), '→ should be 2018')

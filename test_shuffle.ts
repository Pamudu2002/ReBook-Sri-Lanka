
// Seeded PRNG function (Mulberry32)
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Fisher-Yates shuffle with seeded PRNG
function shuffleArray<T>(array: T[], seed: number) {
  const rng = mulberry32(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const mockIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const seedA = 12345;
const seedB = 67890;

console.log('--- Test 1: Consistency (Same Seed) ---');
const run1 = shuffleArray([...mockIds], seedA);
const run2 = shuffleArray([...mockIds], seedA);
console.log('Run 1:', run1);
console.log('Run 2:', run2);
const consistent = JSON.stringify(run1) === JSON.stringify(run2);
console.log('Consistent:', consistent);

console.log('\n--- Test 2: Randomness (Different Seed) ---');
const run3 = shuffleArray([...mockIds], seedB);
console.log('Run 3:', run3);
const different = JSON.stringify(run1) !== JSON.stringify(run3);
console.log('Different:', different);

if (consistent && different) {
  console.log('\nSUCCESS: Logic is sound.');
} else {
  console.log('\nFAILURE: Logic invalid.');
}

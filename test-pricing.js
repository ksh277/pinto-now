// 가격 계산 테스트
const { calculatePrice } = require('./src/lib/pricing-data.ts');

console.log('=== 가격 계산 테스트 ===');

// 아크릴키링 3T 테스트
console.log('\n1. 아크릴키링 3T - 20x20, 101개:');
const result1 = calculatePrice('acrylic-keyring-3t', 'single', '20x20', 101);
console.log(result1);

// 라미키링 테스트
console.log('\n2. 라미키링 - 20x20, 500개:');
const result2 = calculatePrice('laminated-keyring', 'single', '20x20', 500);
console.log(result2);

// 아크릴코롯 테스트
console.log('\n3. 아크릴코롯 - 30x30 단면, 50개:');
const result3 = calculatePrice('acrylic-coaster', 'single', '30x30', 50);
console.log(result3);

console.log('\n4. 아크릴코롯 - 30x30 양면, 50개:');
const result4 = calculatePrice('acrylic-coaster', 'double', '30x30', 50);
console.log(result4);
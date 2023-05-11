const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome! Enter a calculation, I’ll give you the answer.');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    const result = calculate(input);
    console.log(`= ${result}`);
  }
});

function calculate(input) {
  const parts = input.split(' ');
  const operator = parts[1];
  const num1 = parseFloat(parts[0]);
  const num2 = parseFloat(parts[2]);

  switch(operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case 'x':
    case '*':
      return num1 * num2;
    case '/':
      return num1 / num2;
    default:
      return NaN;
  }
}
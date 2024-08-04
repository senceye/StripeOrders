const inquirer = require('inquirer');

async function testPrompt() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'testInput',
        message: 'This is a test input prompt. Type something:',
      },
    ]);

    console.log('Your input:', answers.testInput);
  } catch (error) {
    console.error('Error:', error);
  }
}

testPrompt();

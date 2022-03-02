import chalk from 'chalk';

class Console {
	ok(message: any): void {
		console.log(chalk.bold.green(message));
	}
	
	error(message: any): void {
		console.log(chalk.bold.red(message));
	}

	warning(message: any): void {
		console.log(chalk.bold.white.bgRedBright('\n', message, '\n'));
	}
}

export default new Console;

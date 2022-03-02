import net from 'net';
import Console from '../utilities/console-log';

interface ServiceType {
	start(): void,
	formatForDuplicates(): void,
	chat(): void,
	minUsers: number,
	maxUsers: number,
	usernames: any,
	userList: any,
	offlineUsers: any,
	sockets: any,
	port: number,
	counter: any
}

class Service implements ServiceType {
	minUsers: number;
	maxUsers: number;
	usernames: any;
	userList: any;
	offlineUsers: any;
	port: number;
	sockets: any;
	counter: any;

	constructor() {
		this.minUsers = 2;
		this.maxUsers = 10;
		this.usernames = [];
		this.userList = null;
		this.offlineUsers = [];
		this.sockets = [];
		this.port = 4000;
		this.counter = {};
	}

	start(): any {
		process.stdout.write('▸ Allowed 2 to 10 users. \n▸ Write: username + Intro. \n▸ Confirm: Press two times Intro.\n▸ Run sudo nc localhost {port_number} \n \n');
		process.stdin.on('data', (data: any): void => {
			const incomingUsername: string = data.toString().replace(/\s+/g, '').toLowerCase();
			this.usernames.push(incomingUsername);
	
			if(incomingUsername === '') {
				if(this.usernames.length === this.minUsers) {
					process.exit();
				} else if(this.usernames.length > this.maxUsers) {
					this.usernames.length = this.maxUsers;
					this.formatForDuplicates();
				} else { 
					this.usernames.pop();
					this.formatForDuplicates();
				}
			}
		});	
	}

	formatForDuplicates(): void {
		const counter: any = {};
		this.userList = this.usernames.map((element: any): any => {
			if(!counter[element]){
				counter[element] = 0;
			}
			counter[element]++;
			return counter[element] > 1 ? `${element}${counter[element]}` : element;
		});
		this.chat();
	} 

	chat() {
		const list: any = this.userList;
		net.createServer().on('connection', (client: any): any => {
			this.sockets.push(client);

			if(list.length === 0) {
				Console.error('error trying to access room');
				this.sockets.pop();
				client.destroy();
			}

			if(list.length !== 0) {
				client.username = list.shift();
				Console.ok(`${client.username} is online`);

				client.on('data', (data: any): any => {
					for(let i = 0; i < this.sockets.length; i++) {
						if(this.sockets[i] === client) continue;
						this.sockets[i].write(`${client.username}: ${data}`);
					}
				});
			}
			client.on('end', (): any => {
				Console.error(`${client.username} is offline`);
				this.offlineUsers.push(client.username);
				if(this.offlineUsers.length === this.sockets.length) {
					Console.error('\nfinished service');
					process.exit();
				}
			});

		}).listen(this.port, () => {
			process.stdin.pause();
			Console.ok(`Port ${this.port} open`);
			Console.warning('press ctrl+c to exit');
		});
	}	
}

export default new Service;

import type { CVData } from './types';

export const defaultCVData: CVData = {
	name: 'Ryan Prihantono',
	title: 'Software Engineer',
	phone: '+6281275770004',
	email: 'ryan.prihantono@gmail.com',
	skype: 'fetchanz',
	address: 'Jl Pawiyatan Luhur No 78, Semarang, Indonesia',
	linkedin: 'https://www.linkedin.com/in/ryan-prihantono-688641ba/',
	photoUrl: '',

	about: `I've spent over a decade as a Software Developer, working with a wide range of companies from small businesses to significant government projects. My passion is in creating user-friendly products that make a difference.
As the Co-founder of payfren.id, I focus on developing cutting-edge payment point online banking apps that meet modern financial needs.
I started my academic journey in Computer Science at Bina Nusantara University, where I also had the chance to work as a lecturer assistant. My interest in Japan took me to the Aoyama International Education Institute in 2015 to study Japanese. This was followed by an immersive experience in Game Programming at the Tokyo Design Technology Center (TECH.C) from 2016 to 2019.
I love learning and exploring new things, not just in technology, but also in sciences, languages, and different cultures. I speak Indonesian, Javanese, English, Japanese, Korean, and I'm currently learning Vietnamese.`,

	skills: [
		{ name: 'Java Spring Boot, Servlet, Hibernate', level: 85 },
		{ name: 'Kotlin Spring Boot, WebFlux', level: 85 },
		{ name: 'Go', level: 80 },
		{ name: 'Python, LangChain, LLMs, and Vector Databases', level: 70 },
		{ name: 'PostgreSQL, MySQL, MariaDB, SQLServer, Oracle', level: 85 },
		{ name: 'MongoDB', level: 80 },
		{ name: 'Cassandra', level: 75 },
		{ name: 'Redis', level: 80 },
		{ name: 'RabbitMQ, Kafka', level: 80 },
		{ name: 'Elasticsearch, Kibana, Logstash', level: 75 },
		{ name: 'ReactJS, Svelte, VueJS, PWA', level: 75 },
		{ name: 'Kotlin, Android SDK, Jetpack Compose, Coroutines', level: 70 },
		{ name: 'React Native, Flutter', level: 65 },
		{ name: 'Unity, Unreal Engine 4', level: 70 },
		{ name: 'C, C++, C#, ASP .NET, VB .NET', level: 70 },
		{ name: 'NodeJS, ExpressJS, NestJS', level: 80 },
		{ name: 'Docker, Kubernetes', level: 75 }
	],

	workExperience: [
		{
			id: '1',
			startYear: '2022',
			endYear: '2026',
			title: 'Backend Engineer',
			company: 'PT Telkom Indonesia (Digital Business Technology: OSS Project)',
			location: 'Jakarta',
			description: [
				'Developed and maintained backend microservices using Node.js (ExpressJS, NestJS), Kotlin (Spring Boot), and Go.',
				'Built a JSON-RPC 2.0-based internal query service combining Sequelize, PostgreSQL, and Redis for efficient cross-service data access.',
				'Designed and implemented event-driven systems using Kafka and RabbitMQ.',
				'Integrated Debezium and Elasticsearch for real-time data synchronization and full-text search capabilities.'
			],
			techStack:
				'Node.js, ExpressJS, NestJS, Kotlin, Spring Boot, Go, JSON-RPC 2.0, PostgreSQL, Sequelize (TypeScript), MongoDB, Redis, Debezium, Kafka, RabbitMQ, Elasticsearch'
		},
		{
			id: '2',
			startYear: '2019',
			endYear: '2022',
			title: 'Software Engineer',
			company: 'Gateway Indo Network',
			location: 'Jakarta',
			description: [
				'Took full ownership of designing, coding, and deploying Payment Point Online Banking (PPOB) apps from frontend to backend.',
				'Built frontend apps with ReactJS (PWA), Svelte (PWA) using Vite, Flutter, and Tailwind CSS.',
				'Developed backend microservices with Node.js, Kotlin (Spring Boot & WebFlux), NestJS, and Go.',
				'Worked with Cassandra and Redis for OLTP transactions, plus PostgreSQL and MongoDB for OLAP and reporting.',
				'Used event-driven design with RabbitMQ, Kafka, and Debezium for real-time data and async processing.',
				'Built modular microservices that run and update independently to support PPOB services.',
				'Managed deployment, scaling, and reliability on Kubernetes.'
			],
			techStack:
				'Frontend: ReactJS (PWA), Svelte (PWA) + Vite, Flutter, Tailwind CSS | Backend: Node.js, Kotlin (Spring Boot, WebFlux), NestJS, Go, JSON-RPC 2.0 | Databases: PostgreSQL, MongoDB, Cassandra, Redis | Messaging: RabbitMQ, Kafka, Debezium | Infrastructure: Kubernetes | Architecture: OLTP (Cassandra + Redis), OLAP, Event-driven, Microservices'
		},
		{
			id: '3',
			startYear: '2017',
			endYear: '2019',
			title: 'Game Programmer',
			company: 'GungHo Online Entertainment, Inc.',
			location: 'Tokyo, Japan',
			description: [
				'Developed and maintained game features and systems using Unity and C#.',
				'Collaborated with designers and artists to implement gameplay mechanics and UI/UX interactions.',
				'Optimized performance and ensured cross-platform stability across mobile and desktop builds.'
			],
			techStack: 'Unity, C#'
		},
		{
			id: '4',
			startYear: '2013',
			endYear: '2014',
			title: 'Software Engineer',
			company: 'Media Televisi Indonesia, PT (METRO TV)',
			location: 'Jakarta',
			description: [
				'Developed a library management system using PHP (CodeIgniter) and Bootstrap for internal content handling.',
				'Built a voice-to-text video converter in C# to automatically segment videos and generate transcripts.',
				'Extracted keywords from transcripts and stored them in the database to support search and indexing.',
				'Also worked on backend services using Java Spring Boot.'
			],
			techStack: 'C#, PHP (CodeIgniter), Bootstrap, Java Spring Boot'
		},
		{
			id: '5',
			startYear: '2013',
			endYear: '2013',
			title: 'Software Engineer',
			company: 'PT Sato Sara Semesta',
			location: 'Tangerang',
			description: [
				'Developed a Point of Sale (POS) system using C# and .NET technologies (ASP.NET, VB.NET).',
				'Integrated the POS with a PLC-based robotic carwash system to enable remote monitoring and operation.',
				'Implemented backend services using Java Spring Boot and managed data with SQL Server.'
			],
			techStack: 'C#, ASP.NET, VB.NET, SQL Server, Java Spring Boot'
		},
		{
			id: '6',
			startYear: '2012',
			endYear: '2013',
			title: 'ERP Consultant',
			company: 'PT Indodev Niaga Internet (DataOn)',
			location: 'Jakarta',
			description: [
				'Worked on ERP system customization and bug fixes using ColdFusion.',
				'Handled client requests and implemented features based on their business needs.',
				'Helped with deployment, testing, and support during implementation.'
			],
			techStack: 'ColdFusion'
		}
	],

	education: [
		{
			id: '1',
			startYear: '2016',
			endYear: '2018',
			degree: 'Game Programming',
			institution: 'Tokyo Design Technology Center (TECH.C.)'
		},
		{
			id: '2',
			startYear: '2008',
			endYear: '2012',
			degree: 'Computer Science',
			institution: 'Bina Nusantara University'
		}
	],

	languages: [
		{ id: '1', name: 'English', writeLevel: 'Excellent', speakLevel: 'Excellent' },
		{ id: '2', name: 'Japanese', writeLevel: 'Excellent', speakLevel: 'Excellent' },
		{ id: '3', name: 'Bahasa Indonesian', writeLevel: 'Excellent', speakLevel: 'Excellent' },
		{ id: '4', name: 'Korean', writeLevel: 'Good', speakLevel: 'Good' },
		{ id: '5', name: 'Vietnamese', writeLevel: 'Low', speakLevel: 'Low' }
	]
};

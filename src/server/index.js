import Koa from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();
const port = 5000;
app.use(bodyparser({ jsonLimit: '7mb' }));

const students = [];

router.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Credentials', 'true');
	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type');
	ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	await next()
})

router.options('*', async (ctx, next) => {
	ctx.status = 204;
	await next();
})

router.get('/discover', ctx => {
	console.log('GET /discover');
	const appEndPoints = {
		students: {
			read: {
				path: `http://localhost:${port}/students`,
				method: 'get'
			},
			create: {
				path: `http://localhost:${port}/students`,
				method: 'post'
			}
		}
	}
	ctx.body = appEndPoints;
});

router.get('/students', ctx => {
	console.log('GET /students');
	ctx.body = students;
});

const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
};

router.post('/students', ctx => {
	console.log('POST /students');
	const body = ctx.request.body;
	// For demo purposes, this is a reference to the id of their advisor
	const professorId = getRandomInt(0,1);
	body.advisor = {
		value: professorId,
		link: {
			href: 'http://localhost:8001/professors/' + professorId
		}
	};
	students.push(body);
	ctx.body = body;
});

app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(port, () => console.log(`students server started ${port}`));

export default app;
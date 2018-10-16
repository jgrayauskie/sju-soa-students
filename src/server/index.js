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

router.post('/students', ctx => {
	console.log('POST /students');
	const body = ctx.request.body;
	students.push(body);
	ctx.body = body;
});

app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(port, () => console.log(`students server started ${port}`));

export default app;
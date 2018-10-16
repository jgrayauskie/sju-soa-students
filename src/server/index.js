import Koa from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();
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

router.get('/students', (ctx) => {
	console.log('GET /students');
	ctx.body = students;
});

router.post('/students', (ctx) => {
	console.log('POST /students');
	const body = ctx.request.body;
	students.push(body);
	ctx.body = students;
});

app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(5000, () => console.log('students server started 5000'));

export default app;
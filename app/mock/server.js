const jsonServer = require('json-server')
const mock = require('mockjs')
const db = require('./db.js')
const routes = require('./routes.js')

const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()

const rewriter = jsonServer.rewriter(routes)

server.use(middlewares)
server.use((req, res, next) => {
  req.method = 'GET';
  setTimeout(() => {
    next();
  }, 1000)
  
})

server.use(rewriter)
server.use(router)


server.listen(3000, () => {
  console.log('mock server is running')
})
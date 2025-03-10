const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceActivationRoutes = require('./routes/serviceActivationRoutes');
const serviceRegistrationRoutes = require('./routes/serviceRegistrationRoutes');
const selfDescriptionRoutes = require('./routes/selfDescriptionRoutes');
const matchRequestRoutes = require('./routes/matchRequestRoutes');
const moreDetailsRoutes = require('./routes/moreDetailsRoutes');
const matchNextRoutes = require('./routes/matchNextRoutes');
const requestContactRoutes = require('./routes/requestContactRoutes');
const sendMessageRoutes = require('./routes/sendMessageRoutes');
const matchConfirmRoutes = require('./routes/matchConfirmRoutes');
const detailsRegistrationRoutes = require('./routes/detailsRegistrationRoutes');
const selfDescriptionRequestRoutes = require('./routes/selfDescriptionRequestRoutes');
const notifyMatchRoutes = require('./routes/notifyMatchRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', usersRoutes);
app.use('/api', profileRoutes);
app.use('/api', serviceActivationRoutes);
app.use('/api', serviceRegistrationRoutes);
app.use('/api', selfDescriptionRoutes);
app.use('/api', matchRequestRoutes);
app.use('/api', moreDetailsRoutes);
app.use('/api', matchNextRoutes);
app.use('/api', requestContactRoutes);
app.use('/api', sendMessageRoutes);
app.use('/api', matchConfirmRoutes);
app.use('/api', detailsRegistrationRoutes);
app.use('/api', selfDescriptionRequestRoutes);
app.use('/api', notifyMatchRoutes);


const PORT = process.env.PORT || 5000;
// const server =http.createServer((req, res) => {

// })
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`));

// const { getProducts, getProduct, createProduct,updateProduct, deleteProduct } = require('./controllers/productContoller')


// const server =http.createServer((req, res) => {
//     if(req.url === '/api/products' && req.method === 'GET'){
//         getProducts(req, res)
//     }else if(req.url.match(/\/api\/products\/([0-9]+)/) && req.method === 'GET'){
//         const id = req.url.split('/')[3]
//         getProduct(req, res, id)
//     } else if (req.url === '/api/products' && req.method === 'POST') {
//         createProduct(req, res)
//     } else if(req.url.match(/\/api\/products\/([0-9]+)/) && req.method === 'PUT'){
//             const id = req.url.split('/')[3]
//             updateProduct(req, res, id)
//     } else if(req.url.match(/\/api\/products\/([0-9]+)/) && req.method === 'DELETE'){
//             const id = req.url.split('/')[3]
//             deleteProduct(req, res, id)
//     } else {
//         res.writeHead(404,{'Content-Type': 'application/json'})
//         res.end(JSON.stringify({message: 'Route Not Found'}));
        
//     }
// })

// 
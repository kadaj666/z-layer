const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const querystring = require('querystring');
var cors = require('cors')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SERVER_PORT = 3000; // порт где запускается этот прокси-сервер
const PROXY_PORT = 9993;  // порт куда он делает запрос. у тебя он статический как я понял.

// отключаем ебучий вафикон
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(cors())
// обрабатываем любой метод одинакого
app.all('*', function (req, res, next) {

  let { query, method, protocol, path } = req;
  if (method === 'OPTIONS') {

    const reqHeaders = req.headers;
    console.log(reqHeaders['access-control-request-method'])
    console.log(req.headers)
    if (reqHeaders['access-control-request-method']) method = reqHeaders['access-control-request-method'];
    else return res.status(501).send('Method error', req.headers, method);
  }
  const accessKey = query['x-zt1-auth'];
  console.log('incoming request:')
  console.log('query', query)
  console.log('method', method)
  console.log('protocol', protocol)
  console.log('path', path)

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  // собираем урл для запроса
  let proxyUrl = `${protocol}://${query.rhost}:${PROXY_PORT}${path}`;

  if (Object.keys(query).length > 2) {
    delete query['rhost'];
    delete query['x-zt1-auth'];  
    proxyUrl += `?${querystring.stringify(query)}`;
  }

  const headers = {
    'x-zt1-auth': accessKey,
  };
  
  console.log('proxyUrl', proxyUrl)    
  console.log('headers', headers)    
  
  // это не сработает для ПОСТ запросов и любых других, где есть тело. Если надо, то запихни в options ещё два параметра "json: true" и "body: req.body", кажется так, но не уверен. не проверял
  const options = { 
    method,
    url: proxyUrl,
    json: req.body,
    headers,
  };
  console.log(req.body)
  // делаем запрос на сформированный url
  console.log('start proxy request')
  request(options, (error, response, body) => { // <- всё что в этих скобках выполняется не в общем потоке. Так что трай кетчи тут не сработают. Считай что вообще стартует новый процесс
    if (error) {
      console.error('error:', error);
    }
    else {
      console.log('statusCode: ' + response.statusCode);
    }
  }).pipe(res); // пайпим результат обратно клиенту
});

app.set('port', SERVER_PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
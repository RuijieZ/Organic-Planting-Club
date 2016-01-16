::loadtest -n 10000 -p test.js -T application/json http://localhost:3000/register
loadtest -n 10000 -c 10000 -r -p test.js -T application/json http://localhost:3000/login
::loadtest -n 50000 -T application/json http://localhost:3000/home
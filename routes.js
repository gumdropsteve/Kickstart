const routes = require('next-routes')(); 
// require() returns a function, 2nd () means function will be invoked immediately

routes
    .add('/campaigns/new', '/campaigns/new') // need this above so next line doesn't break `new` page
    .add('/campaigns/:address', '/campaigns/show'); // address is wildcard, : let's know after is wildcard

module.exports = routes; // export helpers for auto user navigation

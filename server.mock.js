var bodyParser = require('body-parser');
var url = require('url');

module.exports = function(app)
{
    //LOAD ACCOUNT RESOURCE
    require('./mocks/account/account')(app);

    // // LOAD MESSAGES RESOURCE
    // require('./mocks/messages/messages')(app);

    //LOAD CONFIG RESOURCE
    require('./mocks/config/config')(app);

    //LOAD ENUM RESOURCE
    require('./mocks/enum/enum')(app);

    //LOAD MOSIA RESOURCE
    require('./mocks/mosia/mosia')(app);
};

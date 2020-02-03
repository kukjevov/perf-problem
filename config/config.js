let {extend, isPresent} = require('@jscrpt/common'),
    globalConfig = require('config/default'),
    jq = require('jquery');

let config = extend({}, globalConfig); 

jq.ajax("config",
{
    async: false,
    dataType: 'json',
    success: function(data)
    {
        if(isPresent(data.debug))
        {
            config.debug = data.debug;
        }

        if(isPresent(data.apiBaseUrl))
        {
            config.apiBaseUrl = data.apiBaseUrl;
        }

        if(isPresent(data.theme))
        {
            config.theme = data.theme;
        }
    }
});

module.exports = config;
module.exports = function(app)
{
    //MY ACCOUNT
    app.useMock('GET', '/api/myaccount', 'mocks/account/my-account.json');
}
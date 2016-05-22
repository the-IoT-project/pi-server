var chai = require('chai');
var chaiHttp = require('chai-http');
var users = require('../routes/users');
var should = chai.should();
// should is an assertion library that allows us to use BDD-style assertions

chai.use(chaiHttp);

describe('Users', function(){
  it('should list all users on /users GET', function(done){
    //need tp update line 12 to reflect the server on the Pi and not heroku as example below
    // chai.request('https://chillerdb.herokuapp.com')
    //chai.request(users)
      .get('/users')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});

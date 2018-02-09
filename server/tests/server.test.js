const
  expect = require('expect'),
  request = require('supertest'),

  {app} = require('../server'),
  User = require('../models/user')

// Clear data before each test
beforeEach((done) => {
  User.remove({}).then(() => done());
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    let email = "user@example.com";

    request(app)
      .post('/users')
      .send({email})
      .expect(200)
      .expect((res) => {
        expect(res.body.user.email).toBe(email)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.find().then((users) => {
          expect(users.length).toBe(1);
          expect(users[0].email).toBe(email);
          done();
        }).catch((e) => done(e));
      });
  });



});
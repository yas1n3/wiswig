const assert = require('assert');
const request = require('supertest');

describe('Login API', function () {
    it('should authenticate user', function (done) {
        const data = {
            mail: 'jane@example.com',
            password: 'mypassword'
        };

        request('http://localhost:4000')
            .post('/auth/login')
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                console.log(res.body);

                assert.strictEqual(res.body.message, 'login successful');
                assert.strictEqual(res.body.user.user_Mail, 'jane@example.com');

                done();
            });
    });
});

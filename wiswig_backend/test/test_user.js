/* const expect = require("chai").expect;
const request = require("supertest");
const app = require("../index");
const User = require("../models/user");

describe("POST /api/auth/register", () => {
    it("should add a user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            user_First_Name: "Yassine",
            user_Last_Name: "A",
            user_Mail: "yassine.abdelfatteh@esprit.tn",
            user_Password: "password123",
        });
        expect(res.statusCode).to.equal(200);
        expect(res.text).to.equal(
            "User registered successfully! Please check your email to activate your account."
        );
        const user = await User.findOne({ user_Mail: "yassine.abdelfatteh@esprit.tn" });
        expect(user).to.not.be.null;
        expect(user.user_First_Name).to.equal("Yassine");
        expect(user.user_Last_Name).to.equal("A");
    });
}



);
 */
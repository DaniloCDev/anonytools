import request from 'supertest';
import { app } from '../../../app';

describe("Auth controller", () => {

    /**
     * test from users login
     */
    describe("POST /user/login", () => {

        it("should return Login successful.", async () => {

            const res = await request(app)
                .post("/user/login")
                .send({
                    email: "admin1@gmail.com",
                    password: "123456"
                })

            expect(res.status).toBe(200)
            expect(res.body.message).toBe("Login successful");
        });

        it("should return Login email not exist.", async () => {

            const res = await request(app)
                .post("/user/login")
                .send({
                    email: "test@gmail.com",
                    password: "123456"
                })

            expect(res.status).toBe(404)
            expect(res.body.message).toBe("Email não existe.");
        });

        it("should return Login password is invalid.", async () => {

            const res = await request(app)
                .post("/user/login")
                .send({
                    email: "admin1@gmail.com",
                    password: "1234567"
                })

            expect(res.status).toBe(401)
            expect(res.body.message).toBe("Senha inválida.");
        });
    })
});
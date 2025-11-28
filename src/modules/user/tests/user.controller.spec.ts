import request from 'supertest';
import { app } from '../../../app';

describe("User controller", () => {
    /**
     * test from users register
     */
    describe("POST /user/register", () => {

        it("should register a new use", async () => {
            const randomEmail = `test_${Date.now()}@gmail.com`;

            const res = await request(app)
                .post("/user/register")
                .send({
                    name: `test_${Date.now()}`,
                    email: randomEmail,
                    password: "123456"
                })

            expect(res.status).toBe(201)
        });

        it("should return register email exist.", async () => {

            const res = await request(app)
                .post("/user/register")
                .send({
                    name: "admin",
                    email: "test@gmail.com",
                    password: "123456"
                })

            expect(res.status).toBe(404)
            expect(res.body.message).toBe("Email já está em uso.");
        });

    })
});
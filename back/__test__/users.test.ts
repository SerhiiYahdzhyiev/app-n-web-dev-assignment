import data from "../../init-data.json";
import app from "../src/app";
import mongoose from "mongoose";
import request from "supertest";

import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { afterEach } from "node:test";

import User from "../src/modules/users/users.model";


describe("Users", () => {
    let mongod: MongoMemoryServer;
    let agent;
    let validId: string;
    let token: string;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        await mongoose.disconnect();
        await mongoose.connect(mongod.getUri(), {dbName: "ecom"});
        agent = request.agent(app);

        let res = await agent
            .post("/auth/register")
            .send({
                ...data[1],
                password: "Secret42",
                phoneNumber: "0000000000",
            });

        validId = res.body.id;

        let doc = await User.findOneAndUpdate({ _id: validId },{ role: "ADMIN" });

        res = await agent.post("/auth/login").send({
            login: data[1].email,
            password:"Secret42", 
        });
        token = res.header["set-cookie"]?.[0];
    });

    afterAll(async () => {await mongod.stop()});

    test("should not allow creating or modification by unauthorised requests", async () => {
        let res = await agent
            .post("/users/create")
            .send({
                ...data[1],
            });
        expect(res.statusCode).toBe(401);

        res = await agent
            .put("/users/" + validId)
            .send({
                countryCode: "+42"
            });

        expect(res.statusCode).toBe(401);
    });

    test("should create on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .post("/users/create")
            .send({
                ...data[0],
                password: "Secret43",
                phoneNumber: "0000000000"
            });
        expect(res.statusCode).toBe(200);
    });

    test("should update on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .put("/users/" + validId)
            .send({
                countryCode: "+11"
            });
        expect(res.statusCode).toBe(200);

        const user = await User.findOne({_id: res.body.updatedId});
        expect(user).toBeTruthy()
        expect(user?.countryCode).toBe("+11");
    });

    test("should not allow to get at all for unauthorized requests", async () => {
        let res = await agent
            .set("Cookie", [""])
            .get("/users");
        expect(res.statusCode).toBe(401);

        res = await agent
            .set("Cookie", [""])
            .get("/users/" + validId);
        expect(res.statusCode).toBe(401);
    });

    test("should get all on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .get("/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.success).toBe(true);
        expect(res.body.elements.length).toBe(2);
    });

    test("should get one on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .get("/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.success).toBe(true);
        expect(res.body.elements.length).toBe(2);
    });
});

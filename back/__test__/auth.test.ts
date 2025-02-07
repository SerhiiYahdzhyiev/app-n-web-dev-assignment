import app from "../src/app";
import data from "../../init-data.json"
import mongoose from "mongoose";
import request from "supertest";

import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, test, expect, beforeAll, afterAll, afterEach } from "vitest";

import User from "../src/modules/users/users.model";

describe("Auth", () => {
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        await mongoose.disconnect();
        console.log("Connecting...");
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri, {dbName: "ecom"});
    });

    afterEach(async () => {
        await User.deleteMany();
    })

    afterAll(async () => {
        console.log("Closing...");
        await mongod.stop()
    });

    test("registers new user on valid payload", async () => {
        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "0000000000",
            deliveryAddress: "Some address",
        };
        delete validRegistrationPayload.role;

        let res = await request(app)
            .post("/auth/register")
            .send(validRegistrationPayload);

        expect(res.statusCode).toBe(200);
        expect("id" in res.body);
        const newUser = await User.findById(res.body.id);
        expect(newUser).toBeTruthy();
        expect(newUser?.firstName).toBe(validRegistrationPayload.firstName);
        expect(newUser?.lastName).toBe(validRegistrationPayload.lastName);
        expect(newUser?.email).toBe(validRegistrationPayload.email);
        expect(newUser?.countryCode).toBe(validRegistrationPayload.countryCode);
        expect(newUser?.phoneNumber).toBe(validRegistrationPayload.phoneNumber);
        expect(newUser?.deliveryAddress).toBe(validRegistrationPayload.deliveryAddress);
    });

    test("returns 400 on invalid payload", async () => {
        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "invalid",
            deliveryAddress: "Some address",
        };
        delete validRegistrationPayload.role;

        let res = await request(app)
            .post("/auth/register")
            .send(validRegistrationPayload);

        expect(res.statusCode).toBe(400);
        //TODO: Extend this case with more variations of invalid payload.
    });

    test("returns error status on trying to create ADMIN account", async () => {
        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "0000000000",
            deliveryAddress: "Some address",
            role: "ADMIN",
        };

        let res = await request(app)
            .post("/auth/register")
            .send(validRegistrationPayload);

        expect(res.statusCode).not.toBe(200);
        expect("id" in res.body).not.toBeTruthy();
        const newUser = await User.findById(res.body.id);
        expect(newUser).not.toBeTruthy();
        expect(newUser?.role).not.toBe("ADMIN");
    });

    test("should login successfully on valid credentials...", async () => {
        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "0000000000",
            deliveryAddress: "Some address",
        };

        let res = await request(app)
            .post("/auth/register")
            .send(validRegistrationPayload);

        const newUser = await User.findById(res.body.id);
        expect(newUser?.password).not.toBe("Secret42");

        res = await request(app)
            .post("/auth/login")
            .send({
                login: "john.doe@mail.com",
                password: "Secret42",
            });

        expect(res.statusCode).toBe(204);
    })

    test("should return non 204 on wrong credentials...", async () => {
        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "0000000000",
            deliveryAddress: "Some address",
        };

        let res = await request(app)
            .post("/auth/register")
            .send(validRegistrationPayload);

        res = await request(app)
            .post("/auth/login")
            .send({
                login: "john.doe@mail.com",
                password: "wrong",
            });

        expect(res.statusCode).not.toBe(204);

        res = await request(app)
            .post("/auth/login")
            .send({
                login: "invalid@mail.com",
                password: "Secret42",
            });

        expect(res.statusCode).not.toBe(204);
        expect(res.body.message).not.toContain("password");
    });

    test("should return token in set-cookie on successful login", async () => {
        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "0000000000",
            deliveryAddress: "Some address",
        };

        let res = await request(app)
            .post("/auth/register")

            .send(validRegistrationPayload);
        res = await request(app)
            .post("/auth/login")
            .send({
                login: validRegistrationPayload.email,
                password: "Secret42",
            });

        expect(res.headers["set-cookie"][0]).toContain("token");
    });

    test("should remove token in set-cookie on successful logout", async () => {
        const agent = request.agent(app);

        const validRegistrationPayload = {
            ...data[1],
            password: "Secret42",
            countryCode: "+38",
            phoneNumber: "0000000000",
            deliveryAddress: "Some address",
        };

        let res = await agent
            .post("/auth/register")
            .send(validRegistrationPayload);

        res = await agent
            .post("/auth/login")
            .send({
                login: validRegistrationPayload.email,
                password: "Secret42",
            });

        const cookie = res.header["set-cookie"][0];
        expect(cookie).toContain("token");

        agent.set("Cookie", [cookie]);

        res = await agent
            .get("/auth/logout");

        expect(res.statusCode).toBe(204);
        // TODO: This is probably because of non browser agent
        expect(res.header["set-cookie"][0]).toBe("token=");
        // TODO: This is probably not doing any use...
        expect(agent.jar.getCookie("Cookie")?.[0]).not.toBeTruthy();
    });
});

import app from "../src/app";
import data from "../../init-data.json"
import mongoose from "mongoose";
import request from "supertest";

import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

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
});

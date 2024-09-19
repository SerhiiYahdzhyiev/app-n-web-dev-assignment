import app from "../src/app";
import mongoose from "mongoose";
import request from "supertest";

import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, test, expect, beforeAll, afterAll } from "vitest";


describe("Products", () => {
    let mongod: MongoMemoryServer;
    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        await mongoose.disconnect();
        await mongoose.connect(mongod.getUri(), {dbName: "ecom"});
    });

    afterAll(async () => {await mongod.stop()});

    test("setup", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(404);

    });
});

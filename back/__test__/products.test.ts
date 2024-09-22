import data from "../../init-data.json";
import app from "../src/app";
import mongoose from "mongoose";
import request from "supertest";

import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

import User from "../src/modules/users/users.model";
import Product from "../src/modules/products/products.model";


describe("Products", () => {
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
            .send({...data[1],
                  password: "Secret42",
                  phoneNumber: "0000000000",
            });

        const userId = res.body.id;

        await User.findOneAndUpdate({ _id: userId },{ role: "ADMIN" });

        res = await agent
            .post("/auth/login")
            .send({
                login: data[1].email,
                password:"Secret42", 
             });
        token = res.header["set-cookie"]?.[0];

        res = await agent
            .set("Cookie", [token])
            .post("/products/create")
            .send({...data[2]});

        validId = res.body.id;
    });

    afterAll(async () => {await mongod.stop()});

    test("should not allow creating or modification by unauthorised requests", async () => {
        let res = await agent
            .set("Cookie", [""])
            .post("/products/create")
            .send({
                ...data[2],
            });
        expect(res.statusCode).toBe(401);

        res = await agent
            .set("Cookie", [""])
            .put("/products/" + validId)
            .send({
                title: "New Product Title",
            });

        expect(res.statusCode).toBe(401);
    });

    test("should create on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .post("/products/create")
            .send({
                ...data[2],
            });
        expect(res.statusCode).toBe(200);
    });

    test("should update on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .put("/products/" + validId)
            .send({
                title: "New Product Title"
            });
        expect(res.statusCode).toBe(200);

        const product = await Product.findOne({_id: res.body.updatedId});
        expect(product).toBeTruthy()
        expect(product?.title).toBe("New Product Title");
    });

    test("should allow to get for unauthorized requests", async () => {
        let res = await agent
            .set("Cookie", [""])
            .get("/products");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.success).toBe(true);
        expect(res.body.elements.length).toBe(2);

        res = await agent
            .set("Cookie", [""])
            .get("/products/" + validId);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
    });
});

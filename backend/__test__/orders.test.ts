import data from "../../init-data.json";
import app from "../src/app";
import mongoose from "mongoose";
import request from "supertest";

import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

import User from "../src/modules/users/users.model";
import Order from "../src/modules/orders/orders.model";


describe("Orders", () => {
    let mongod: MongoMemoryServer;
    let agent;
    let validId: string;
    let token: string;
    let userId: string;
    let productId: string;

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

        userId = res.body.id;

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

        productId = res.body.id;

        res = await agent
            .set("Cookie", [token])
            .post("/orders/create")
            .send({userId,productsIds:[productId]});

        validId = res.body.id;
    });

    afterAll(async () => {await mongod.stop()});

    test("should not allow creating or modification by unauthorised requests", async () => {
        let res = await agent
            .set("Cookie", [""])
            .post("/orders/create")
            .send({
                userId,
                productsIds: [productId],
            });

        expect(res.statusCode).toBe(401);

        res = await agent
            .set("Cookie", [""])
            .put("/orders/" + validId)
            .send({
                productsIds: [productId],
            });
        expect(res.statusCode).toBe(401);
    });

    test("should create on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .post("/orders/create")
            .send({
                userId,
                productsIds: [productId]
            });
        expect(res.statusCode).toBe(200);
    });

    test("should update on valid payload and authorized user", async () => {
        let res = await agent
            .set("Cookie", [token])
            .put("/orders/" + validId)
            .send({
                userId,
                productsIds: [productId],
                totalPrice: 1337 
            });

        expect(res.statusCode).toBe(200);

        const order = await Order.findOne({_id: res.body.updatedId});
        expect(order).toBeTruthy()
        expect(order?.totalPrice).toBe(1337);
    });

    test("should not allow to get for unauthorized requests", async () => {
        let res = await agent
            .set("Cookie", [""])
            .get("/orders");
        expect(res.statusCode).toBe(401);

        res = await agent
            .set("Cookie", [""])
            .get("/orders/" + validId);
        expect(res.statusCode).toBe(401);
    });

    test("should allow get for authorized requests", async () => {
        let res = await agent
            .set("Cookie", [token])
            .get("/orders/" + validId);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.status).toBe("PENDING");
        expect(res.body.userId).toBe(userId);
        expect(res.body.productsIds.length).toBe(1);
        expect(res.body.productsIds?.[0]).toBe(productId);
    });
});

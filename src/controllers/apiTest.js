const { expect } = require("chai"); // або будь-яка інша бібліотека для тестування
const sinon = require("sinon");
const AuthController = require("../controllers/AuthController");
const db = require("../database/dbController");

describe("AuthController", () => {
    describe("getContent", () => {
        it("should return news with images", async () => {
            const newsData = [
                { title: "News 1", image: "image1.jpg" },
                { title: "News 2", image: "image2.jpg" },
            ];
            sinon.stub(db, "getNewsWithImages").resolves(newsData);
            const req = {};
            const res = { json: sinon.stub() };

            await AuthController.getContent(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                data: newsData,
            });
        });

        it("should handle errors", async () => {
            const errorMessage = "Database error";
            sinon
                .stub(db, "getNewsWithImages")
                .rejects(new Error(errorMessage));
            const req = {};
            const res = {
                status: sinon.stub().returns({ json: sinon.stub() }),
            };

            await AuthController.getContent(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(
                res.status().json.calledOnceWithExactly({
                    success: false,
                    error: errorMessage,
                })
            ).to.be.true;
        });
    });

    describe("getContentByTag", () => {
        it("should return news by tag", async () => {
            const tagId = "123";
            const newsData = [
                { title: "News 1", tagId: "123" },
                { title: "News 2", tagId: "123" },
            ];
            sinon.stub(db, "getNewsByTag").withArgs(tagId).resolves(newsData);
            const req = { body: { tagId } };
            const res = { json: sinon.stub() };

            await AuthController.getContentByTag(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                data: newsData,
            });
        });

        it("should handle missing tagId", async () => {
            const req = { body: {} };
            const res = {
                status: sinon.stub().returns({ json: sinon.stub() }),
            };

            await AuthController.getContentByTag(req, res);

            expect(res.status.calledOnceWith(400)).to.be.true;
            expect(
                res.status().json.calledOnceWithExactly({
                    success: false,
                    message: "Немає тегу",
                })
            ).to.be.true;
        });

        it("should handle errors", async () => {
            const errorMessage = "Database error";
            sinon.stub(db, "getNewsByTag").rejects(new Error(errorMessage));
            const req = { body: { tagId: "123" } };
            const res = {
                status: sinon.stub().returns({ json: sinon.stub() }),
            };

            await AuthController.getContentByTag(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(
                res.status().json.calledOnceWithExactly({
                    success: false,
                    error: errorMessage,
                })
            ).to.be.true;
        });
    });

    describe("getMostPopularTags", () => {
        it("should return most popular tags", async () => {
            const tagData = [
                { tag: "sports", count: 10 },
                { tag: "politics", count: 8 },
            ];
            sinon.stub(db, "countTagsOfNews").resolves(tagData);
            const req = {};
            const res = { json: sinon.stub() };

            await AuthController.getMostPopularTags(req, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                data: tagData,
            });
        });

        it("should handle errors", async () => {
            const errorMessage = "Database error";
            sinon.stub(db, "countTagsOfNews").rejects(new Error(errorMessage));
            const req = {};
            const res = {
                status: sinon.stub().returns({ json: sinon.stub() }),
            };

            await AuthController.getMostPopularTags(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(
                res.status().json.calledOnceWithExactly({
                    success: false,
                    error: errorMessage,
                })
            ).to.be.true;
        });
    });
});

const { expect } = require("chai");
const sinon = require("sinon");
const request = require("supertest");
const path = require("path");
const AuthController = require("../controllers/AuthController");
const db = require("../database/dbController");

describe("AuthController", () => {
    describe("getAdminPage", () => {
        it("should return admin page HTML", async () => {
            const filePath = path.join(
                process.cwd(),
                "public",
                "html",
                "admin_page.html"
            );
            const res = await request(AuthController.getAdminPage).get(
                "/admin-page"
            );

            expect(res.status).to.equal(200);
            expect(res.text).to.equal(fs.readFileSync(filePath, "utf8"));
        });

        it("should handle errors", async () => {
            sinon.stub(console, "error");
            const errorMessage = "File not found";
            sinon.stub(path, "join").throws(new Error(errorMessage));

            const res = await request(AuthController.getAdminPage).get(
                "/admin-page"
            );

            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal({
                success: false,
                error: errorMessage,
            });
            sinon.restore();
        });
    });

    describe("getAdminPageContent", () => {
        it("should return news data if authorized", async () => {
            const newsData = [{ title: "News 1" }, { title: "News 2" }];
            sinon.stub(db, "getNews").resolves(newsData);
            const res = { locals: { decoded: true }, json: sinon.stub() };

            await AuthController.getAdminPageContent({}, res);

            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                data: newsData,
            });
        });

        it("should handle unauthorized access", async () => {
            const res = {
                locals: {},
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            await AuthController.getAdminPageContent({}, res);

            expect(res.status.calledOnceWith(401)).to.be.true;
            expect(
                res.json.calledOnceWithExactly({
                    success: false,
                    message: "Не авторизований",
                })
            ).to.be.true;
        });

        // Add more test cases for other scenarios
    });

    describe("deletePage", () => {
        // Add test cases for deletePage method
    });
});

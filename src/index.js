require("dotenv").config(); // Загрузить переменные окружения из .env
const express = require("express"); // Фреймворк для створення веб-додатків
const app = express(); // Ініціалізація додатку Express
const path = require("path"); // Модуль для роботи з шляхами
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const checkToken = require("./middlewares/jwt.js");
const authRouter = require("./routes/authRouter.js");
const newsRouter = require("./routes/newsRouter.js");
const adminRouter = require("./routes/adminRouter.js");

app.options("*", cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.use(checkToken);

app.use("/auth", authRouter);
app.use("/news", newsRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "html", "main_page.html"));
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

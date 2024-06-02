const db = require("../database/dbСontroller");
const path = require("path");
const jwt = require("jsonwebtoken");

class AuthController {
    async getLoginPage(req, res) {
        try {
            return res.sendFile(
                path.join(process.cwd(), "public", "html", "login.html")
            );
        } catch (error) {
            return res.status(500).json({ success: false, error: `${error}` });
        }
    }

    async getRegisterPage(req, res) {
        try {
            return res.sendFile(
                path.join(process.cwd(), "public", "html", "register.html")
            );
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: `${error}` });
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body;

            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Уведені не повні дані",
                });
            }

            const candidate = await db.getUserByUsername(login);

            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: "Неправильний логін",
                });
            }

            if (password == candidate.password) {
                const accessToken = generateAccessToken(candidate);

                return res.json({
                    success: true,
                    data: {
                        candidate,
                        accessToken: accessToken,
                    },
                });
            } else {
                return res.status(403).json({
                    success: false,
                    error: "Неправильний пароль",
                });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: `${error}` });
        }
    }
    async register(req, res) {
        try {
            const { email, login, password, passwordRep } = req.body;

            if(!email.trim() || !login.trim() || !password.trim() || !passwordRep.trim()) {
                return res.status(405).json({
                    success: false,
                    error: "Заповніть всі поля",
                });
            }
            else if (password !== passwordRep) {
                return res.status(401).json({
                    success: false,
                    error: "Паролі не співпадають",
                });
            }
            else if (!email.includes("@"))
                {
                    return res.status(402).json({
                        success: false,
                        error: "Е-мейл повинен мати @",
                    });
                }
            else{
                const emailChecker = await db.findUserByEmail(email);
                if(emailChecker)
                    {
                        return res.status(403).json({
                            success: false,
                            error: "Користувач з таким емейлом вже існує у системі",
                        });
                    }
                }
    
            const user = await db.createUser({
                email,
                username: login,
                password,
            });
    
            res.status(200).json({ success: true, message: "Реєстрація успішна!", user });
        } catch (error) {
            console.error("Error in register controller:", error);
            return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
        }
    }
    
}

function generateAccessToken(user) {
    const payload = {
        user,
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_TTL,
    });
}

module.exports = new AuthController();

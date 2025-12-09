import jwt from "jsonwebtoken";
export function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token faltante" });

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || "CLAVE_SUPER_SECRETA"
        );
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
}

import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT || 4900;

app.listen(PORT, () => {
    console.log(`BMC-Link Backend Started Successfully on http://localhost:${PORT}`);
});
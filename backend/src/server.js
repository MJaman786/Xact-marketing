import app from "./app.js";
import { dbConnecion } from "./config/db.config.js";
import envConfig from "./config/env.config.js";

dbConnecion().then(() => {
    app.listen(envConfig.PORT, () => {
        console.log(`✅ Server running http://localhost:${envConfig.PORT}`);
        console.log(`✅ Server running on port ${envConfig.PORT}`);
    });
}).catch((error) => {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
})

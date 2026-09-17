import app from "./app.js";
import { env } from "./config/dotenv.config.js";
import { prisma } from "./config/database.config.js";

const port = env.port || 8200;

const startServer = async () => {
 try{

    await prisma.$connect();

    console.log(`...DB connect successfully...`);

    app.listen(port , () => {

    console.log(`server is run on port ${env.port}`);

});

 }catch(error){
    console.error(`DB connection failed ,${error}`)
 }
}

startServer();


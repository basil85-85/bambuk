import express, { Application } from "express";
import path from "path"
import dotenv from 'dotenv';
import ComingSoonRouter from "./router/Csoon"
import DBconnect from "./config/DB"
dotenv.config();

class Server {
    private app: Application;   
    private port: number;
    private DB : DBconnect;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.DB = DBconnect.getInstance()
        this.initializeMiddlewares();
        this.initializeRoutes();
        
    }

   private initializeMiddlewares(): void {
    this.app.use(express.json());                       
    this.app.use(express.urlencoded({ extended: true })); 
    this.app.set("view engine", "ejs");
    
    const staticPath = path.join(__dirname, "..", "src", "public");
    this.app.use(express.static(staticPath));
    this.app.set("views", path.join(__dirname, "view"));

}   

    private initializeRoutes(): void {
        this.app.use("/", ComingSoonRouter);                     // home routes
    }

    public  async listen(): Promise<void> {
        await this.DB.connect();
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }

    public getApp(): Application {
        return this.app;
    }
}
let port: number = Number(process.env.PORT) 
const server = new Server(port);
server.listen();
import express, { Application } from "express";
import ComingSoonRouter from "./router/Csoon"
import path from "path"
import dotenv from 'dotenv';
dotenv.config();

class Server {
    private app: Application;   
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

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

    public listen(): void {
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
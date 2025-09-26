import { Router } from "express";
import SoonController from "../controller/cSooncontroller";

class ComingSoonRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    } 

    private initializeRoutes(): void {
        this.router.get("/", SoonController.showCommingSoon);
        this.router.post("/sending", SoonController.sendingToEmail);
    }
}

// Export the router instance
export default new ComingSoonRouter().router;

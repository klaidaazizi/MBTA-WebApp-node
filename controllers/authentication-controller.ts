import {Request, Response, Express} from "express";
import UserDao from "../daos/user-dao";

const AuthenticationController = (app: Express) => {

    const userDao: UserDao = UserDao.getInstance();

    const login = async (req: Request, res: Response) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await userDao.findUserByUsername(username);

        if (!existingUser) {
            res.sendStatus(403);
            return;
        }

        if (existingUser.password === password) {
            // @ts-ignore
            req.session['profile'] = existingUser;
            res.json(existingUser);
        } else {
            res.sendStatus(403);
        }
    }

    const register = async (req: Request, res: Response) => {
        const newUser = req.body;
        //const password = newUser.password;

        const existingUser = await userDao
            .findUserByUsername(newUser.username);
        if (existingUser) {
            res.sendStatus(403);
            return;
        } else {
            const insertedUser = await userDao.createUser(newUser);
            //insertedUser.password = '';
            // @ts-ignore
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }
    }

    const profile = (req: Request, res: Response) => {
        // @ts-ignore
        const profile = req.session['profile'];
        if (profile) {
            res.json(profile);
        } else {
            res.sendStatus(403);
        }
    }

    const logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

    const reset = async (req: Request, res: Response) => {
        const newUser = req.body;
        const existingUser = await userDao
            .findUserById(req.body._id);
        if (existingUser) {
            await userDao
                .updateUser(existingUser._id,newUser);
            const updatedUser = await userDao.findUserById(req.body._id);
                //resetUser.password = '';
            // @ts-ignore
            req.session['profile'] = updatedUser;
            res.json(updatedUser);
        } else {
            res.sendStatus(403);
        }
    }

    const adminResetsUser  = async (req: Request, res: Response) => {
        const newUser = req.body;
        const existingUser = await userDao
            .findUserById(req.body._id);
        if (existingUser) {
            await userDao
                .updateUser(existingUser._id,newUser);
            const updatedUser = await userDao.findUserById(req.body._id);
            res.json(updatedUser);
        } else {
            res.sendStatus(403);
        }
    }


    app.post("/api/auth/login", login);
    app.post("/api/auth/register", register);
    app.post("/api/auth/profile", profile);
    app.post("/api/auth/logout", logout);
    app.post("/api/auth/reset", reset);
    app.post("/api/auth/admin/reset", adminResetsUser);

}

export default AuthenticationController;
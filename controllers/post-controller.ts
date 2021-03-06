import PostDao from "../daos/post-dao";
import Post from "../models/post";
import {Express, Request, Response} from "express";
import PostControllerI from "../interfaces/post-controller-I"

export default class PostController implements PostControllerI {
    private static postDao: PostDao = PostDao.getInstance();
    private static postController: PostController | null = null;

    public static getInstance = (app: Express): PostController => {
        if (PostController.postController === null) {
            PostController.postController = new PostController();

            app.post("/api/users/:uid/posts", PostController.postController.userPostsAPost);
            app.get("/api/posts/:pid", PostController.postController.findPostById);
            app.get("/api/posts", PostController.postController.findAllPosts);
            app.get("/api/users/:uid/posts", PostController.postController.findAllPostsByUser);
            app.put("/api/posts/:pid", PostController.postController.userUpdatesAPost);
            app.put("/api/posts/:pid/stats", PostController.postController.updateStats);
            app.delete("/api/posts/:pid", PostController.postController.userDeletesAPost);
        }

        return PostController.postController;
    }

    private constructor() {}


    findAllPosts = (req: Request, res: Response) =>
        PostController.postDao.findAllPosts().then((posts: Post[]) => res.json(posts));

    findAllPostsByUser = (req: Request, res: Response) => {
        console.log(req.params.uid)
        // @ts-ignore
        const userId = req.params.uid === "me" && req.session['profile'] ? req.session['profile']._id : req.params.uid;
        console.log(userId)

        if(userId === "me"){
            res.sendStatus(503);
            return;
        }
        PostController.postDao.findAllPostsByUser(userId).then((posts: Post[]) => res.json(posts));

    }

    findPostById = (req: Request, res: Response) =>
        PostController.postDao.findPostById(req.params.pid).then((post:Post) => res.json(post));

    // I'm unsure if this is correct
    updateStats = (req: Request, res: Response) =>
        PostController.postDao.updateStats(req.params.pid, req.body).then(status => res.send(status));

    userDeletesAPost = (req: Request, res: Response) =>
        PostController.postDao.userDeletesAPost(req.params.pid).then(status => res.send(status));

    userPostsAPost = (req: Request, res: Response) => {
        // @ts-ignore
        const userId = req.params.uid === "me" && req.session['profile'] ? req.session['profile']._id : req.params.uid;

        if(userId === "me"){
            res.sendStatus(503);
            return;
        }
        PostController.postDao.userPostsAPost(userId, req.body).then((post: Post) => res.json(post));
    }

    userUpdatesAPost = (req: Request, res: Response) =>
        PostController.postDao.userUpdatesAPost(req.params.pid, req.body).then(status => res.send(status));
}
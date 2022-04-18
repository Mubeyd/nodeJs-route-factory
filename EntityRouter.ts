import express, { Request, Response, Router } from "express";
import { v4 } from "uuid";
import { db } from "./app";
import { auth, logRoute, validate } from './decorators/index';
import BaseEntity, {
    EntityFactory,
    EntityTypeInstance
} from "./entities/BaseEntity";

export default class EntityRouter<T extends BaseEntity> {
    private _router: Router;

    get router(): Router {
        return this._router;
    }

    constructor(public name: string, private classRef: EntityTypeInstance<T>) {
        this._router = express.Router();
        this.addEntityRoutes();
    }


    // Route creation for each entity
    addEntityRoutes() {
        // CREATE
        this._router.post("/", (req, res) => {
            this.createEntity(req, res);
        });

        // READ ALL
        this._router.get('/', (req, res) => {
            this.fetchAllEntities(req, res);
        })

        // READ one
        this._router.get('/:id', (req, res) => {
            this.fetchEntity(req, res);
        })

        // Update
        this._router.put('/:id', (req, res) => {
            this.updateEntity(req, res);
        })

        // Delete
        this._router.delete('/:id', (req, res) => {
            this.deleteEntity(req, res);
        })
    }




    @auth("writer")
    @logRoute
    private createEntity(req: Request, res: Response) {
        let newEntity = EntityFactory.fromPersistenceObject<T>(
            req.body,
            this.classRef
        );

        // Validate
        const errorMap = validate(newEntity)

        if(Object.keys(errorMap).length > 0) {
            res.status(400).json({error: errorMap})
            return
        }

        let idProperty = Reflect.getMetadata("entity:id", newEntity);
        newEntity[idProperty] = v4();

        db.push(`/${this.name}/${newEntity[idProperty]}`, newEntity.getPersistenceObject());
        res.status(200).json(newEntity);
    }

    @auth("reader")
    @logRoute
    private fetchAllEntities(req: Request, res: Response) {
        let data = {}
        data = db.getData(`/${this.name}`)
        res.status(200).json(data);
    }

    @auth("reader")
    @logRoute
    private fetchEntity(req: Request, res: Response) {
        let data = {}
        data = db.getData(`/${this.name}/${req.params.id}`)
        res.status(200).json(data);
    }

    @auth("writer")
    @logRoute
    private updateEntity(req: Request, res: Response) {
        // Check if th object is exist in the database
        let data = {}
        try {
            data = db.getData(`/${this.name}/${req.params.id}`)
        } catch (error) {
            res.status(404).json({ error: "Object does not exist"})
            return
        }

        // Update the fields for the object

        // Json Object
        let updatedData = req.body;

        // JS Object
        let updatedObj = EntityFactory.fromPersistenceObject<T>(data, this.classRef)

        const propKeys = Object.keys(updatedData)

        for (const prop of propKeys) {
            updatedObj[prop] = updatedData[prop]
        }

        // Validate
        const errorMap = validate(updatedObj)
        
        if(Object.keys(errorMap).length > 0) {
            res.status(400).json({error: errorMap})
            return
        }

        // Persist the data to the database
        db.push(`/${this.name}/${req.params.id}`, updatedData, false);
        data = db.getData(`/${this.name}/${req.params.id}`)
        res.status(200).json(data);

    }

    @auth("deleter")
    @logRoute
    private deleteEntity(req: Request, res: Response) {
        // Check if th object is exist in the database
        try {
            db.delete(`/${this.name}/${req.params.id}`)
            res.status(200).json({});

        } catch (error) {
            res.status(404).json({ error: "Object does not exist"})
            return
        }
    }
}

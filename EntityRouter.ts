import express, { Request, Response, Router } from "express";
import { v4 } from "uuid";
import { db } from "./app";
import BaseEntity, {
    EntityFactory,
    EntityTypeInstance,
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
    }




    createEntity(req: Request, res: Response) {
        let newEntity = EntityFactory.fromPersistenceObject<T>(
            req.body,
            this.classRef
        );

        let idProperty = Reflect.getMetadata("entity:id", newEntity);
        newEntity[idProperty] = v4();

        db.push(`/${this.name}/${newEntity[idProperty]}`, newEntity.getPersistenceObject());
        res.status(200).json(newEntity);
    }


    fetchAllEntities(req: Request, res: Response) {
        let data = {}
        data = db.getData(`/${this.name}`)
        res.status(200).json(data);
    }


    fetchEntity(req: Request, res: Response) {
        let data = {}
        data = db.getData(`/${this.name}/${req.params.id}`)
        res.status(200).json(data);
    }


    updateEntity(req: Request, res: Response) {
        // Check if th object is exist in the database
        let data = {}
        try {
            data = db.getData(`/${this.name}/${req.params.id}`)
        } catch (error) {
            res.status(404).json({ error: "Object does not exist"})
            return
        }

        // Update the fields for the object
        let updatedData = req.body;

        let updatedObj = EntityFactory.fromPersistenceObject<T>(updatedData, this.classRef)

        // to be continued
    }
}

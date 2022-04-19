/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import ConductorDaoI from "../interfaces/conductor-dao-I";
import ConductorModel from "../mongoose/conductor-model";
import Conductor from "../models/conductor";

/**
 * @class ConductorDao Implements Data Access Object managing data storage
 * of administrators
 * @property {ConductorDao} conductorDao Private single instance of CommuterDao
 */
export default class ConductorDao implements ConductorDaoI {
    private static conductorDao: ConductorDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns MessageDao
     */
    public static getInstance = (): ConductorDao => {
        if (ConductorDao.conductorDao === null) {
            ConductorDao.conductorDao = new ConductorDao();
        }
        return ConductorDao.conductorDao;
    }

    private constructor() {
    }

    createConductor = async (conductor: Conductor): Promise<Conductor> =>
        ConductorModel.create({conductor: conductor});

    updateConductor = async (coid: string, conductor: Conductor): Promise<any> =>
        ConductorModel.updateOne(
            {_id: coid},
            {$set: conductor});

    deleteConductor = async (coid: string): Promise<any> =>
        ConductorModel.deleteOne({_id: coid});

    deleteConductorsByUsername = async (username: string): Promise<any> =>
        ConductorModel.deleteOne({username: username});

    findConductorById = async (coid: string): Promise<any> =>
        ConductorModel.findOne({_id: coid});

    findAllConductors = async(): Promise<Conductor[]> =>
        //@ts-ignore
        ConductorModel.find();

    updateLikes = async (coid: string): Promise<any> =>
        ConductorModel.
}
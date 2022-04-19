/**
 * @file Implements DAO managing data storage of users. Uses mongoose UserModel
 * to integrate with MongoDB
 */
import PinnedStopModel from "../mongoose/pinned-stop-model";
import PinnedStop from "../models/pinned-stop";
import PinnedStopDaoI from "../interfaces/pinned-stops-dao-I";

/**
 * @class PinnedStopDao Implements Data Access Object managing data storage
 * of Users
 * @property {PinnedStopDao} pinnedStopDao Private single instance of PinnedStopDao
 */
export default class PinnedStopDao implements PinnedStopDaoI {
    private static pinnedStopDao: PinnedStopDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns PinnedStopDao
     */
    public static getInstance = (): PinnedStopDao => {
        if(PinnedStopDao.pinnedStopDao === null) {
            PinnedStopDao.pinnedStopDao = new PinnedStopDao();
        }
        return PinnedStopDao.pinnedStopDao;
    }

    private constructor() {}


    findOnePinnedStopsByUser = async (pid: string): Promise<any> => {
        return PinnedStopModel.find({_id: pid});
    }


    findAllPinnedStopsByUser = async (uid: string): Promise<PinnedStop[]> =>
        PinnedStopModel.find({pinnedBy: uid});


    unpinStop = async (pid: string): Promise<any> => {
        return PinnedStopModel.deleteOne({_id: pid});
    }


    pinStop(routeId: string, stopId: string, userId: string): Promise<PinnedStop> {
        return PinnedStopModel.create({route: routeId, stop: stopId, pinnedBy: userId});
    }
}

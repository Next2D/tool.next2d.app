import { execute as historyRedoUseCase } from "@/controller/application/HistoryArea/usecase/HistoryRedoUseCase";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description セーブデータを一つ先の状態に進める
 *              Advance save data to the next state
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;
    if (await historyRedoUseCase(workSpace.id, scene.id)) {
        await userDatabaseAutoSaveReservationUseCase();
    }
};
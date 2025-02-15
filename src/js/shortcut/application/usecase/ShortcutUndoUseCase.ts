import { execute as historyUndoUseCase } from "@/controller/application/HistoryArea/usecase/HistoryUndoUseCase";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description セーブデータを一つ前の状態に戻す
 *              Revert save data to previous state
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;
    if (await historyUndoUseCase(workSpace.id, scene.id)) {
        await userDatabaseAutoSaveReservationUseCase();
    }
};
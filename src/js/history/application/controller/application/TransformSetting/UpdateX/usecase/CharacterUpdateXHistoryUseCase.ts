import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Character } from "@/core/domain/model/Character";
import { execute as historyRemoveElementService } from "@/controller/application/HistoryArea/service/HistoryRemoveElementService";
import { execute as historyAddElementUseCase } from "@/controller/application/HistoryArea/usecase/HistoryAddElementUseCase";
import { execute as historyGetTextService } from "@/controller/application/HistoryArea/service/HistoryGetTextService";
import { execute as characterUpdateXCreateHistoryObjectService } from "../service/CharacterUpdateXCreateHistoryObjectService";
import { $CHARACTER_UPDATE_X_COMMAND } from "@/config/HistoryConfig";
import { $useSocket } from "@/share/ShareUtil";
import { execute as shareSendService } from "@/share/service/ShareSendService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";

/**
 * @description DisplayObjectのx座標履歴の更新
 *              Update x-coordinate history of DisplayObject
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {number} before_x
 * @param  {boolean} [receiver=false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    character: Character,
    before_x: number,
    receiver: boolean = false
): Promise<void> => {

    // ポジション位置から未来の履歴を全て削除
    // fixed logic
    historyRemoveElementService(work_space);

    // fixed logic
    const historyObject = characterUpdateXCreateHistoryObjectService(
        work_space.id, movie_clip, layer, character, before_x
    );

    // 作業履歴にElementを追加
    // fixed logic
    if (work_space.active) {
        historyAddElementUseCase(
            movie_clip.id,
            work_space.historyIndex,
            historyGetTextService($CHARACTER_UPDATE_X_COMMAND),
            "",
            ...historyObject.args
        );
    }

    // 追加したLayer Objectを履歴に登録
    // fixed logic
    work_space.addHistory(historyObject);

    // 受け取り処理ではなく、画面共有していれば共有者に送信
    if (!receiver && $useSocket()) {
        shareSendService(historyObject);
    }

    // 自動保存を予約
    await userDatabaseAutoSaveReservationUseCase();
};
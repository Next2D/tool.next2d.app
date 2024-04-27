import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as stageChageStyleService  } from "@/core/application/Stage/service/StageChageStyleService";
import { execute as screenStageAreaUpdateSizeService } from "@/screen/application/ScreenStageArea/service/ScreenStageAreaUpdateSizeService";

/**
 * @description ステージの高さを更新
 *              Update the height of the stage
 *
 * @param  {WorkSpace} work_space
 * @param  {number} height
 * @param  {boolean} [receiver=false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    height: number,
    receiver: boolean = false
): void => {

    const stage = work_space.stage;

    // 変更前の幅をセット
    const beforeHeight = stage.height;

    // 変更がなければ終了
    if (beforeHeight === height) {
        return ;
    }

    // 幅を変更
    stage.height = height;

    // 履歴に登録
    console.log(receiver);

    // アクティブなら表示を更新
    if (work_space.active) {
        // ステージのスタイルを変更
        stageChageStyleService(stage);

        // ステージ背後のレイヤーを更新
        screenStageAreaUpdateSizeService(stage);
    }
};
import type { IStageObject } from "@/interface/IStageObject";
import type { Stage } from "@/core/domain/model/Stage";

/**
 * @description ステージ情報のセーブ用のオブジェクトを生成
 *              Generate an object for saving stage information
 *
 * @param  {Stage} stage
 * @return {IStageObject}
 * @method
 * @public
 */
export const execute = (stage: Stage): IStageObject =>
{
    return {
        "width": stage.width,
        "height": stage.height,
        "fps": stage.fps,
        "bgColor": stage.bgColor
    };
};
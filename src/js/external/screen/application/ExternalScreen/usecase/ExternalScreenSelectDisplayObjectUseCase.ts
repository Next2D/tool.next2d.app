import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { execute as targetRectUpdateElementUseCase } from "@/screen/application/TargetRect/usecase/TargetRectUpdateElementUseCase";
import { execute as propertyAreaChangeDisplayUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaChangeDisplayUseCase";
import { execute as screenStandardPointDeployElementUseCase } from "@/screen/application/StandardPoint/usecase/ScreenStandardPointDeployElementUseCase";
import { execute as screenReferencePointDeployElementUseCase } from "@/screen/application/ReferencePoint/usecase/ScreenReferencePointDeployElementUseCase";
import { execute as screenDisplayObjectActiveElementService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectActiveElementService";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description DisplayObjectを選択状態に更新
 *              Update the DisplayObject to the selected state
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} layer_index
 * @param  {number[]} depths
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer_index: number,
    depths: number[]
): void => {

    const layer = movie_clip.getLayer(layer_index);
    if (!layer || layer.lock) {
        return;
    }

    // 選択中のdepthがあれば重複を除いてマージ
    if (movie_clip.selectedDepths.has(layer_index)) {
        const selectedDepths = movie_clip.selectedDepths.get(layer_index) as NonNullable<number[]>;
        depths = Array.from(new Set([...depths, ...selectedDepths]));
    }

    // 選択範囲のdepthを追加
    movie_clip.selectedDepths.set(layer_index, depths);

    // 表示がアクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        // 再生中なら停止
        if (!timelineHeader.stopFlag) {
            timelineToolPlayStopUseCase();
        }

        // 選択状態のDisplayObjectをアクティブにする
        screenDisplayObjectActiveElementService(layer, depths);

        // 表示範囲を更新
        targetRectUpdateElementUseCase();

        // MovieClipなら基準点を配置
        screenStandardPointDeployElementUseCase();

        // 変形の中心点点を表示
        referenceSetting.clear();
        screenReferencePointDeployElementUseCase();

        // プロパティエリアの表示を更新
        // fixed logic プロパティエリアの表示は最後に実行する
        propertyAreaChangeDisplayUseCase();
    }
};
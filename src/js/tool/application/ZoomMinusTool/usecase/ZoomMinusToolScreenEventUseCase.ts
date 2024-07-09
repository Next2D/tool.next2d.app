import { $ZOOM_MAX_VALUE, $ZOOM_MIN_VALUE } from "@/config/ZoomConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp } from "@/global/GlobalUtil";
import { execute as zoomToolRealodWorkSpaceUseCase } from "@/tool/application/ZoomTool/usecase/ZoomToolRealodWorkSpaceUseCase";
import { execute as zoomToolUpdateElementService } from "@/tool/application/ZoomTool/service/ZoomToolUpdateElementService";

/**
 * @description ズームアウトツールのスクリーンイベントの実行関数
 *              Execution function of the screen event of the zoom out tool
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // イベントの伝播を止める
    event.stopPropagation();

    const workSpace = $getCurrentWorkSpace();
    const scale = Math.ceil($clamp(workSpace.scale * 100 / 2, $ZOOM_MIN_VALUE, $ZOOM_MAX_VALUE));

    // スケールが変更されていない場合は終了
    if (workSpace.scale === scale) {
        return ;
    }

    zoomToolUpdateElementService(scale);

    // スケールを更新
    await zoomToolRealodWorkSpaceUseCase(scale / 100);
};
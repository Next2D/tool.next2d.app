import { $getActiveTool } from "@/tool/application/ToolUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { $getCurrentWorkSpace } from "../../CoreUtil";
import { $TEXT_TYPE } from "@/config/InstanceConfig";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description 選択中のレイヤーID
 *              Layer ID currently selected
 *
 * @type {number}
 * @private
 */
let selectedLayerId: number = -1;

/**
 * @description 選択中のDepth
 *              Depth currently selected
 *
 * @type {number}
 * @private
 */
let selectedDepth: number = -1;

/**
 * @description スクリーンに設置したTextのDisplayObjectのマウスダウンイベント処理関数
 *              Mouse down event processing function of DisplayObject of Text placed on the screen
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag
    ) {
        return ;
    }

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // 移動用のwindowイベントを登録
    const tool = $getActiveTool();
    if (!tool) {
        return ;
    }

    const layerId = parseInt(element.dataset.layerId as string);
    const depth = parseInt(element.dataset.depth as string);
    if (!wait) {
        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        selectedLayerId = layerId;
        selectedDepth = depth;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

        // タップイベントを発火
        tool.dispatchEvent(EventType.DISPLAY_OBJECT, event);

    } else {

        // ダブルタップを終了
        wait = false;

        if (selectedLayerId !== layerId || selectedDepth !== depth) {
            return ;
        }

        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;
        const layer = movieClip.getLayerById(layerId);
        if (!layer) {
            return ;
        }

        const character = layer.getCharacter(movieClip.currentFrame, depth);
        if (!character) {
            return ;
        }

        const text = workSpace.getLibrary(character.libraryId);
        if (!text || text.type !== $TEXT_TYPE) {
            return ;
        }

        console.log(text);
    }
};
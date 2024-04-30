import { EventType } from "@/tool/domain/event/EventType";
import { execute as arrowToolDisplayObjectWindowMouseMoveEventUseCase } from "./ArrowToolDisplayObjectWindowMouseMoveEventUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { $getMovePositon } from "../../ToolUtil";

/**
 * @description DisplayObjectのwindowイベントを解除
 *              Remove window events for DisplayObjects
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // windowイベントを解除
    window.removeEventListener(EventType.MOUSE_MOVE,
        arrowToolDisplayObjectWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);

    // 移動量のオブジェクトを取得
    const movePosition = $getMovePositon();
    if (!movePosition.x && !movePosition.y) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 現在のフレームをセット
    const frame = movieClip.currentFrame;

    // 選択中のDisplayObjectの座標を更新
    for (const [layerIndex, depths] of movieClip.selectedDepths) {

        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue ;
        }

        // 選択中の深度からCharacterを取得
        for (let idx = 0; idx < depths.length; ++idx) {

            const character = layer.getCharacter(frame, depths[idx]);
            if (!character) {
                continue ;
            }

            // 外部APIを起動
            const externalCharacter = new ExternalCharacter(
                workSpace,
                movieClip,
                layer,
                character
            );

            externalCharacter.x += movePosition.x;
            externalCharacter.y += movePosition.y;
        }
    }
};
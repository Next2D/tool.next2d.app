import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as transformSettingWidthWindowMouseMoveEventUseCase } from "./TransformSettingWidthPointerMoveEventUseCase";
import { execute as screenAreaReplaceCanvasUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaReplaceCanvasUseCase";

/**
 * @description 変形エリアの幅の値操作のマウスアップイベント
 *              Mouse up event for value operation of width of deformation area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // windowのイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        transformSettingWidthWindowMouseMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // TODO 変更後のmatrixで表示を更新
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (movieClip.selectedDepths.size) {

        const element: HTMLElement | null = document
            .getElementById($SCREEN_STAGE_AREA_ID);

        if (element) {

            let index = 0;

            const frame = movieClip.currentFrame;
            for (const [layerIndex, depths] of movieClip.selectedDepths) {
                const layer = movieClip.getLayer(layerIndex);
                if (!layer) {
                    continue;
                }

                const elements = element.querySelectorAll(`.layer-id-${layer.id}`);
                for (let idx = 0; idx < depths.length; idx++) {
                    const depth = depths[idx];

                    const character = layer.getCharacter(frame, depth);
                    if (!character) {
                        continue;
                    }

                    // 変更後の値をセット
                    const scaleX = character.scaleX;
                    const x = character.x;

                    // 変更前の値に戻す
                    const beforeMatrix = transformSetting.matrixs[index++];
                    const beforeScaleX = Math.sqrt(
                        beforeMatrix[0] * beforeMatrix[0]
                        + beforeMatrix[1] * beforeMatrix[1]
                    );

                    character.x      = beforeMatrix[4];
                    character.scaleX = beforeScaleX;

                    const externalCharacter = new ExternalCharacter(
                        workSpace,
                        movieClip,
                        layer,
                        character
                    );

                    // 情報更新
                    await externalCharacter.setX(x);
                    await externalCharacter.setScaleX(scaleX);

                    const node = elements[depths[idx]] as HTMLElement;
                    if (!node) {
                        continue ;
                    }

                    await screenAreaReplaceCanvasUseCase(
                        character,
                        node,
                        layer
                    );
                }
            }
        }
    }

    // TODO 変形処理を実行

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;

    // input要素のフォーカス
    element.focus();
};
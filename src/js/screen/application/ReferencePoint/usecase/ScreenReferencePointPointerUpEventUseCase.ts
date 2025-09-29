import { $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { ExternalReference } from "@/external/controller/domain/model/ExternalReference";
import { Matrix } from "@next2d/geom";
import { execute as screenReferencePointPointerMoveEventUseCase } from "./ScreenReferencePointPointerMoveEventUseCase";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description 中心点elementのポインターアップイベント
 *              Pointer up event for center point element
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

    const element = event.target as HTMLDivElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // カーソルを元に戻す
    element.style.cursor = "";

    // イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        screenReferencePointPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    // 移動量を更新
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (movieClip.isSingleSelectedOfDisplayObject()) {
        const layer = movieClip.getLayer(
            movieClip.selectedDepths.keys().next().value as number
        );
        if (!layer) {
            return ;
        }

        const values = movieClip.selectedDepths.values().next().value as number[];
        const character = layer.getCharacter(movieClip.currentFrame, values[0]);
        if (!character) {
            return ;
        }

        // 最終値で更新
        const matrix = new Matrix(...Matrix.multiply($getConcatenatedMatrix(), character.matrix));
        matrix.invert();

        const x = referenceSetting.x * matrix.a + referenceSetting.y * matrix.c + matrix.tx;
        const y = referenceSetting.x * matrix.b + referenceSetting.y * matrix.d + matrix.ty;

        const externalReference = new ExternalReference(workSpace, workSpace.scene);
        await externalReference.setX(x);
        await externalReference.setY(y);
    }
};
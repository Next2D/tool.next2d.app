import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Matrix } from "@next2d/geom";
import { execute as screenReferencePointMoveElementService } from "../service/ScreenReferencePointMoveElementService";
import { execute as referenceSettingUpdateXService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateXService";
import { execute as referenceSettingUpdateYService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingUpdateYService";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description 中心点elementのポインタームーブイベント
 *              Pointer move event for center point element
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 移動する量がない場合は終了
    if (!event.movementX && !event.movementY) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const moveX = event.movementX;
        const moveY = event.movementY;

        // 基準点の位置を更新
        referenceSetting.x += moveX;
        referenceSetting.y += moveY;
        referenceSetting.movementX += moveX;
        referenceSetting.movementY += moveY;

        // elementを移動
        screenReferencePointMoveElementService(event.movementX, event.movementY);

        // 中心点エリアの値を更新
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

            const matrix = new Matrix(...Matrix.multiply($getConcatenatedMatrix(), character.matrix));
            matrix.invert();

            const x = referenceSetting.x * matrix.a + referenceSetting.y * matrix.c + matrix.tx;
            const y = referenceSetting.x * matrix.b + referenceSetting.y * matrix.d + matrix.ty;

            referenceSettingUpdateXService(x);
            referenceSettingUpdateYService(y);
        } else {
            referenceSettingUpdateXService(
                referenceSetting.pivotX + referenceSetting.movementX
            );
            referenceSettingUpdateYService(
                referenceSetting.pivotY + referenceSetting.movementY
            );
        }

    });
};
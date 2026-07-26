import type { Character } from "@/core/domain/model/Character";
import { Matrix } from "@next2d/geom";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description 変形後のmatrixに合わせて、elementの表示サイズを更新
 *              変形中は既存のcanvasを引き伸ばすだけで、確定後に再描画される
 *              Update the display size of the element according to the transformed matrix.
 *              During transformation the existing canvas is just stretched, and it is redrawn after it is confirmed.
 *
 * @param  {HTMLElement} node
 * @param  {Character} character
 * @param  {number} [frame=1]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    node: HTMLElement,
    character: Character,
    frame: number = 1
): void => {

    const rawBounds = character.getRawBounds(frame);
    if (!rawBounds) {
        return ;
    }

    // 親との合成行列から、各基底ベクトルの長さを倍率として求める
    // 親と自身のスケールの掛け算では、親が非等方かつ自身に回転がある場合に一致しない
    const matrix = Matrix.multiply($getConcatenatedMatrix(), character.matrix);

    const width = Math.ceil(Math.abs(
        (rawBounds.xMax - rawBounds.xMin) * Math.hypot(matrix[0], matrix[1])
    ));
    const height = Math.ceil(Math.abs(
        (rawBounds.yMax - rawBounds.yMin) * Math.hypot(matrix[2], matrix[3])
    ));

    const nodeStyle = node.style;
    nodeStyle.setProperty("--width",  `${width}px`);
    nodeStyle.setProperty("--height", `${height}px`);

    // canvasはインラインのサイズが優先されるため、合わせて更新する
    const canvas = node.querySelector("canvas");
    if (canvas) {
        canvas.style.width  = `${width}px`;
        canvas.style.height = `${height}px`;
    }
};

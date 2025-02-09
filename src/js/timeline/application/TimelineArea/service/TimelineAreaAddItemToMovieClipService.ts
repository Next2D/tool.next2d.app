import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { Matrix } from "@next2d/geom";

/**
 * @description タイムラインの洗濯中のレイヤーの指定座標にアイテムを配置
 *              Place an item at the specified coordinates of the layer selected in the timeline
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {string} path
 * @return {void}
 * @method
 * @public
 */
export const execute = async (x: number, y: number, path: string): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 先祖のmatrixを加算
    const concatenatedMatrix = $getConcatenatedMatrix();

    // 配置座標したGlobal座標をLocal座標に変換
    const matrix = new Matrix(
        concatenatedMatrix[0], concatenatedMatrix[1], concatenatedMatrix[2],
        concatenatedMatrix[3], concatenatedMatrix[4], concatenatedMatrix[5]
    );
    matrix.invert();

    const localX = x * matrix.a + y * matrix.c + matrix.tx;
    const localY = x * matrix.b + y * matrix.d + matrix.ty;

    // ドロップした座標に対してoffset値と拡大値を適用
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);
    await externalTimeline
        .addItemToMovieClip(localX, localY, path);
};
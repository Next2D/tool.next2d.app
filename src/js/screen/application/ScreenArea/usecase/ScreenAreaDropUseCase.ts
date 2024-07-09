import type { InstanceImpl } from "@/interface/InstanceImpl";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import {
    $FOLDER_TYPE,
    $SOUND_TYPE
} from "@/config/InstanceConfig";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import { ExternalSoundArea } from "@/external/controller/domain/model/ExternalSoundArea";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";

/**
 * @description スクリーンエリアのアイテムドロップイベント処理関数
 *              Item drop event processing function for screen area
 *
 * @param  {number} client_x
 * @param  {number} client_y
 * @return {void}
 * @method
 * @public
 */
export const execute = async (client_x: number, client_y: number): Promise<void> =>
{
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    for (let idx = 0; idx < libraryArea.selectedIds.length; ++idx) {

        const libraryId = libraryArea.selectedIds[idx];
        const instance: InstanceImpl<any> = workSpace.getLibrary(libraryId);
        if (!instance) {
            continue;
        }

        switch (instance.type) {

            case $SOUND_TYPE:
                {
                    const externalSoundArea = new ExternalSoundArea(workSpace, movieClip);
                    externalSoundArea.addSound(
                        movieClip.currentFrame,
                        instance.getPath(workSpace)
                    );
                }
                break;

            case $FOLDER_TYPE:
                break;

            default:
                {
                    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

                    // 設置するアイテムの実際の表示範囲を取得
                    const bounds = instance.getRawBounds();
                    if (!bounds) {
                        continue;
                    }

                    // 設置するアイテムの中心座標を計算
                    const centerX = Math.abs(bounds.xMax - bounds.xMin) / 2;
                    const centerY = Math.abs(bounds.yMax - bounds.yMin) / 2;

                    // 親のMovieClipと拡大・縮小を考慮した補正座標を計算
                    const offsetX = $getScreenOffsetLeft() + (bounds.xMin + centerX) * workSpace.scale;
                    const offsetY = $getScreenOffsetTop()  + (bounds.yMin + centerY) * workSpace.scale;

                    // 配置座標
                    const x = client_x - offsetX;
                    const y = client_y - offsetY;

                    // 先祖のmatrixを加算
                    const concatenatedMatrix = $getConcatenatedMatrix();

                    // 配置座標したGlobal座標をLocal座標に変換
                    const matrix = new next2d.geom.Matrix(
                        concatenatedMatrix[0], concatenatedMatrix[1], concatenatedMatrix[2],
                        concatenatedMatrix[3], concatenatedMatrix[4], concatenatedMatrix[5]
                    );
                    matrix.invert();

                    const localX = x * matrix.a + y * matrix.c + matrix.tx;
                    const localY = x * matrix.b + y * matrix.d + matrix.ty;

                    // ドロップした座標に対してoffset値と拡大値を適用
                    await externalTimeline
                        .addItemToMovieClip(localX, localY, instance.getPath(workSpace));
                }
                break;

        }
    }
};
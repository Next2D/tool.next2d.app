import type { Shape } from "@/core/domain/model/Shape";
import { $getCanvas } from "@/global/GlobalUtil";

/**
 * @description ShapeからCanvasを生成
 *              Create a Canvas from Shape
 *
 * @param  {Shape} shape
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (shape: Shape): Promise<HTMLCanvasElement> =>
{
    return new Promise(async (resolve) =>
    {
        // Plyerのキャッシュをリセット
        next2d.player.cacheStore.reset();

        const canvas = $getCanvas();

        const displayShape = new next2d.display.Shape();

        const graphics = displayShape.graphics;

        // 描画レコードをコピー
        graphics._$recode = shape.recodes.slice();

        // 描画開始用のフラグを更新
        graphics._$canDraw  = true;
        graphics._$maxAlpha = 1;

        // 描画範囲のバウンディングボックスを複製
        const bounds = shape.getRawBounds();
        graphics._$xMin = bounds.xMin;
        graphics._$yMin = bounds.yMin;
        graphics._$xMax = bounds.xMax;
        graphics._$yMax = bounds.yMax;

        const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
        const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));

        const scale = window.devicePixelRatio;
        const matrix = new next2d.geom.Matrix();
        matrix.scale(scale, scale);

        const bitmapData = new next2d.display.BitmapData(width * scale, height * scale);
        bitmapData.draw(displayShape, matrix, null, canvas, (canvas: HTMLCanvasElement): void =>
        {
            if (scale > 1) {
                canvas.style.width  = `${width}px`;
                canvas.style.height = `${height}px`;
            }
            resolve(canvas);
        });
    });
};
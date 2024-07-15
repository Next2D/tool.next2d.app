import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import type { Character } from "@/core/domain/model/Character";
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
export const execute = (
    shape: Shape,
    character: Character | null = null
): Promise<HTMLCanvasElement> => {

    return new Promise(async (resolve) =>
    {
        // Plyerのキャッシュをリセット
        next2d.player.cacheStore.reset();

        const displayShape = new next2d.display.Shape();
        if (character && character.filters.length) {
            // todo filter
        }

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

        displayShape.x = -bounds.xMin - Math.abs(bounds.xMax - bounds.xMin) / 2;
        displayShape.y = -bounds.yMin - Math.abs(bounds.yMax - bounds.yMin) / 2;

        const sprite = new next2d.display.Sprite();
        sprite.addChild(displayShape);

        const container = new next2d.display.Sprite();
        container.addChild(sprite);

        const concatMatrix = $getConcatenatedMatrix();
        sprite.transform.matrix = new next2d.geom.Matrix(
            concatMatrix[0], concatMatrix[1],
            concatMatrix[2], concatMatrix[3],
            0, 0
        );

        const matrix = new next2d.geom.Matrix();
        matrix.translate(
            container.width / 2,
            container.height / 2
        );
        const scale = window.devicePixelRatio;
        matrix.scale(scale, scale);

        const bitmapData = new next2d.display.BitmapData(container.width * scale, container.height * scale);
        bitmapData.draw(container, matrix, null, $getCanvas(), (canvas: HTMLCanvasElement): void =>
        {
            canvas.style.width  = `${container.width}px`;
            canvas.style.height = `${container.height}px`;
            resolve(canvas);
        });
    });
};
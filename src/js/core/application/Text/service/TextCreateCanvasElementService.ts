import type { Character } from "@/core/domain/model/Character";
import type { Text } from "@/core/domain/model/Text";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";

/**
 * @description TextからCanvasを生成
 *              Create a Canvas from Text
 *
 * @param  {Text} text
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (
    text: Text,
    character: Character | null = null
): Promise<HTMLCanvasElement> => {

    return new Promise(async (resolve) =>
    {
        const canvas = $getCanvas();
        if (text.text === "") {
            const bounds = text.getRawBounds();
            canvas.style.width  = `${bounds.xMax - 2}px`;
            canvas.style.height = `${bounds.yMax - 2}px`;
            return resolve(canvas);
        }

        const displayText = new next2d.display.TextField();
        if (character && character.filters.length) {
            // todo filter
        }

        const bounds = text.getRawBounds();
        displayText.x = bounds.xMax / 2;
        displayText.y = bounds.yMax / 2;

        const sprite = new next2d.display.Sprite();
        sprite.addChild(displayText);

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

        // Plyerのキャッシュをリセット
        next2d.player.cacheStore.reset();

        const bitmapData = new next2d.display.BitmapData(container.width * scale, container.height * scale);
        bitmapData.draw(container, matrix, null, canvas, (canvas: HTMLCanvasElement): void =>
        {
            canvas.style.width  = `${container.width - 2}px`;
            canvas.style.height = `${container.height - 2}px`;
            resolve(canvas);
        });
    });
};
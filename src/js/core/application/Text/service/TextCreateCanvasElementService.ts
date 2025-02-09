import type { Character } from "@/core/domain/model/Character";
import type { Text } from "@/core/domain/model/Text";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { TextField } from "@next2d/text";
import { Sprite } from "@next2d/display";
import { Matrix } from "@next2d/geom";

/**
 * @description TextからCanvasを生成
 *              Create a Canvas from Text
 *
 * @param  {Text} text
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    text: Text,
    character: Character | null = null
): Promise<HTMLCanvasElement> => {

    const canvas = $getCanvas();
    if (text.text === "") {
        const bounds = text.getRawBounds();
        canvas.style.width  = `${bounds.xMax - 2}px`;
        canvas.style.height = `${bounds.yMax - 2}px`;
        return canvas;
    }

    const textField = new TextField();
    if (character && character.filters.length) {
        // todo filter
    }

    const bounds = text.getRawBounds();
    textField.x = bounds.xMax / 2;
    textField.y = bounds.yMax / 2;

    const container = new Sprite();
    container.addChild(textField);

    const concatMatrix = $getConcatenatedMatrix();
    container.matrix = new Matrix(
        concatMatrix[0], concatMatrix[1],
        concatMatrix[2], concatMatrix[3],
        0, 0
    );

    const matrix = new Matrix();
    matrix.translate(
        container.width / 2,
        container.height / 2
    );
    const scale = window.devicePixelRatio;
    matrix.scale(scale, scale);

    const transferredCanvas = await next2d.captureToCanvas(container, {
        "matrix": matrix,
        "canvas": canvas
    });

    transferredCanvas.style.width  = `${container.width - 2}px`;
    transferredCanvas.style.height = `${container.height - 2}px`;

    return transferredCanvas;
};
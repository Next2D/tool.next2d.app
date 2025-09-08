import type { Character } from "@/core/domain/model/Character";
import type { Shape } from "@/core/domain/model/Shape";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { Matrix } from "@next2d/geom";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import {
    Shape as DisplayShape,
    Sprite
} from "@next2d/display";

/**
 * @description ShapeからCanvasを生成
 *              Create a Canvas from Shape
 *
 * @param  {Shape} shape
 * @param  {Character} character
 * @return {Promise<HTMLCanvasElement>}
 * @method
 * @public
 */
export const execute = async (
    shape: Shape,
    character: Character | null = null
): Promise<HTMLCanvasElement> => {

    const displayShape = new DisplayShape();
    if (character && character.filters.length) {
        // todo filter
    }

    const graphics = displayShape.graphics;

    // 描画レコードをコピー
    graphics.buffer = new Float32Array(shape.recodes.slice());

    // 描画範囲のバウンディングボックスを複製
    const bounds  = shape.getRawBounds();
    graphics.xMin = bounds.xMin;
    graphics.yMin = bounds.yMin;
    graphics.xMax = bounds.xMax;
    graphics.yMax = bounds.yMax;

    const width  = Math.abs(bounds.xMax - bounds.xMin);
    const height = Math.abs(bounds.yMax - bounds.yMin);
    const canvas = $getCanvas();
    if (!width || !height) {
        return canvas;
    }

    const container = new Sprite();
    container.addChild(displayShape);

    const concatMatrix = $getConcatenatedMatrix();

    const scale = window.devicePixelRatio;
    const parentMatrix = Matrix.multiply(
        new Float32Array([scale, 0, 0, scale, 0, 0]),
        new Float32Array([
            characterCalcGetScaleXService(concatMatrix), 0,
            0, characterCalcGetScaleYService(concatMatrix),
            concatMatrix[4], concatMatrix[5]
        ])
    );

    const matrix = new Matrix();
    const tMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    if (character) {
        const multiMatrix = Matrix.multiply(
            parentMatrix, new Float32Array([
                character.scaleX, 0, 0, character.scaleY, character.x, character.y
            ])
        );

        const rawMatrix = Matrix.multiply(
            concatMatrix, character.matrix
        );

        matrix.a = rawMatrix[0];
        matrix.b = rawMatrix[1];
        matrix.c = rawMatrix[2];
        matrix.d = rawMatrix[3];

        tMatrix.set([
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3]
        ], 0);

    } else {
        tMatrix.set([scale, 0, 0, scale], 0);

        matrix.a = scale;
        matrix.b = 0;
        matrix.c = 0;
        matrix.d = scale;
    }

    const transferredCanvas = await next2d.captureToCanvas(container, {
        "matrix": new Matrix(tMatrix[0], tMatrix[1], tMatrix[2], tMatrix[3]),
        "canvas": canvas
    });

    // 実際のサイズを設定
    container.matrix = matrix;
    transferredCanvas.style.width  = `${container.width}px`;
    transferredCanvas.style.height = `${container.height}px`;

    return transferredCanvas;
};
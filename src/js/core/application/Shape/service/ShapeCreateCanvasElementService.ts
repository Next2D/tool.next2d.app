import type { Character } from "@/core/domain/model/Character";
import type { Shape } from "@/core/domain/model/Shape";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCanvas } from "@/global/GlobalUtil";
import { Matrix } from "@next2d/geom";
import {
    Shape as DisplayShape,
    Sprite
} from "@next2d/display";
import { $multiplyMatrix } from "../../CoreUtil";

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
    if (character) {
        const multiMatrix = $multiplyMatrix(
            concatMatrix, character.matrix
        );
        container.matrix = new Matrix(
            multiMatrix[0], multiMatrix[1],
            multiMatrix[2], multiMatrix[3],
            0, 0
        );
    } else {
        container.matrix = new Matrix(
            concatMatrix[0], concatMatrix[1],
            concatMatrix[2], concatMatrix[3],
            0, 0
        );
    }

    const scale = window.devicePixelRatio;

    const transferredCanvas = await next2d.captureToCanvas(container, {
        "matrix": new Matrix(scale, 0, 0, scale),
        "canvas": canvas
    });
    transferredCanvas.style.width  = `${container.width}px`;
    transferredCanvas.style.height = `${container.height}px`;

    return transferredCanvas;
};
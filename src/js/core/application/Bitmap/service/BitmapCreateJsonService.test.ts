import { execute } from "./BitmapCreateJsonService";
import { describe, expect, it } from "vitest";
import { Bitmap } from "../../../../core/domain/model/Bitmap";
import { Shape } from "@next2d/display";

describe("BitmapCreateJsonService Test", () =>
{
    it("test case", () =>
    {
        const bitmap = new Bitmap({
            "buffer": new Uint8Array([0, 0, 0, 0]),
            "width": 1,
            "height": 1,
            "symbol": "test"
        });

        const object = execute(bitmap);

        expect(object.extends).toBe(Shape.namespace);
        expect(object.symbol).toBe(bitmap.symbol);
        expect(object.buffer.length).toBe(4);
        expect(object.bounds.xMin).toBe(0);
        expect(object.bounds.yMin).toBe(0);
        expect(object.bounds.xMax).toBe(1);
        expect(object.bounds.yMax).toBe(1);
    });
});
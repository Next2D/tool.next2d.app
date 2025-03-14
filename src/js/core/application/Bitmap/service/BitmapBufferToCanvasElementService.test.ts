import { execute } from "./BitmapBufferToCanvasElementService";
import { describe, expect, it } from "vitest";

describe("BitmapBufferToCanvasElementService Test", () =>
{
    it("test case", () =>
    {
        const canvas = execute(new Uint8Array([1,1,1,1]), 1, 1);

        expect(canvas.width).toBe(1);
        expect(canvas.height).toBe(1);
    });
});
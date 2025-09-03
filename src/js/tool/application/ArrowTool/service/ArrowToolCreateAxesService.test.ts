import { execute } from "./ArrowToolCreateAxesService";
import { describe, expect, it } from "vitest";

describe("ArrowToolCreateAxesService Test", () =>
{
    it("execute test", () =>
    {
        const rect = [
            { "x": 100, "y": 200 },
            { "x": 300, "y": 400 },
            { "x": 500, "y": 600 },
            { "x": 700, "y": 800 }
        ];

        const axes = execute(rect);
        expect(axes.length).toBe(6);
        expect(axes[0][0]).toBe(1);
        expect(axes[0][1]).toBe(0);
        expect(axes[1][0]).toBe(0);
        expect(axes[1][1]).toBe(1);
        expect(axes[2][0]).toBe(-0.7071067811865475);
        expect(axes[2][1]).toBe(0.7071067811865475);
        expect(axes[3][0]).toBe(-0.7071067811865475);
        expect(axes[3][1]).toBe(0.7071067811865475);
        expect(axes[4][0]).toBe(-0.7071067811865475);
        expect(axes[4][1]).toBe(0.7071067811865475);
        expect(axes[5][0]).toBe(0.7071067811865475);
        expect(axes[5][1]).toBe(-0.7071067811865475);
    });
});
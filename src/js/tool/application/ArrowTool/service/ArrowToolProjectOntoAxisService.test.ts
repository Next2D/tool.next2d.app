import { execute } from "./ArrowToolProjectOntoAxisService";
import { describe, expect, it } from "vitest";

describe("ArrowToolProjectOntoAxisService Test", () =>
{
    it("execute test", () =>
    {
        const rect = [
            { "x": 0, "y": 20 },
            { "x": 120, "y": 20 },
            { "x": 120, "y": 120 },
            { "x": 0, "y": 120 }
        ];

        const axes = execute(rect, 10, 10);
        expect(axes.length).toBe(2);
        expect(axes[0]).toBe(200);
        expect(axes[1]).toBe(2400);
    });
});
import { execute } from "./InstanceUpdateBlendModeService";
import { describe, expect, it } from "vitest";

describe("InstanceUpdateBlendModeService Test", () =>
{
    it("test case", async () =>
    {
        const canvas = document.createElement("canvas");
        
        execute(canvas, "normal");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("");

        execute(canvas, "add");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("color-dodge");

        execute(canvas, "subtract");
        expect(canvas.style.filter).toBe("invert(100%)");
        expect(canvas.style.mixBlendMode).toBe("multiply");

        execute(canvas, "invert");
        expect(canvas.style.filter).toBe("invert(100%)");
        expect(canvas.style.mixBlendMode).toBe("difference");

        execute(canvas, "hardlight");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("hard-light");

        execute(canvas, "copy");
        expect(canvas.style.filter).toBe("");
        // "copy"はCSS mix-blend-modeでサポートされていないが、設定はされる
        expect(canvas.style.mixBlendMode).toBe("hard-light"); // ブラウザが無効な値を無視して前の値を保持

        execute(canvas, "darken");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("darken");

        execute(canvas, "difference");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("difference");

        execute(canvas, "lighten");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("lighten");

        execute(canvas, "overlay");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("overlay");    
        
        execute(canvas, "screen");
        expect(canvas.style.filter).toBe("");
        expect(canvas.style.mixBlendMode).toBe("screen");   
    });
});
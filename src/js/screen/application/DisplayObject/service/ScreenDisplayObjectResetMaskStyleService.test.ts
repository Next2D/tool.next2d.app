import { execute } from "./ScreenDisplayObjectResetMaskStyleService";
import { describe, expect, it } from "vitest";

describe("ScreenDisplayObjectResetMaskStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        div.style.mask = div.style.webkitMask = "unset";
        div.style.maskSize = div.style.webkitMaskSize = "cover";
        div.style.maskRepeat = div.style.webkitMaskRepeat = "no-repeat";
        div.style.maskPosition = div.style.webkitMaskPosition = "top";

        expect(div.style.mask).toBe("unset");
        expect(div.style.webkitMask).toBe("unset");
        expect(div.style.maskSize).toBe("cover");
        expect(div.style.webkitMaskSize).toBe("cover");
        expect(div.style.maskRepeat).toBe("no-repeat");
        expect(div.style.webkitMaskRepeat).toBe("no-repeat");
        expect(div.style.maskPosition).toBe("top");
        expect(div.style.webkitMaskPosition).toBe("top");

        execute(div);

        expect(div.style.mask).toBe("");
        expect(div.style.webkitMask).toBe("");
        expect(div.style.maskSize).toBe("");
        expect(div.style.webkitMaskSize).toBe("");
        expect(div.style.maskRepeat).toBe("");
        expect(div.style.webkitMaskRepeat).toBe("");
        expect(div.style.maskPosition).toBe("");
        expect(div.style.webkitMaskPosition).toBe("");
    });
});
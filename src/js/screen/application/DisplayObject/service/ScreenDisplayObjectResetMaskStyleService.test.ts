import { execute } from "./ScreenDisplayObjectResetMaskStyleService";

describe("ScreenDisplayObjectResetMaskStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        div.style.mask = div.style.webkitMask = "mask";
        div.style.maskSize = div.style.webkitMaskSize = "size";
        div.style.maskRepeat = div.style.webkitMaskRepeat = "repeat";
        div.style.maskPosition = div.style.webkitMaskPosition = "position";

        expect(div.style.mask).toBe("mask");
        expect(div.style.webkitMask).toBe("mask");
        expect(div.style.maskSize).toBe("size");
        expect(div.style.webkitMaskSize).toBe("size");
        expect(div.style.maskRepeat).toBe("repeat");
        expect(div.style.webkitMaskRepeat).toBe("repeat");
        expect(div.style.maskPosition).toBe("position");
        expect(div.style.webkitMaskPosition).toBe("position");

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
import {
    $setCursor,
    $clamp,
    $getScreenOffsetLeft,
    $getScreenOffsetTop,
    $setScreenOffsetLeft,
    $setScreenOffsetTop
} from "./GlobalUtil";
import { describe, expect, it } from "vitest";

describe("GlobalUtilTest", () =>
{
    it("$setCursor test", () =>
    {
        $setCursor("sample");
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("sample");

        $setCursor();
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("auto");
    });

    it("$clamp test", () =>
    {
        expect($clamp(3, 0, 10)).toBe(3);
        expect($clamp(-1, 0, 10)).toBe(0);
        expect($clamp(20, 0, 10)).toBe(10);
    });

    it("offsetLeft and offsetTop test", () =>
    {
        expect($getScreenOffsetLeft()).toBe(0);
        expect($getScreenOffsetTop()).toBe(0);

        $setScreenOffsetLeft(999);
        expect($getScreenOffsetLeft()).toBe(999);

        $setScreenOffsetTop(222);
        expect($getScreenOffsetTop()).toBe(222);
    });
});
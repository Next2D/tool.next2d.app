import {
    $setCursor,
    $clamp,
    $setZoom,
    $getZoom,
    $getScreenOffsetLeft,
    $getScreenOffsetTop,
    $setScreenOffsetLeft,
    $setScreenOffsetTop
} from "./Global";

describe("GlobalTest", () =>
{
    test("$setCursor test", () =>
    {
        $setCursor("sample");
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("sample");

        $setCursor();
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("auto");
    });

    test("$clamp test", () =>
    {
        expect($clamp(3, 0, 10)).toBe(3);
        expect($clamp(-1, 0, 10)).toBe(0);
        expect($clamp(20, 0, 10)).toBe(10);
    });

    test("$getZoom and $setZoom test", () =>
    {
        expect($getZoom()).toBe(1);
        $setZoom(2);
        expect($getZoom()).toBe(2);
        $setZoom(1);
        expect($getZoom()).toBe(1);
    });

    test("offsetLeft and offsetTop test", () =>
    {
        expect($getScreenOffsetLeft()).toBe(0);
        expect($getScreenOffsetTop()).toBe(0);

        $setScreenOffsetLeft(999);
        expect($getScreenOffsetLeft()).toBe(999);

        $setScreenOffsetTop(222);
        expect($getScreenOffsetTop()).toBe(222);
    });
});
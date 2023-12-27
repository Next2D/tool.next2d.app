import {
    $getMouseState,
    $setMouseState,
    $getAllLightMode,
    $setAllLightMode,
    $getAllDisableMode,
    $setAllDisableMode
} from "./TimelineUtil";

describe("TimelineUtilTest", () =>
{
    test("$getMouseState and $setMouseState test", () =>
    {
        expect($getMouseState()).toBe("up");
        $setMouseState("down");
        expect($getMouseState()).toBe("down");
        $setMouseState("up");
        expect($getMouseState()).toBe("up");
    });

    test("$getAllLightMode and $setAllLightMode test", () =>
    {
        expect($getAllLightMode()).toBe(false);
        $setAllLightMode(true);
        expect($getAllLightMode()).toBe(true);
        $setAllLightMode(false);
        expect($getAllLightMode()).toBe(false);
    });

    test("$getAllDisableMode and $setAllDisableMode test", () =>
    {
        expect($getAllDisableMode()).toBe(false);
        $setAllDisableMode(true);
        expect($getAllDisableMode()).toBe(true);
        $setAllDisableMode(false);
        expect($getAllDisableMode()).toBe(false);
    });
});
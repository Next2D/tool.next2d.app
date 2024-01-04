import {
    $getMouseState,
    $setMouseState,
    $getAllLightMode,
    $setAllLightMode,
    $getAllDisableMode,
    $setAllDisableMode,
    $getAllLockMode,
    $setAllLockMode,
    $getMaxFrame,
    $getLeftFrame,
    $getRightFrame,
    $getScrollLimitX,
    $getScrollLimitY
} from "./TimelineUtil";
import {
    $createWorkSpace,
    $getCurrentWorkSpace
} from "../../core/application/CoreUtil";
import { timelineHeader } from "../../timeline/domain/model/TimelineHeader";

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

    test("$getAllLockMode and $setAllLockMode test", () =>
    {
        expect($getAllLockMode()).toBe(false);
        $setAllLockMode(true);
        expect($getAllLockMode()).toBe(true);
        $setAllLockMode(false);
        expect($getAllLockMode()).toBe(false);
    });

    test("$getMaxFrame test", () =>
    {
        $createWorkSpace();
        expect($getMaxFrame()).toBe(600);
    });

    test("$getLeftFrame and $getRightFrame test", () =>
    {
        timelineHeader.clientWidth = 600;
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        expect($getLeftFrame()).toBe(1);
        expect($getRightFrame()).toBe(44);

        workSpace.scene.scrollX = 1400;
        expect(workSpace.scene.scrollX).toBe(1400);
        expect($getLeftFrame()).toBe(101);
        expect($getRightFrame()).toBe(144);
    });

    test("$getScrollLimitX test", () =>
    {
        timelineHeader.clientWidth = 0;
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        expect($getScrollLimitX()).toBe(8400);
    });

    test("$getScrollLimitY test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        expect($getScrollLimitY()).toBe(31);
    });
});
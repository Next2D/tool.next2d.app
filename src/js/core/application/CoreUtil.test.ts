import {
    $createWorkSpace,
    $getAllWorkSpace,
    $getWorkSpace,
    $getCurrentWorkSpace
} from "./CoreUtil";

describe("CoreUtilTest", () =>
{
    test("test", () =>
    {
        expect($getAllWorkSpace().length).toBe(0);
        const workSpcae = $createWorkSpace();
        expect($getAllWorkSpace().length).toBe(1);
        expect($getWorkSpace(workSpcae.id)).toBe(workSpcae);
        expect($getCurrentWorkSpace()).toBe(workSpcae);
    });
});
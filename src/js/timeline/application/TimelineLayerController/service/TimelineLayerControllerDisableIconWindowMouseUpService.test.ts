import { execute } from "./TimelineLayerControllerDisableIconWindowMouseUpService";
import { $getDisableState, $setDisableState } from "../../TimelineUtil";

describe("TimelineLayerControllerDisableIconWindowMouseUpServiceTest", () =>
{
    test("execute test", () =>
    {
        $setDisableState(true);
        expect($getDisableState()).toBe(true);
        execute();
        expect($getDisableState()).toBe(false);
    });
});
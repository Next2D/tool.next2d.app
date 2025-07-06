import { execute } from "./StageToObjectService";
import { Stage } from "../../../../core/domain/model/Stage";
import { describe, expect, it } from "vitest";
import {
    $STAGE_DEFAULT_FPS,
    $STAGE_DEFAULT_HEIGHT,
    $STAGE_DEFAULT_WIDTH,
    $STAGE_DEFAULT_COLOR
} from "../../../../config/StageSettingConfig";

describe("StageToObjectServiceTest", () =>
{
    it("execute test", () =>
    {
        const stage = new Stage();

        expect(stage.width).toBe($STAGE_DEFAULT_WIDTH);
        expect(stage.height).toBe($STAGE_DEFAULT_HEIGHT);
        expect(stage.fps).toBe($STAGE_DEFAULT_FPS);
        expect(stage.bgColor).toBe($STAGE_DEFAULT_COLOR);

        const object =  execute(stage);

        expect(object.width).toBe($STAGE_DEFAULT_WIDTH);
        expect(object.height).toBe($STAGE_DEFAULT_HEIGHT);
        expect(object.fps).toBe($STAGE_DEFAULT_FPS);
        expect(object.bgColor).toBe($STAGE_DEFAULT_COLOR);
    });
});
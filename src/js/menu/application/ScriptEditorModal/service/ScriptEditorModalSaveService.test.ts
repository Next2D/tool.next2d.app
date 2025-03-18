import { execute } from "./ScriptEditorModalSaveService";
import { describe, expect, it } from "vitest";
import { $updateKeyLock, $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $MOVIE_CLIP_TYPE } from "../../../../config/InstanceConfig";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import {
    $setTargetMovieClip,
    $setTargetFrame,
    $getTargetFrame,
    $getTargetMovieClip
} from "../ScriptEditorModalUtil";

describe("ScriptEditorModalSaveService Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const movieClip = new MovieClip({
            "id": 2,
            "type": $MOVIE_CLIP_TYPE,
            "name": "MovieClip_2"
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        const frame = 2;
        $updateKeyLock(true);
        expect($useKeyboard()).toBe(true);
        expect(movieClip.hasAction(frame)).toBe(false);

        $setTargetFrame(frame);
        $setTargetMovieClip(movieClip);
        expect($getTargetFrame()).toBe(frame);
        expect($getTargetMovieClip()).toBe(movieClip);

        await execute();
        
        expect($useKeyboard()).toBe(false);
        expect(movieClip.hasAction(frame)).toBe(true);
    });
});
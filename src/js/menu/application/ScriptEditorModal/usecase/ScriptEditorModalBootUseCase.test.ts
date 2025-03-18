import { execute } from "./ScriptEditorModalBootUseCase";
import { describe, expect, it } from "vitest";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import { $MOVIE_CLIP_TYPE } from "../../../../config/InstanceConfig";
import { $setTargetFrame, $setTargetMovieClip } from "../ScriptEditorModalUtil";
import { $updateKeyLock, $useKeyboard } from "../../../../shortcut/ShortcutUtil";

describe("ScriptEditorModalBootUseCase Test", () =>
{
    it("execute test", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const movieClip = new MovieClip({
            "id": 2,
            "type": $MOVIE_CLIP_TYPE,
            "name": "MovieClip_2"
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        $setTargetFrame(1);
        $updateKeyLock(false);
        $setTargetMovieClip(movieClip);

        expect($useKeyboard()).toBe(false);
        execute();
        expect($useKeyboard()).toBe(true);

        workSpace.libraries.delete(movieClip.id);
    });
});
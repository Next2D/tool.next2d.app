import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { ISoundObject } from "../../../../interface/ISoundObject";
import { execute } from "./SoundAreaTrashPointerDownUseCase";
import { Sound } from "../../../../core/domain/model/Sound";
import { $SOUND_AREA_SELECT_ID } from "../../../../config/SoundSettingConfig";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaTrashPointerDownUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const sound = new Sound({
            "id": 2,
            "name": "Sound",
            "path": "path",
            "type": "sound",
            "volume": 1,
            "loop": false
        });

        workSpace.libraries.set(sound.id, sound);
        workSpace.pathMap.set(sound.getPath(workSpace), sound.id);

        const div = document.createElement("div");
        div.dataset.index = "0";

        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "button": 0,
            "currentTarget": div
        } as unknown as PointerEvent;

        const soundObject: ISoundObject = {
            "libraryId": 1,
            "volume": 0.5,
            "autoPlay": false,
            "loopCount": 2
        };
        const movieClip = workSpace.scene as MovieClip;
        movieClip.setSound(movieClip.currentFrame, soundObject);

        expect(movieClip.hasSound(movieClip.currentFrame)).toBe(true);
        expect(stopPropagation).toBe(false);

        await execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(movieClip.hasSound(movieClip.currentFrame)).toBe(false);

        workSpace.libraries.delete(sound.id);
        workSpace.pathMap.delete(sound.getPath(workSpace));
    });
});
import { execute } from "./MovieClipCalcBoundService";
import { describe, expect, it } from "vitest";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { $MOVIE_CLIP_TYPE, $BITMAP_TYPE } from "../../../../config/InstanceConfig";
import { Character } from "../../../domain/model/Character";
import { Bitmap } from "../../../domain/model/Bitmap";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("MovieClipCalcBoundService Test", () =>
{
    it("test case", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = new MovieClip({
            "id": 1,
            "type": $MOVIE_CLIP_TYPE
        });

        const bitmap = new Bitmap({
            "id": 2,
            "type": $BITMAP_TYPE,
            "width": 100,
            "height": 100
        })
        workSpace.libraries.set(1, movieClip);
        workSpace.libraries.set(2, bitmap);

        const layer = movieClip.layers[0];

        const character = new Character();
        character.libraryId = 2;
        character.x = 20;
        character.y = 120;
        character.startFrame = 1;
        character.endFrame = 2;
        
        layer.addCharacter(character);

        expect(movieClip.layers.length).toBe(1);

        const bounds = execute(movieClip, 1);
        expect(bounds.xMin).toBe(20);
        expect(bounds.yMin).toBe(120);
        expect(bounds.xMax).toBe(120);
        expect(bounds.yMax).toBe(220);

        workSpace.libraries.delete(1);
        workSpace.libraries.delete(2);
    });
});
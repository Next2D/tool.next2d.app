import { execute } from "./MovieClipDisplayObjectComponent";
import { describe, expect, it } from "vitest";
import { Character } from "../../../../core/domain/model/Character";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { MovieClip } from "../../../../core/domain/model/MovieClip";


describe("MovieClipDisplayObjectComponent Test", () =>
{
    it("test case", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_1"
        });
        workSpace.libraries.set(movieClip.id, movieClip);

        const character = new Character();
        character.libraryId = movieClip.id;
        expect(execute(character, 1, 1))
            .toBe(`<div class="display-object layer-id-1 character-id-${character.id}" data-depth="0" data-layer-id="1" style="left: 0px; top: 0px; width: 0px; height: 0px; --transform: matrix(1, 0, 0, 1, 0, 0); --width: 0px; --height: 0px;"><div class="canvas-container container-layer-id-1"></div></div>`);
    });
});
import { describe, it, expect } from "vitest";
import { execute } from "./CacheRemoveService";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { Layer } from "@/core/domain/model/Layer";
import { Character } from "@/core/domain/model/Character";
import { $getCacheCanvas, $setCacheCanvas } from "../CacheUtil";

describe("CacheRemoveService", () => {

    it("should return early if library not found", () => {
        const workSpace = new WorkSpace();
        const initialSize = workSpace.libraries.size;
        const nonExistentLibraryId = 999;

        execute(workSpace, nonExistentLibraryId);

        expect(workSpace.libraries.size).toBe(initialSize);
    });

    it("should remove cache for specified library ID", () => {
        const workSpace = new WorkSpace();
        const movieClip = new MovieClip({
            id: 1,
            type: "container",
            name: "MovieClip_1"
        });

        workSpace.libraries.set(1, movieClip);

        if (typeof document !== "undefined" && document.createElement) {
            const canvas = document.createElement("canvas");
            $setCacheCanvas(workSpace.id, 1, "test-key", canvas);
            
            const cachedCanvas = $getCacheCanvas(workSpace.id, 1, "test-key");
            expect(cachedCanvas).not.toBeNull();

            execute(workSpace, 1);

            const removedCanvas = $getCacheCanvas(workSpace.id, 1, "test-key");
            expect(removedCanvas).toBeNull();
        }
    });

    it("should recursively remove cache for parent MovieClips", () => {
        const workSpace = new WorkSpace();
        const parentMovieClip = new MovieClip({
            id: 1,
            type: "container",
            name: "Parent"
        });
        
        const childMovieClip = new MovieClip({
            id: 2,
            type: "container",
            name: "Child"
        });

        const layer = new Layer();
        const character = new Character();
        character.libraryId = 2;
        character.parentMovieClipId = 1;
        layer.characters.push(character);
        
        parentMovieClip.layers = [layer];

        workSpace.libraries.set(1, parentMovieClip);
        workSpace.libraries.set(2, childMovieClip);

        if (typeof document !== "undefined" && document.createElement) {
            const canvas1 = document.createElement("canvas");
            const canvas2 = document.createElement("canvas");
            $setCacheCanvas(workSpace.id, 1, "test-key-1", canvas1);
            $setCacheCanvas(workSpace.id, 2, "test-key-2", canvas2);

            execute(workSpace, 2);

            expect($getCacheCanvas(workSpace.id, 1, "test-key-1")).toBeNull();
            expect($getCacheCanvas(workSpace.id, 2, "test-key-2")).toBeNull();
        }
    });

    it("should skip non-MovieClip instances", () => {
        const workSpace = new WorkSpace();
        const bitmap = {
            id: 1,
            type: "bitmap",
            name: "test"
        } as any;

        workSpace.libraries.set(1, bitmap);
        const sizeAfterAdd = workSpace.libraries.size;

        execute(workSpace, 1);

        expect(workSpace.libraries.size).toBe(sizeAfterAdd);
    });

    it("should skip characters with parentMovieClipId of -1", () => {
        const workSpace = new WorkSpace();
        const movieClip = new MovieClip({
            id: 1,
            type: "container",
            name: "MovieClip"
        });

        const targetMovieClip = new MovieClip({
            id: 2,
            type: "container",
            name: "Target"
        });

        const layer = new Layer();
        const character = new Character();
        character.libraryId = 2;
        character.parentMovieClipId = -1;
        layer.characters.push(character);

        movieClip.layers = [layer];

        workSpace.libraries.set(1, movieClip);
        workSpace.libraries.set(2, targetMovieClip);

        if (typeof document !== "undefined" && document.createElement) {
            const canvas2 = document.createElement("canvas");
            $setCacheCanvas(workSpace.id, 2, "test-key-2", canvas2);

            execute(workSpace, 2);

            expect($getCacheCanvas(workSpace.id, 2, "test-key-2")).toBeNull();
        }
    });

    it("should handle empty layers array", () => {
        const workSpace = new WorkSpace();
        const movieClip = new MovieClip({
            id: 1,
            type: "container",
            name: "MovieClip"
        });
        movieClip.layers = [];

        workSpace.libraries.set(1, movieClip);
        const sizeAfterAdd = workSpace.libraries.size;

        execute(workSpace, 1);

        expect(workSpace.libraries.size).toBe(sizeAfterAdd);
    });

    it("should only process characters matching the target library ID", () => {
        const workSpace = new WorkSpace();
        const parentMovieClip = new MovieClip({
            id: 1,
            type: "container",
            name: "Parent"
        });

        const targetMovieClip = new MovieClip({
            id: 2,
            type: "container",
            name: "Target"
        });

        const otherMovieClip = new MovieClip({
            id: 3,
            type: "container",
            name: "Other"
        });

        const layer = new Layer();
        const character1 = new Character();
        character1.libraryId = 3;
        character1.parentMovieClipId = 1;
        
        const character2 = new Character();
        character2.libraryId = 2;
        character2.parentMovieClipId = 1;
        
        layer.characters.push(character1, character2);

        parentMovieClip.layers = [layer];

        workSpace.libraries.set(1, parentMovieClip);
        workSpace.libraries.set(2, targetMovieClip);
        workSpace.libraries.set(3, otherMovieClip);

        if (typeof document !== "undefined" && document.createElement) {
            const canvas1 = document.createElement("canvas");
            const canvas2 = document.createElement("canvas");
            $setCacheCanvas(workSpace.id, 1, "test-key-1", canvas1);
            $setCacheCanvas(workSpace.id, 2, "test-key-2", canvas2);

            execute(workSpace, 2);

            expect($getCacheCanvas(workSpace.id, 1, "test-key-1")).toBeNull();
            expect($getCacheCanvas(workSpace.id, 2, "test-key-2")).toBeNull();
        }
    });

    it("should handle multiple layers with characters", () => {
        const workSpace = new WorkSpace();
        const parentMovieClip = new MovieClip({
            id: 1,
            type: "container",
            name: "Parent"
        });

        const childMovieClip = new MovieClip({
            id: 2,
            type: "container",
            name: "Child"
        });

        const layer1 = new Layer();
        const character1 = new Character();
        character1.libraryId = 2;
        character1.parentMovieClipId = 1;
        layer1.characters.push(character1);

        const layer2 = new Layer();
        const character2 = new Character();
        character2.libraryId = 2;
        character2.parentMovieClipId = 1;
        layer2.characters.push(character2);

        parentMovieClip.layers = [layer1, layer2];

        workSpace.libraries.set(1, parentMovieClip);
        workSpace.libraries.set(2, childMovieClip);

        if (typeof document !== "undefined" && document.createElement) {
            const canvas1 = document.createElement("canvas");
            const canvas2 = document.createElement("canvas");
            $setCacheCanvas(workSpace.id, 1, "test-key-1", canvas1);
            $setCacheCanvas(workSpace.id, 2, "test-key-2", canvas2);

            execute(workSpace, 2);

            expect($getCacheCanvas(workSpace.id, 1, "test-key-1")).toBeNull();
            expect($getCacheCanvas(workSpace.id, 2, "test-key-2")).toBeNull();
        }
    });
});

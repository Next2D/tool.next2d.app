import { execute } from "./LibraryMenuInitializeRegisterEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { EventType } from "../../../../tool/domain/event/EventType";
import {
    $LIBRARY_LIST_BOX_ID,
    $LIBRARY_FOLDER_ADD_ID,
    $LIBRARY_FILE_ID,
    $LIBRARY_FILE_INPUT_ID,
    $LIBRARY_MOVIE_CLIP_ADD_ID,
    $LIBRARY_CHANGE_SCENE_ID,
    $LIBRARY_DELETE_ID,
    $LIBRARY_PHOTOPEA_ID
} from "../../../../config/LibraryConfig";

describe("LibraryMenuInitializeRegisterEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_LIST_BOX_ID;

        let contextmenu   = false;
        let pointerDown   = false;
        let pointerUp     = false;
        let pointerCancel = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "contextmenu":
                    contextmenu = true;
                    return;

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                case EventType.POINTER_UP:
                    pointerUp = true;
                    return;

                case EventType.POINTER_CANCEL:
                    pointerCancel = true;
                    return;

                default:
                    throw new Error("Invalid event type");
            }
        });

        expect(contextmenu).toBe(false);
        expect(pointerDown).toBe(false);
        expect(pointerUp).toBe(false);
        expect(pointerCancel).toBe(false);

        execute();

        expect(contextmenu).toBe(true);
        expect(pointerDown).toBe(true);
        expect(pointerUp).toBe(true);
        expect(pointerCancel).toBe(true);

        element.remove();
    });

    it("execute test case2", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_FOLDER_ADD_ID;

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case3", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_MOVIE_CLIP_ADD_ID;

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case4", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_FILE_ID;

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case5", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_FILE_INPUT_ID;

        let changed = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case "change":
                    changed = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(changed).toBe(false);
        execute();
        expect(changed).toBe(true);

        element.remove();
    });

    it("execute test case6", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_CHANGE_SCENE_ID;

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case7", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_DELETE_ID;

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });

    it("execute test case8", () =>
    {
        const element = document.createElement("div");
        document.body.appendChild(element);
        element.id = $LIBRARY_PHOTOPEA_ID;

        let pointerDown = false;
        element.addEventListener = vi.fn((type) =>
        {
            switch (type) {

                case EventType.POINTER_DOWN:
                    pointerDown = true;
                    return;

                default:
                    throw new Error("Invalid event type");

            }
        });
    
        expect(pointerDown).toBe(false);
        execute();
        expect(pointerDown).toBe(true);

        element.remove();
    });
});
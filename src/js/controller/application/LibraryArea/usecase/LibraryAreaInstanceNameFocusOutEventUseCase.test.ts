import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Shape } from "../../../../core/domain/model/Shape";
import { execute } from "./LibraryAreaInstanceNameFocusOutEventUseCase";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("LibraryAreaInstanceNameFocusOutEventUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const root = workSpace.root;
         
        const div = document.createElement("div");
        div.dataset.libraryId = "0";

        const mockEvent = {
            "target": div
        } as unknown as FocusEvent;

        expect(root.name).toBe("main");
        expect(div.textContent).toBe("");
        execute(mockEvent);
        expect(div.textContent).toBe(root.name);
    });

    it("execute test case2", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const root = workSpace.root;
            
        const shape = new Shape({
            "id": 1,
            "name": "test",
            "type": "shape"
        });
        workSpace.libraries.set(shape.id, shape);
        workSpace.pathMap.set(shape.getPath(workSpace), shape.id);

        const div = document.createElement("div");
        div.dataset.libraryId = "0";
        div.textContent = "test";

        const mockEvent = {
            "target": div
        } as unknown as FocusEvent;

        expect(root.name).toBe("main");
        expect(div.textContent).toBe("test");
        execute(mockEvent);
        expect(root.name).toBe("main");
        expect(div.textContent).toBe("main");

        // テスト後にも初期化
        workSpace.libraries.delete(shape.id);
        workSpace.pathMap.delete(shape.getPath(workSpace));
    });

    it("execute test case3", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const root = workSpace.root;
            
        const shape = new Shape({
            "id": 1,
            "name": "test",
            "type": "shape"
        });
        workSpace.libraries.set(shape.id, shape);
        workSpace.pathMap.set(shape.getPath(workSpace), shape.id);

        const div = document.createElement("div");
        div.dataset.libraryId = "0";
        div.textContent = "abc";

        const mockEvent = {
            "target": div
        } as unknown as FocusEvent;

        expect(root.name).toBe("main");
        expect(div.textContent).toBe("abc");
        execute(mockEvent);
        expect(root.name).toBe("abc");

        // テスト後にも初期化
        root.name = "main";
        expect(root.name).toBe("main");

        workSpace.libraries.delete(shape.id);
        workSpace.pathMap.delete(shape.getPath(workSpace));
    });
});
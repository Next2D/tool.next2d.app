import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { Shape } from "../../../../core/domain/model/Shape";
import { execute } from "./LibraryAreaInstanceSymbolFocusOutEventUseCase";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("LibraryAreaInstanceSymbolFocusOutEventUseCase Test", () =>
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

        expect(root.symbol).toBe("");
        expect(div.textContent).toBe("");
        execute(mockEvent);
        expect(div.textContent).toBe("");
    });

    it("execute test case2", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const root = workSpace.root;
            
        const shape = new Shape({
            "id": 1,
            "name": "test",
            "symbol": "test symbol",
            "type": "shape"
        });
        workSpace.libraries.set(shape.id, shape);
        workSpace.symbolMap.set(shape.symbol, shape.id);

        const div = document.createElement("div");
        div.dataset.libraryId = "0";
        div.textContent = shape.symbol;

        const mockEvent = {
            "target": div
        } as unknown as FocusEvent;

        expect(root.symbol).toBe("");
        expect(div.textContent).toBe(shape.symbol);
        execute(mockEvent);
        expect(root.symbol).toBe("");
        expect(div.textContent).toBe("");

        // テスト後にも初期化
        workSpace.libraries.delete(shape.id);
        workSpace.symbolMap.delete(shape.symbol);
    });

    it("execute test case3", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const root = workSpace.root;
            
        const shape = new Shape({
            "id": 1,
            "name": "test",
            "symbol": "test symbol",
            "type": "shape"
        });
        workSpace.libraries.set(shape.id, shape);
        workSpace.symbolMap.set(shape.symbol, shape.id);

        const div = document.createElement("div");
        div.dataset.libraryId = "0";
        div.textContent = "abc";

        const mockEvent = {
            "target": div
        } as unknown as FocusEvent;

        expect(root.symbol).toBe("");
        expect(div.textContent).toBe("abc");
        execute(mockEvent);
        expect(root.symbol).toBe("abc");

        // テスト後にも初期化
        root.symbol = "";
        expect(root.symbol).toBe("");

        workSpace.libraries.delete(shape.id);
        workSpace.symbolMap.delete(shape.symbol);
    });
});
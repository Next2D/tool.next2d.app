import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import type { IPivotType } from "../../../../interface/IPivotType";
import { $REFERENCE_SETTING_BOX_ID } from "../../../../config/ReferenceSettingConfig";
import { execute } from "./ReferenceSettingUpdateCellValueService";

describe("ReferenceSettingUpdateCellValueService", () => {

    let mockElement: HTMLElement;
    let mockChildren: HTMLElement[];

    beforeEach(() => {
        // 9個のセル要素を作成（3x3グリッド）
        mockChildren = Array.from({ length: 9 }, (_, index) => {
            const element = document.createElement("div");
            element.className = "reference-setting-box-child";
            return element;
        });

        // メインのボックス要素を作成
        mockElement = document.createElement("div");
        mockElement.id = $REFERENCE_SETTING_BOX_ID;
        
        // 子要素を追加
        mockChildren.forEach(child => {
            mockElement.appendChild(child);
        });

        // getElementsByClassNameのモック
        Object.defineProperty(mockElement, "getElementsByClassName", {
            value: vi.fn().mockReturnValue(mockChildren),
            writable: true,
            configurable: true
        });

        // document.getElementByIdのモック
        Object.defineProperty(document, "getElementById", {
            value: vi.fn().mockReturnValue(mockElement),
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // DOM要素をクリーンアップ
        mockChildren.forEach(child => {
            child.className = "reference-setting-box-child";
        });
    });

    describe("正常系", () => {

        test("top-leftが指定された場合、0番目のセルがアクティブになる", () => {
            // 事前に他のセルをアクティブにしておく
            mockChildren[4].classList.add("active");

            execute("top-left");

            expect(mockChildren[0].classList.contains("active")).toBe(true);
            expect(mockChildren[4].classList.contains("active")).toBe(false);
        });

        test("top-centerが指定された場合、1番目のセルがアクティブになる", () => {
            execute("top-center");

            expect(mockChildren[1].classList.contains("active")).toBe(true);
            // 他のセルがアクティブでないことを確認
            mockChildren.forEach((child, index) => {
                if (index !== 1) {
                    expect(child.classList.contains("active")).toBe(false);
                }
            });
        });

        test("top-rightが指定された場合、2番目のセルがアクティブになる", () => {
            execute("top-right");

            expect(mockChildren[2].classList.contains("active")).toBe(true);
        });

        test("middle-leftが指定された場合、3番目のセルがアクティブになる", () => {
            execute("middle-left");

            expect(mockChildren[3].classList.contains("active")).toBe(true);
        });

        test("middle-centerが指定された場合、4番目のセルがアクティブになる", () => {
            execute("middle-center");

            expect(mockChildren[4].classList.contains("active")).toBe(true);
        });

        test("middle-rightが指定された場合、5番目のセルがアクティブになる", () => {
            execute("middle-right");

            expect(mockChildren[5].classList.contains("active")).toBe(true);
        });

        test("bottom-leftが指定された場合、6番目のセルがアクティブになる", () => {
            execute("bottom-left");

            expect(mockChildren[6].classList.contains("active")).toBe(true);
        });

        test("bottom-centerが指定された場合、7番目のセルがアクティブになる", () => {
            execute("bottom-center");

            expect(mockChildren[7].classList.contains("active")).toBe(true);
        });

        test("bottom-rightが指定された場合、8番目のセルがアクティブになる", () => {
            execute("bottom-right");

            expect(mockChildren[8].classList.contains("active")).toBe(true);
        });

        test("複数のセルがアクティブな場合、全て非アクティブにしてから指定したセルをアクティブにする", () => {
            // 複数のセルをアクティブにしておく
            mockChildren[1].classList.add("active");
            mockChildren[3].classList.add("active");
            mockChildren[7].classList.add("active");

            execute("middle-center");

            // 指定したセルのみアクティブになる
            expect(mockChildren[4].classList.contains("active")).toBe(true);
            // 他のセルは全て非アクティブになる
            expect(mockChildren[1].classList.contains("active")).toBe(false);
            expect(mockChildren[3].classList.contains("active")).toBe(false);
            expect(mockChildren[7].classList.contains("active")).toBe(false);
        });

    });

    describe("異常系", () => {

        test("pivotがnullの場合、何も実行されない", () => {
            const spy = vi.spyOn(document, "getElementById");
            
            execute(null as any);

            expect(spy).not.toHaveBeenCalled();
        });

        test("pivotがundefinedの場合、何も実行されない", () => {
            const spy = vi.spyOn(document, "getElementById");
            
            execute(undefined as any);

            expect(spy).not.toHaveBeenCalled();
        });

        test("pivotが空文字の場合、何も実行されない", () => {
            const spy = vi.spyOn(document, "getElementById");
            
            execute("" as any);

            expect(spy).not.toHaveBeenCalled();
        });

        test("対象の要素が存在しない場合、何も実行されない", () => {
            Object.defineProperty(document, "getElementById", {
                value: vi.fn().mockReturnValue(null),
                writable: true,
                configurable: true
            });

            expect(() => execute("middle-center")).not.toThrow();
        });

        test("子要素が存在しない場合、何も実行されない", () => {
            Object.defineProperty(mockElement, "getElementsByClassName", {
                value: vi.fn().mockReturnValue([]),
                writable: true,
                configurable: true
            });

            expect(() => execute("middle-center")).not.toThrow();
        });

        test("子要素がnullの場合、何も実行されない", () => {
            Object.defineProperty(mockElement, "getElementsByClassName", {
                value: vi.fn().mockReturnValue(null),
                writable: true,
                configurable: true
            });

            expect(() => execute("middle-center")).not.toThrow();
        });

        test("無効なpivot値が指定された場合、何も実行されない", () => {
            // 事前に4番目のセルをアクティブにしておく
            mockChildren[4].classList.add("active");

            execute("invalid-pivot" as any);

            // 既存のアクティブセルは非アクティブになる
            expect(mockChildren[4].classList.contains("active")).toBe(false);
            // どのセルもアクティブにならない
            mockChildren.forEach(child => {
                expect(child.classList.contains("active")).toBe(false);
            });
        });

        test("指定されたインデックスの子要素が存在しない場合、何も実行されない", () => {
            // 子要素を3個だけに制限
            const limitedChildren = mockChildren.slice(0, 3);
            Object.defineProperty(mockElement, "getElementsByClassName", {
                value: vi.fn().mockReturnValue(limitedChildren),
                writable: true,
                configurable: true
            });

            // 6番目のセルを指定（存在しない）
            expect(() => execute("bottom-left")).not.toThrow();
        });

    });

    describe("DOM操作", () => {

        test("document.getElementByIdが正しい引数で呼ばれる", () => {
            const spy = vi.spyOn(document, "getElementById");

            execute("middle-center");

            expect(spy).toHaveBeenCalledWith($REFERENCE_SETTING_BOX_ID);
        });

        test("getElementsByClassNameが正しい引数で呼ばれる", () => {
            const spy = vi.spyOn(mockElement, "getElementsByClassName");

            execute("middle-center");

            expect(spy).toHaveBeenCalledWith("reference-setting-box-child");
        });

        test("classListのaddとremoveが正しく呼ばれる", () => {
            // 事前に別のセルをアクティブにしておく
            mockChildren[1].classList.add("active");
            
            const addSpy = vi.spyOn(mockChildren[4].classList, "add");
            const removeSpy = vi.spyOn(mockChildren[1].classList, "remove");

            execute("middle-center");

            expect(removeSpy).toHaveBeenCalledWith("active");
            expect(addSpy).toHaveBeenCalledWith("active");
        });

    });

});
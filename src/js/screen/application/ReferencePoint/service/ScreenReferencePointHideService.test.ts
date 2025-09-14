import { execute } from "./ScreenReferencePointHideService";
import { $SCREEN_REFERENCE_POINT_ID } from "../../../../config/ScreenConfig";
import { 
    $getReferencePointState,
    $setReferencePointState 
} from "../ReferencePointUtil";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("ScreenReferencePointHideServiceTest", () =>
{
    let testElement: HTMLElement;

    beforeEach(() =>
    {
        // テスト用のDOM要素を作成
        testElement = document.createElement("div");
        testElement.id = $SCREEN_REFERENCE_POINT_ID;
        document.body.appendChild(testElement);
        
        // 初期状態をリセット
        $setReferencePointState("show");
    });

    afterEach(() =>
    {
        // テスト後のクリーンアップ
        if (testElement && testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
        }
    });

    it("基準点要素を非表示にする - Hide reference point element", () =>
    {
        // 初期状態の確認
        expect($getReferencePointState()).toBe("show");
        expect(testElement.getAttribute("style")).toBeNull();

        execute();

        // 要素が非表示になり、状態が更新されることを確認
        expect(testElement.getAttribute("style")).toBe("display: none;");
        expect($getReferencePointState()).toBe("hide");
    });

    it("既に非表示状態の場合は何もしない - Do nothing if already hidden", () =>
    {
        // 既に非表示状態に設定
        $setReferencePointState("hide");
        
        // 要素のstyle属性を事前に設定
        testElement.setAttribute("style", "color: red;");
        
        expect($getReferencePointState()).toBe("hide");
        const initialStyle = testElement.getAttribute("style");

        execute();

        // 状態とstyle属性が変更されないことを確認
        expect($getReferencePointState()).toBe("hide");
        expect(testElement.getAttribute("style")).toBe(initialStyle);
    });

    it("要素が存在しない場合は何もしない - Do nothing if element doesn't exist", () =>
    {
        // テスト要素を削除
        testElement.remove();
        
        // 初期状態をshow状態に設定
        $setReferencePointState("show");
        expect($getReferencePointState()).toBe("show");

        // エラーが発生しないことを確認
        expect(() => execute()).not.toThrow();
        
        // 状態はshowのまま変更されないことを確認
        expect($getReferencePointState()).toBe("show");
    });

    it("表示状態から非表示状態への遷移を確認 - Confirm transition from show to hide state", () =>
    {
        // 初期状態: show
        $setReferencePointState("show");
        testElement.setAttribute("style", "display: block; color: blue;");
        
        expect($getReferencePointState()).toBe("show");
        expect(testElement.style.display).toBe("block");

        execute();

        // 非表示状態に変更されることを確認
        expect($getReferencePointState()).toBe("hide");
        expect(testElement.getAttribute("style")).toBe("display: none;");
    });

    it("style属性が既に設定されている要素の場合 - Case where style attribute is already set", () =>
    {
        // 既存のstyle属性を設定
        testElement.setAttribute("style", "background: yellow; padding: 10px;");
        $setReferencePointState("show");

        execute();

        // display: none; に置き換えられることを確認
        expect(testElement.getAttribute("style")).toBe("display: none;");
        expect($getReferencePointState()).toBe("hide");
    });

    it("複数回実行しても安全であることを確認 - Confirm it's safe to execute multiple times", () =>
    {
        // 初期状態
        $setReferencePointState("show");
        
        // 1回目の実行
        execute();
        expect($getReferencePointState()).toBe("hide");
        expect(testElement.getAttribute("style")).toBe("display: none;");
        
        // 2回目の実行（既にhide状態）
        execute();
        expect($getReferencePointState()).toBe("hide");
        expect(testElement.getAttribute("style")).toBe("display: none;");
        
        // 3回目の実行
        execute();
        expect($getReferencePointState()).toBe("hide");
        expect(testElement.getAttribute("style")).toBe("display: none;");
    });
});

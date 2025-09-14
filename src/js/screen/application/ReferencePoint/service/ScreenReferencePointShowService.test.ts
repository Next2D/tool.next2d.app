import { execute } from "./ScreenReferencePointShowService";
import { $SCREEN_REFERENCE_POINT_ID } from "../../../../config/ScreenConfig";
import { 
    $getReferencePointState,
    $setReferencePointState 
} from "../ReferencePointUtil";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("ScreenReferencePointShowServiceTest", () =>
{
    let testElement: HTMLElement;

    beforeEach(() =>
    {
        // テスト用のDOM要素を作成
        testElement = document.createElement("div");
        testElement.id = $SCREEN_REFERENCE_POINT_ID;
        document.body.appendChild(testElement);
        
        // 初期状態をhide状態に設定
        $setReferencePointState("hide");
    });

    afterEach(() =>
    {
        // テスト後のクリーンアップ
        if (testElement && testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
        }
    });

    it("基準点要素を指定座標に表示する - Display reference point element at specified coordinates", () =>
    {
        // 初期状態の確認
        expect($getReferencePointState()).toBe("hide");
        expect(testElement.getAttribute("style")).toBeNull();

        execute(100, 150);

        // 要素が表示され、正しい位置に配置されることを確認
        // x-6, y-6でオフセットされる
        expect(testElement.getAttribute("style")).toBe("left: 94px;top: 144px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("座標(0,0)での表示 - Display at coordinates (0,0)", () =>
    {
        execute(0, 0);

        // オフセット-6が適用されることを確認
        expect(testElement.getAttribute("style")).toBe("left: -6px;top: -6px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("正の座標での表示 - Display at positive coordinates", () =>
    {
        execute(200, 300);

        expect(testElement.getAttribute("style")).toBe("left: 194px;top: 294px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("負の座標での表示 - Display at negative coordinates", () =>
    {
        execute(-10, -20);

        // 負の座標でもオフセットが適用される
        expect(testElement.getAttribute("style")).toBe("left: -16px;top: -26px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("小数点を含む座標での表示 - Display at coordinates with decimal points", () =>
    {
        execute(125.5, 87.3);

        expect(testElement.getAttribute("style")).toBe("left: 119.5px;top: 81.3px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("大きな座標値での表示 - Display at large coordinate values", () =>
    {
        execute(9999, 8888);

        expect(testElement.getAttribute("style")).toBe("left: 9993px;top: 8882px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("既に表示状態の場合は何もしない - Do nothing if already in show state", () =>
    {
        // 既に表示状態に設定
        $setReferencePointState("show");
        
        // 事前にstyle属性を設定
        testElement.setAttribute("style", "color: red; background: blue;");
        
        expect($getReferencePointState()).toBe("show");
        const initialStyle = testElement.getAttribute("style");

        execute(100, 200);

        // 状態とstyle属性が変更されないことを確認
        expect($getReferencePointState()).toBe("show");
        expect(testElement.getAttribute("style")).toBe(initialStyle);
    });

    it("要素が存在しない場合は何もしない - Do nothing if element doesn't exist", () =>
    {
        // テスト要素を削除
        testElement.remove();
        
        // 初期状態をhide状態に設定
        $setReferencePointState("hide");
        expect($getReferencePointState()).toBe("hide");

        // エラーが発生しないことを確認
        expect(() => execute(50, 75)).not.toThrow();
        
        // 状態はhideのまま変更されないことを確認
        expect($getReferencePointState()).toBe("hide");
    });

    it("hide状態から show状態への遷移を確認 - Confirm transition from hide to show state", () =>
    {
        // 初期状態: hide
        $setReferencePointState("hide");
        expect($getReferencePointState()).toBe("hide");

        execute(75, 125);

        // 表示状態に変更され、正しい位置に配置されることを確認
        expect($getReferencePointState()).toBe("show");
        expect(testElement.getAttribute("style")).toBe("left: 69px;top: 119px;");
    });

    it("既存のstyle属性が上書きされることを確認 - Confirm existing style attributes are overwritten", () =>
    {
        // 既存のstyle属性を設定
        testElement.setAttribute("style", "background: yellow; padding: 10px; display: none;");
        $setReferencePointState("hide");

        execute(50, 60);

        // 既存のstyle属性が新しい位置情報で完全に置き換えられることを確認
        expect(testElement.getAttribute("style")).toBe("left: 44px;top: 54px;");
        expect($getReferencePointState()).toBe("show");
    });

    it("複数回実行で座標が更新されることを確認 - Confirm coordinates are updated with multiple executions", () =>
    {
        // 1回目の実行
        execute(100, 150);
        expect($getReferencePointState()).toBe("show");
        expect(testElement.getAttribute("style")).toBe("left: 94px;top: 144px;");
        
        // 状態をhideに戻してから2回目の実行
        $setReferencePointState("hide");
        execute(200, 250);
        expect($getReferencePointState()).toBe("show");
        expect(testElement.getAttribute("style")).toBe("left: 194px;top: 244px;");
        
        // 状態をhideに戻してから3回目の実行
        $setReferencePointState("hide");
        execute(50, 75);
        expect($getReferencePointState()).toBe("show");
        expect(testElement.getAttribute("style")).toBe("left: 44px;top: 69px;");
    });

    it("オフセット値(-6)の計算が正確であることを確認 - Confirm offset value (-6) calculation is accurate", () =>
    {
        const testCases = [
            { x: 0, y: 0, expectedLeft: -6, expectedTop: -6 },
            { x: 6, y: 6, expectedLeft: 0, expectedTop: 0 },
            { x: 10, y: 20, expectedLeft: 4, expectedTop: 14 },
            { x: -5, y: -10, expectedLeft: -11, expectedTop: -16 },
            { x: 100.5, y: 200.7, expectedLeft: 94.5, expectedTop: 194.7 }
        ];

        testCases.forEach(({ x, y, expectedLeft, expectedTop }, index) => {
            // 各テストケースの前に状態をリセット
            $setReferencePointState("hide");
            
            execute(x, y);
            
            expect(testElement.getAttribute("style")).toBe(`left: ${expectedLeft}px;top: ${expectedTop}px;`);
            expect($getReferencePointState()).toBe("show");
        });
    });

    it("ゼロ座標での表示テスト - Display test at zero coordinates", () =>
    {
        execute(0, 0);

        // ゼロ座標でもオフセットが正しく適用される
        expect(testElement.getAttribute("style")).toBe("left: -6px;top: -6px;");
        expect($getReferencePointState()).toBe("show");
    });
});

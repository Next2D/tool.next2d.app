import { describe, test, expect, beforeEach } from "vitest";
import {
    $getColorSettingState,
    $setColorSettingState
} from "./ColorSettingUtil";

describe("ColorSettingUtil", () => {

    beforeEach(() => {
        // 各テスト前に状態を"up"にリセット
        $setColorSettingState("up");
    });

    describe("$getColorSettingState", () => {

        test("初期状態は'up'である", () => {
            const state = $getColorSettingState();
            expect(state).toBe("up");
        });

        test("状態が'down'に設定された後、'down'を返す", () => {
            $setColorSettingState("down");
            const state = $getColorSettingState();
            expect(state).toBe("down");
        });

        test("状態が'up'に設定された後、'up'を返す", () => {
            $setColorSettingState("up");
            const state = $getColorSettingState();
            expect(state).toBe("up");
        });

        test("複数回呼び出しても同じ値を返す", () => {
            $setColorSettingState("down");
            const state1 = $getColorSettingState();
            const state2 = $getColorSettingState();
            const state3 = $getColorSettingState();
            
            expect(state1).toBe("down");
            expect(state2).toBe("down");
            expect(state3).toBe("down");
        });

    });

    describe("$setColorSettingState", () => {

        test("状態を'down'に設定できる", () => {
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
        });

        test("状態を'up'に設定できる", () => {
            $setColorSettingState("down");
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
        });

        test("'up'→'down'→'up'の遷移が正しく動作する", () => {
            expect($getColorSettingState()).toBe("up");
            
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
        });

        test("同じ値を連続して設定しても問題ない", () => {
            $setColorSettingState("down");
            $setColorSettingState("down");
            $setColorSettingState("down");
            
            expect($getColorSettingState()).toBe("down");
        });

        test("'up'を複数回設定しても問題ない", () => {
            $setColorSettingState("up");
            $setColorSettingState("up");
            $setColorSettingState("up");
            
            expect($getColorSettingState()).toBe("up");
        });

    });

    describe("状態管理の統合テスト", () => {

        test("ポインターダウン→アップのシミュレーション", () => {
            // 初期状態
            expect($getColorSettingState()).toBe("up");
            
            // ポインターダウン
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            
            // ポインターアップ
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
        });

        test("複数回のポインターダウン→アップサイクル", () => {
            for (let i = 0; i < 5; i++) {
                $setColorSettingState("down");
                expect($getColorSettingState()).toBe("down");
                
                $setColorSettingState("up");
                expect($getColorSettingState()).toBe("up");
            }
        });

        test("状態が保持されることを確認", () => {
            $setColorSettingState("down");
            
            // 他の処理をシミュレート（時間経過など）
            const state1 = $getColorSettingState();
            const state2 = $getColorSettingState();
            
            // 状態が保持されていることを確認
            expect(state1).toBe("down");
            expect(state2).toBe("down");
            expect(state1).toBe(state2);
        });

    });

    describe("エッジケースと境界値テスト", () => {

        test("初期化直後の状態確認", () => {
            // beforeEachで"up"に設定されている
            expect($getColorSettingState()).toBe("up");
        });

        test("'down'から'up'への直接遷移", () => {
            $setColorSettingState("down");
            $setColorSettingState("up");
            
            expect($getColorSettingState()).toBe("up");
        });

        test("'up'から'down'への直接遷移", () => {
            $setColorSettingState("up");
            $setColorSettingState("down");
            
            expect($getColorSettingState()).toBe("down");
        });

    });

    describe("型安全性の確認", () => {

        test("返り値の型が'up' | 'down'であることを確認", () => {
            const state = $getColorSettingState();
            expect(["up", "down"]).toContain(state);
        });

        test("設定後の取得値が設定値と一致する", () => {
            const testValues: Array<"up" | "down"> = ["up", "down"];
            
            testValues.forEach(value => {
                $setColorSettingState(value);
                expect($getColorSettingState()).toBe(value);
            });
        });

    });

    describe("連続操作のテスト", () => {

        test("高速な状態切り替えが正しく動作する", () => {
            for (let i = 0; i < 100; i++) {
                const state = i % 2 === 0 ? "up" : "down";
                $setColorSettingState(state);
                expect($getColorSettingState()).toBe(state);
            }
        });

        test("ランダムな状態遷移が正しく動作する", () => {
            const states: Array<"up" | "down"> = ["up", "down", "up", "up", "down", "down", "up", "down"];
            
            states.forEach(state => {
                $setColorSettingState(state);
                expect($getColorSettingState()).toBe(state);
            });
        });

    });

    describe("実用的なユースケース", () => {

        test("カラーピッカーのドラッグ開始をシミュレート", () => {
            // 初期状態
            expect($getColorSettingState()).toBe("up");
            
            // ドラッグ開始（ポインターダウン）
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
        });

        test("カラーピッカーのドラッグ終了をシミュレート", () => {
            // ドラッグ中
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            
            // ドラッグ終了（ポインターアップ）
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
        });

        test("カラーピッカーの操作キャンセルをシミュレート", () => {
            // ドラッグ開始
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            
            // 操作キャンセル（強制的にupに戻す）
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
        });

        test("複数のカラー調整を連続実行", () => {
            // 1回目の調整
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
            
            // 2回目の調整
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
            
            // 3回目の調整
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
            $setColorSettingState("up");
            expect($getColorSettingState()).toBe("up");
        });

    });

    describe("状態の独立性確認", () => {

        test("getterは状態を変更しない", () => {
            $setColorSettingState("down");
            
            // 複数回getterを呼び出す
            $getColorSettingState();
            $getColorSettingState();
            $getColorSettingState();
            
            // 状態が変更されていないことを確認
            expect($getColorSettingState()).toBe("down");
        });

        test("setterは呼び出し順序に依存する", () => {
            $setColorSettingState("down");
            $setColorSettingState("up");
            
            // 最後に設定された値が反映される
            expect($getColorSettingState()).toBe("up");
            
            $setColorSettingState("down");
            expect($getColorSettingState()).toBe("down");
        });

    });

});

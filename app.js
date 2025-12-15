// ■ M5Stack側のService UUID
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab".toLowerCase();

// ... (変数はそのまま) ...

async function connectToDevice() {
    try {
        console.log("デバイス検索を開始します...");
        statusText.innerText = "検索中...";
        
        // ★★★ ここを「無差別モード」に変更します ★★★
        // UUIDが一致しなくても、とにかく近くにいるデバイスを全部リストに出します
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,             // 条件なしで全て表示！
            optionalServices: [SERVICE_UUID]    // 接続した後でこのUUIDを使うよ、という宣言
        });

        // 2. 切断イベントを監視
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

        // 3. 接続する
        console.log("接続試行中...");
        statusText.innerText = "接続試行中...";
        
        bluetoothServer = await bluetoothDevice.gatt.connect();

        // 4. 成功したら画面を更新
        console.log("接続成功！");
        updateUI(true);

    } catch (error) {
        console.error("接続エラー:", error);
        alert("エラー:\n" + error); // スマホ画面にエラーを出す
        updateUI(false);
    }
}

// ... (残りはそのまま) ...

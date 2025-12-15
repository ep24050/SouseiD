// ■ M5Stack側のService UUID
// アルファベットの大文字・小文字は問いませんが、ここでは念のため小文字で扱います
const SERVICE_UUID = "DAF9C0F4-6D30-75AC-416D-764094B787E0".toLowerCase();

// 画面要素の取得
const statusArea = document.getElementById('status-area');
const statusText = document.getElementById('status-text');
const statusIcon = document.getElementById('status-icon');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');

let bluetoothDevice = null;
let bluetoothServer = null;

/**
 * 接続ボタンを押したときの処理
 */
async function connectToDevice() {
    try {
        console.log("デバイス検索を開始します...");
        statusText.innerText = "検索中...";
        
        // 1. デバイスをスキャン (このUUIDを持つデバイスのみ表示)
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        // 2. 切断イベントを監視する設定 (電源OFFなどを検知するため)
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

        // 3. 接続する
        console.log("接続試行中...");
        bluetoothServer = await bluetoothDevice.gatt.connect();

        // 4. 成功したら画面を更新
        console.log("接続成功！");
        updateUI(true);

    } catch (error) {
        console.error("接続キャンセルまたはエラー:", error);
        alert("接続できませんでした。\n" + error);
        updateUI(false);
    }
}

/**
 * 切断ボタンを押したときの処理
 */
function disconnectDevice() {
    if (bluetoothDevice && bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
        console.log("ユーザー操作で切断しました");
    }
}

/**
 * 切断されたときに自動で呼ばれる処理
 * (M5Stackの電源が切れた時や、距離が離れた時など)
 */
function onDisconnected(event) {
    const device = event.target;
    console.log(`デバイス ${device.name} との接続が切れました`);
    updateUI(false);
}

/**
 * 画面の見た目を切り替える関数
 */
function updateUI(isConnected) {
    if (isConnected) {
        // 接続中モード
        statusArea.classList.remove('disconnected');
        statusArea.classList.add('connected');
        statusIcon.innerText = "🔵";
        statusText.innerText = "接続中";
        
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
    } else {
        // 未接続モード
        statusArea.classList.remove('connected');
        statusArea.classList.add('disconnected');
        statusIcon.innerText = "🔴";
        statusText.innerText = "未接続";

        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
    }
}

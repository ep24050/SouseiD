// ■ M5Stack側のService UUID
const SERVICE_UUID = "DAF9C0F4-6D30-75AC-416D-764094B787E0".toLowerCase();

let bluetoothDevice = null;
let bluetoothServer = null;

// 画面の要素を取得
const statusArea = document.getElementById('status-area');
const statusText = document.getElementById('status-text');
const statusIcon = document.getElementById('status-icon');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');

/**
 * M5Stackに接続する関数
 */
async function connectToDevice() {
    try {
        console.log("デバイスを検索中...");

        // 1. デバイスをスキャン（UUIDでフィルタリング）
        // 注意: Web Bluetooth APIでは、HTTPS環境でのみ動作します
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
            // もしUUIDで見つからない場合は、以下のように全デバイス許可で試してください
            // acceptAllDevices: true,
            // optionalServices: [SERVICE_UUID]
        });

        // 2. 切断イベントのリスナーを登録（これが重要）
        // 電源が切れたり距離が離れたときに onDisconnected が呼ばれます
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

        // 3. GATTサーバーに接続
        console.log("接続試行中...");
        bluetoothServer = await bluetoothDevice.gatt.connect();

        // 4. 画面表示を更新
        console.log("接続成功！");
        updateUI(true);

    } catch (error) {
        console.error("接続エラー:", error);
        alert("接続できませんでした。\n" + error);
        updateUI(false);
    }
}

/**
 * 手動で切断する関数
 */
function disconnectDevice() {
    if (bluetoothDevice && bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
        console.log("ユーザー操作により切断しました");
    }
}

/**
 * 切断されたときに自動的に呼ばれる関数
 * (M5Stackの電源が切れた場合なども含む)
 */
function onDisconnected(event) {
    const device = event.target;
    console.log(`デバイス ${device.name} との接続が切れました`);
    updateUI(false);
}

/**
 * 画面の表示（色や文字）を切り替える関数
 * @param {boolean} isConnected 
 */
function updateUI(isConnected) {
    if (isConnected) {
        // 接続中
        statusArea.classList.remove('disconnected');
        statusArea.classList.add('connected');
        statusText.textContent = "M5Stackと接続中";
        statusIcon.textContent = "🔵";
        
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        disconnectBtn.style.backgroundColor = "#f44336"; // 赤色にする
    } else {
        // 未接続
        statusArea.classList.remove('connected');
        statusArea.classList.add('disconnected');
        statusText.textContent = "未接続";
        statusIcon.textContent = "🔴";

        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
        disconnectBtn.style.backgroundColor = "#9E9E9E"; // グレーに戻す
    }
}

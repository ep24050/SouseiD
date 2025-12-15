const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab".toLowerCase();

const statusArea = document.getElementById('status-area');
const statusText = document.getElementById('status-text');
const statusIcon = document.getElementById('status-icon');
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');

let bluetoothDevice = null;
let bluetoothServer = null;

async function connectToDevice() {
    alert("ボタンは押されました！プログラムは生きています。");
    try {
        statusText.innerText = "検索中...";
        
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);

        statusText.innerText = "接続試行中...";
        bluetoothServer = await bluetoothDevice.gatt.connect();

        updateUI(true);

    } catch (error) {
        alert("Error: " + error);
        updateUI(false);
    }
}

function disconnectDevice() {
    if (bluetoothDevice && bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
    }
}

function onDisconnected(event) {
    updateUI(false);
}

function updateUI(isConnected) {
    if (isConnected) {
        statusArea.classList.remove('disconnected');
        statusArea.classList.add('connected');
        statusIcon.innerText = "🔵";
        statusText.innerText = "接続中";
        
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
    } else {
        statusArea.classList.remove('connected');
        statusArea.classList.add('disconnected');
        statusIcon.innerText = "🔴";
        statusText.innerText = "未接続";

        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
    }
}

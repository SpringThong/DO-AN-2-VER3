// SƯỞI ẤM- LÀM MÁT

// Đọc nhiệt độ
database.ref("/SUOI AM-LAM MAT/NHIET DO").on("value", function(snapshot) {
    var nd = snapshot.val();  
    document.getElementById("nhietdo").innerHTML = nd;
    console.log(nd);

    // Kiểm tra nhiệt độ để điều khiển tự động
    controlDevices(nd);
});

// Đọc độ ẩm
database.ref("/SUOI AM-LAM MAT/DO AM").on("value", function(snapshot) {
    var da = snapshot.val();  
    document.getElementById("doam").innerHTML = da;
    console.log(da);
});

// ĐÈN SƯỞI ẤM
var d01_on = document.getElementById("d01_on");
var d01_off = document.getElementById("d01_off");
var q01_on = document.getElementById("q01_on");
var q01_off = document.getElementById("q01_off");
var autoMessage = document.getElementById("autoMessage");
var autoMode = false; // Biến để theo dõi chế độ tự động

function controlDevices(temp) {
    if (temp < 30) {
        // Tự động bật đèn và tắt quạt
        firebase.database().ref("/SUOI AM-LAM MAT").update({
            "DEN SUOI AM": "ON",
            "QUAT LAM MAT": "OFF"
        });
        document.getElementById("d01_img").src = "./img/den_on.png";
        document.getElementById("q01_img").src = "./img/quat_off.png";
        autoMessage.innerHTML = "BẬT CHẾ ĐỘ SƯỞI ẤM TỰ ĐỘNG!!";
        autoMode = true; // Đặt chế độ tự động là true
    } 
    else if (temp > 50) {
        // Tự động bật quạt và tắt đèn
        firebase.database().ref("/SUOI AM-LAM MAT").update({
            "DEN SUOI AM": "OFF",
            "QUAT LAM MAT": "ON"
        });
        document.getElementById("d01_img").src = "./img/den_off.png";
        document.getElementById("q01_img").src = "./img/quat_on.png";
        autoMessage.innerHTML = "BẬT CHẾ ĐỘ LÀM MÁT TỰ ĐỘNG!!";
        autoMode = true; // Đặt chế độ tự động là true
    } 
    else {
        // Trong khoảng 31°C - 35°C, cho phép điều khiển thủ công
        autoMessage.innerHTML = "BẬT CHẾ ĐỘ THỦ CÔNG: CÓ THỂ ĐIỀU CHỈNH QUA NÚT NHẤN !!";
        autoMode = false; // Đặt chế độ tự động là false
    }
}

// Khởi tạo trạng thái ban đầu
database.ref("/SUOI AM-LAM MAT").get().then((snapshot) => {
    if (snapshot.exists()) {
        var bulb_01_status = snapshot.val();
        if (bulb_01_status["DEN SUOI AM"] == "ON") {
            document.getElementById("d01_img").src = "./img/den_on.png";
        } else {
            document.getElementById("d01_img").src = "./img/den_off.png";
        }
        
        if (bulb_01_status["QUAT LAM MAT"] == "ON") {
            document.getElementById("q01_img").src = "./img/quat_on.png";
        } else {
            document.getElementById("q01_img").src = "./img/quat_off.png";
        }
    } else {
        console.log("No data available!");
    }
});

// Bật đèn sưởi ấm
d01_on.onclick = function() {
    if (autoMode) {
        alert("Hệ thống đang trong chế độ tự động, không thể điều chỉnh bằng tay.");
        return; // Không thực hiện hành động nếu đang ở chế độ tự động
    }
    document.getElementById("d01_img").src = "./img/den_on.png";
    firebase.database().ref("/SUOI AM-LAM MAT").update({
        "DEN SUOI AM": "ON"
    });
}

// Tắt đèn sưởi ấm
d01_off.onclick = function() {
    if (autoMode) {
        alert("Hệ thống đang trong chế độ tự động, không thể điều chỉnh bằng tay.");
        return; // Không thực hiện hành động nếu đang ở chế độ tự động
    }
    document.getElementById("d01_img").src = "./img/den_off.png";
    firebase.database().ref("/SUOI AM-LAM MAT").update({
        "DEN SUOI AM": "OFF"
    });
}

// Tương tác ngược lại từ Firebase và web cho đèn sưởi ấm
database.ref("/SUOI AM-LAM MAT/DEN SUOI AM").on("value", function(snapshot) {
    let ledState = snapshot.val();
    if (ledState == "ON") {
        document.getElementById(`d01_img`).src = `./img/den_on.png`;
    } else {
        document.getElementById(`d01_img`).src = `./img/den_off.png`;
    }
});

// Bật quạt làm mát
q01_on.onclick = function() {
    if (autoMode) {
        alert("Hệ thống đang trong chế độ tự động, không thể điều chỉnh bằng tay.");
        return; // Không thực hiện hành động nếu đang ở chế độ tự động
    }
    document.getElementById("q01_img").src = "./img/quat_on.png";
    firebase.database().ref("/SUOI AM-LAM MAT").update({
        "QUAT LAM MAT": "ON"
    });
}

// Tắt quạt làm mát
q01_off.onclick = function() {
    if (autoMode) {
        alert("Hệ thống đang trong chế độ tự động, không thể điều chỉnh bằng tay.");
        return; // Không thực hiện hành động nếu đang ở chế độ tự động
    }
    document.getElementById("q01_img").src = "./img/quat_off.png";
    firebase.database().ref("/SUOI AM-LAM MAT").update({
        "QUAT LAM MAT": "OFF"
    });
}

// Tương tác ngược lại từ Firebase và web cho quạt làm mát
database.ref("/SUOI AM-LAM MAT/QUAT LAM MAT").on("value", function(snapshot) {
    let ledState = snapshot.val();
    if (ledState == "ON") {
        document.getElementById(`q01_img`).src = `./img/quat_on.png`;
    } else {
        document.getElementById(`q01_img`).src = `./img/quat_off.png`;
    }
});

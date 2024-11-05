//CHIẾU SÁNG....................................................................................
//ĐÈN CHIẾU SÁNG
var d02_on = document.getElementById("d02_on");
var d02_off = document.getElementById("d02_off");
var manualSet = false;

database.ref("/CHIEU SANG").get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val())

    var bulb_02_status = snapshot.val()
    if (bulb_02_status["DEN CHIEU SANG"] == "ON")
      document.getElementById("d02_img").src = "./img/den_on.png"
    else
      document.getElementById("d02_img").src = "./img/den_off.png"
  }
  else
    console.log("No data available!")
})

d02_on.onclick = function () {
  if (coDangTrongHenGioChieuSang) {
    window.alert("ĐANG TRONG THỜI GIAN CHIẾU SÁNG TỰ ĐỘNG, KHÔNG THỂ ĐIỀU KHIỂN THỦ CÔNG!!")
    return;
  }
  manualSet = true;
  document.getElementById("d02_img").src = "./img/den_on.png"

  firebase.database().ref("/CHIEU SANG").update({
    "DEN CHIEU SANG": "ON"
  })
}
d02_off.onclick = function () {
  if (coDangTrongHenGioChieuSang) {
    window.alert("ĐANG TRONG THỜI GIAN CHIẾU SÁNG TỰ ĐỘNG, KHÔNG THỂ ĐIỀU KHIỂN THỦ CÔNG!!")
    return;
  }
  document.getElementById("d02_img").src = "./img/den_off.png"
  manualSet = true;
  firebase.database().ref("/CHIEU SANG").update({
    "DEN CHIEU SANG": "OFF"
  })
}

//TUONG TÁC NGƯỢC LẠI FIREBASE VÀ WEB
database.ref("/CHIEU SANG/DEN CHIEU SANG").on("value", function (snapshot) {
  let ledState = snapshot.val();
  console.log(ledState)
  if (ledState == "ON") {
    document.getElementById(`d02_img`).src = `./img/den_on.png`

  }
  else {
    console.log("set OFF'")
    document.getElementById(`d02_img`).src = `./img/den_off.png`
  }
});

//// HẸN GIỜ BẬT ĐÈN

// Hàm lưu thời gian hẹn giờ lên Firebase
function setWeeklyTimers_1() {
  var weeklyTimers_1 = {
    monday: {
      bắt_đầu: document.getElementById("tt2on").value,
      kết_thúc: document.getElementById("tt2off").value
    },
    tuesday: {
      bắt_đầu: document.getElementById("tt3on").value,
      kết_thúc: document.getElementById("tt3off").value
    },
    wednesday: {
      bắt_đầu: document.getElementById("tt4on").value,
      kết_thúc: document.getElementById("tt4off").value
    },
    thursday: {
      bắt_đầu: document.getElementById("tt5on").value,
      kết_thúc: document.getElementById("tt5off").value
    },
    friday: {
      bắt_đầu: document.getElementById("tt6on").value,
      kết_thúc: document.getElementById("tt6off").value
    },
    saturday: {
      bắt_đầu: document.getElementById("tt7on").value,
      kết_thúc: document.getElementById("tt7off").value
    },
    sunday: {
      bắt_đầu: document.getElementById("tt8on").value,
      kết_thúc: document.getElementById("tt8off").value
    }
  };

  // Kiểm tra xem tất cả các ngày đã được nhập thời gian hay chưa
  for (var day in weeklyTimers_1) {
    if (!weeklyTimers_1[day].bắt_đầu || !weeklyTimers_1[day].kết_thúc) {
      alert("VUI LÒNG NHẬP ĐỦ THỜI GIAN CHO TẤT CẢ CÁC NGÀY !!.");
      return;
    }
  }

  // Lưu dữ liệu lên Firebase
  database.ref("/CHIEU SANG/HEN GIO CHIEU SANG").set(weeklyTimers_1)
    .then(() => {
      manualSet = false;
      alert("HẸNG GIỜ ĐÃ ĐƯỢC LƯU THÀNH CÔNG!!");
    })
    .catch((error) => {
      console.error("Lỗi khi lưu dữ liệu: ", error);
    });
}

// Hàm lấy dữ liệu thời gian từ Firebase và hiển thị lên form
function loadWeeklyTimers_1() {
  database.ref("/CHIEU SANG/HEN GIO CHIEU SANG").once('value').then((snapshot) => {
    var timers = snapshot.val();

    if (timers) {
      document.getElementById("tt2on").value = timers.monday.bắt_đầu || "";
      document.getElementById("tt2off").value = timers.monday.kết_thúc || "";

      document.getElementById("tt3on").value = timers.tuesday.bắt_đầu || "";
      document.getElementById("tt3off").value = timers.tuesday.kết_thúc || "";

      document.getElementById("tt4on").value = timers.wednesday.bắt_đầu || "";
      document.getElementById("tt4off").value = timers.wednesday.kết_thúc || "";

      document.getElementById("tt5on").value = timers.thursday.bắt_đầu || "";
      document.getElementById("tt5off").value = timers.thursday.kết_thúc || "";

      document.getElementById("tt6on").value = timers.friday.bắt_đầu || "";
      document.getElementById("tt6off").value = timers.friday.kết_thúc || "";

      document.getElementById("tt7on").value = timers.saturday.bắt_đầu || "";
      document.getElementById("tt7off").value = timers.saturday.kết_thúc || "";

      document.getElementById("tt8on").value = timers.sunday.bắt_đầu || "";
      document.getElementById("tt8off").value = timers.sunday.kết_thúc || "";
    }
  });
}

// Hàm kiểm tra thời gian hiện tại với thời gian đã hẹn
function checkLightStatus_1() {
   if (!manualSet) {
    console.log(coDangTrongHenGioChieuSang)
    var currentTime = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    var currentDay = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Lấy thứ hiện tại

    database.ref("/CHIEU SANG/HEN GIO CHIEU SANG/" + currentDay).once('value').then((snapshot) => {
      var timers = snapshot.val();

      if (timers && currentTime >= timers.bắt_đầu && currentTime < timers.kết_thúc) {
        document.getElementById("d02_img").src = "img/den_on.png";  // Đèn sáng
        document.getElementById("deviceStatus_1").innerText = "ĐANG CHIẾU SÁNG TỰ ĐỘNG";
        firebase.database().ref("/CHIEU SANG").update({
          "DEN CHIEU SANG": "ON"
        });
        coDangTrongHenGioChieuSang = true;

      } else {
        document.getElementById("d02_img").src = "img/den_off.png";  // Đèn tắt
        document.getElementById("deviceStatus_1").innerText = "NGƯNG CHIẾU SÁNG TỰ ĐỘNG!";
        firebase.database().ref("/CHIEU SANG").update({
          "DEN CHIEU SANG": "OFF"
        });
        coDangTrongHenGioChieuSang = false;
      }
    });
 }
}
// ĐỘ CHẾ
document.getElementById("cancelScheduleButton").onclick = cancelWeeklyTimers;

// Hàm hủy hẹn giờ
function cancelWeeklyTimers() {
  // Xóa dữ liệu hẹn giờ trong Firebase
  database.ref("/CHIEU SANG/HEN GIO CHIEU SANG").remove()
    .then(() => {
      alert("Đã hủy hẹn giờ thành công!");
      // Cập nhật giao diện người dùng để xóa thời gian hẹn giờ
      clearWeeklyTimersForm();
    })
    .catch((error) => {
      console.error("Lỗi khi hủy hẹn giờ: ", error);
    });
}

// Hàm xóa nội dung của form hẹn giờ
function clearWeeklyTimersForm() {
  document.getElementById("tt2on").value = "";
  document.getElementById("tt2off").value = "";

  document.getElementById("tt3on").value = "";
  document.getElementById("tt3off").value = "";

  document.getElementById("tt4on").value = "";
  document.getElementById("tt4off").value = "";

  document.getElementById("tt5on").value = "";
  document.getElementById("tt5off").value = "";

  document.getElementById("tt6on").value = "";
  document.getElementById("tt6off").value = "";

  document.getElementById("tt7on").value = "";
  document.getElementById("tt7off").value = "";

  document.getElementById("tt8on").value = "";
  document.getElementById("tt8off").value = "";

  firebase.database().ref("/CHIEU SANG").update({
    "DEN CHIEU SANG": "OFF"
  });
}




function updateDeviceStatus_1() {
  var statusRef = database.ref("/CHIEU SANG/HEN GIO CHIEU SANG");

  statusRef.on('value', (snapshot) => {
    var status = snapshot.val();
    document.getElementById("deviceStatus_1").innerText = status;
  });
}
setInterval(checkLightStatus_1, 1000);
// Hàm cập nhật trạng thái thiết bị từ Firebase
window.onload = function() {
  loadWeeklyTimers();  // Tải thời gian hẹn giờ từ Firebase
  updateDeviceStatus();
  loadWeeklyTimers_1();  // Tải thời gian hẹn giờ từ Firebase
  updateDeviceStatus_1();
  document.getElementById("cancelScheduleButton1").onclick = cancelWeeklyTimers1; // Gán hàm hủy hẹn giờ
  document.getElementById("cancelScheduleButton").onclick = cancelWeeklyTimers; // Gán hàm hủy hẹn giờ

  }
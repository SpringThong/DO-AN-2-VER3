//gà ăn....................................................................................
//CHO GÀ ĂN
var g01_on = document.getElementById("g01_on");
var g01_off = document.getElementById("g01_off");
var manualSet1 = false;

database.ref("/THUC AN").get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val())

    var bulb_03_status = snapshot.val()
    if (bulb_03_status["CHO AN"] == "ON")
      document.getElementById("g01_img").src = "./img/an_on.png"
    else
      document.getElementById("g01_img").src = "./img/an_off.png"
  }
  else
    console.log("No data available!")
})

g01_on.onclick = function () {
  if (coDangTrongHenGioChoAn) {
    window.alert("Gà đang trong thời gian hẹn giờ chiếu sáng, không thể thay đổi trạng thái chiếu sáng!")
    return;
  }
  manualSet1 = true;
  document.getElementById("g01_img").src = "./img/an_on.png"

  firebase.database().ref("/THUC AN").update({
    "CHO AN": "ON"
  })
}
g01_off.onclick = function () {
  if (coDangTrongHenGioChoAn) {
    window.alert("Gà đang trong thời gian hẹn giờ chiếu sáng, không thể thay đổi trạng thái chiếu sáng!")
    return;
  }
  document.getElementById("g01_img").src = "./img/an_off.png"
  manualSet1 = true;
  firebase.database().ref("/THUC AN").update({
    "CHO AN": "OFF"
  })
}

//TUONG TÁC NGƯỢC LẠI FIREBASE VÀ WEB
database.ref("/THUC AN/CHO AN").on("value", function (snapshot) {
  let ledState = snapshot.val();
  console.log(ledState)
  if (ledState == "ON") {
    document.getElementById(`g01_img`).src = `./img/an_on.png`

  }
  else {
    console.log("set OFF'")
    document.getElementById(`g01_img`).src = `./img/an_off.png`
  }
});

//// HẸN GIỜ BẬT ĐÈN CHO AN

//// HẸN GIỜ CHO ĂN TRƯỚC NÈ

// Hàm lưu thời gian hẹn giờ lên Firebase
function setWeeklyTimers() {
  var weeklyTimers = {
    monday: {
      bắt_đầu: document.getElementById("t2on").value,
      kết_thúc: document.getElementById("t2off").value
    },
    tuesday: {
      bắt_đầu: document.getElementById("t3on").value,
      kết_thúc: document.getElementById("t3off").value
    },
    wednesday: {
      bắt_đầu: document.getElementById("t4on").value,
      kết_thúc: document.getElementById("t4off").value
    },
    thursday: {
      bắt_đầu: document.getElementById("t5on").value,
      kết_thúc: document.getElementById("t5off").value
    },
    friday: {
      bắt_đầu: document.getElementById("t6on").value,
      kết_thúc: document.getElementById("t6off").value
    },
    saturday: {
      bắt_đầu: document.getElementById("t7on").value,
      kết_thúc: document.getElementById("t7off").value
    },
    sunday: {
      bắt_đầu: document.getElementById("t8on").value,
      kết_thúc: document.getElementById("t8off").value
    }
  };
  
  // Kiểm tra xem tất cả các ngày đã được nhập thời gian hay chưa
  for (var day in weeklyTimers) {
    if (!weeklyTimers[day].bắt_đầu || !weeklyTimers[day].kết_thúc) {
      alert("Vui lòng nhập đầy đủ thời gian cho tất cả các ngày.");
      return;
    }
  }
  
  // Lưu dữ liệu lên Firebase
  database.ref("/THUC AN/HEN GIO CHO AN").set(weeklyTimers)
    .then(() => {
      alert("Hẹn giờ đã được lưu thành công!");
    })
    .catch((error) => {
      console.error("Lỗi khi lưu dữ liệu: ", error);
    });
  }
  // Hàm lấy dữ liệu thời gian từ Firebase và hiển thị lên form
  function loadWeeklyTimers() {
  database.ref("/THUC AN/HEN GIO CHO AN").once('value').then((snapshot) => {
    var timers = snapshot.val();
    
    if (timers) {
      document.getElementById("t2on").value = timers.monday.bắt_đầu || "";
      document.getElementById("t2off").value = timers.monday.kết_thúc || "";
  
      document.getElementById("t3on").value = timers.tuesday.bắt_đầu || "";
      document.getElementById("t3off").value = timers.tuesday.kết_thúc || "";
  
      document.getElementById("t4on").value = timers.wednesday.bắt_đầu || "";
      document.getElementById("t4off").value = timers.wednesday.kết_thúc || "";
  
      document.getElementById("t5on").value = timers.thursday.bắt_đầu || "";
      document.getElementById("t5off").value = timers.thursday.kết_thúc || "";
  
      document.getElementById("t6on").value = timers.friday.bắt_đầu || "";
      document.getElementById("t6off").value = timers.friday.kết_thúc || "";
  
      document.getElementById("t7on").value = timers.saturday.bắt_đầu || "";
      document.getElementById("t7off").value = timers.saturday.kết_thúc || "";
  
      document.getElementById("t8on").value = timers.sunday.bắt_đầu || "";
      document.getElementById("t8off").value = timers.sunday.kết_thúc || "";     
    }
  });
  }
  
  // Hàm kiểm tra thời gian hiện tại với thời gian đã hẹn
  function checkLightStatus() {
    if (!manualSet1) {
     console.log(coDangTrongHenGioChoAn)
     var currentTime = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
     var currentDay = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Lấy thứ hiện tại
 
     database.ref("/THUC AN/HEN GIO CHO AN/" + currentDay).once('value').then((snapshot) => {
       var timers = snapshot.val();
 
       if (timers && currentTime >= timers.bắt_đầu && currentTime < timers.kết_thúc) {
         document.getElementById("g01_img").src = "img/an_on.png";  // ăn sáng
         document.getElementById("deviceStatus").innerText = "ĐANG CHO GÀ ĂN TỰ ĐỘNG";
         firebase.database().ref("/THUC AN").update({
           "CHO AN": "ON"
         });
         coDangTrongHenGioChoAn = true;
 
       } else {
         document.getElementById("g01_img").src = "img/an_off.png";  // Đèn tắt
         document.getElementById("deviceStatus").innerText = "NGƯNG CHO GÀ ĂN TỰ ĐỘNG!";
         firebase.database().ref("/THUC AN").update({
           "CHO AN": "OFF"
         });
         coDangTrongHenGioChoAn = false;
       }
     });
  }
 }
  // ĐỘ CHẾ
document.getElementById("cancelScheduleButton1").onclick = cancelWeeklyTimers1;

// Hàm hủy hẹn giờ
function cancelWeeklyTimers1() {
  // Xóa dữ liệu hẹn giờ trong Firebase
  database.ref("/THUC AN/HEN GIO CHO AN").remove()
    .then(() => {
      alert("Đã hủy hẹn giờ thành công!");
      // Cập nhật giao diện người dùng để xóa thời gian hẹn giờ
      clearWeeklyTimersForm1();
    })
    .catch((error) => {
      console.error("Lỗi khi hủy hẹn giờ: ", error);
    });
}

// Hàm xóa nội dung của form hẹn giờ
function clearWeeklyTimersForm1() {
  document.getElementById("t2on").value = "";
  document.getElementById("t2off").value = "";

  document.getElementById("t3on").value = "";
  document.getElementById("t3off").value = "";

  document.getElementById("t4on").value = "";
  document.getElementById("t4off").value = "";

  document.getElementById("t5on").value = "";
  document.getElementById("t5off").value = "";

  document.getElementById("t6on").value = "";
  document.getElementById("t6off").value = "";

  document.getElementById("t7on").value = "";
  document.getElementById("t7off").value = "";

  document.getElementById("t8on").value = "";
  document.getElementById("t8off").value = "";

  firebase.database().ref("/THUC AN").update({
    "CHO AN": "OFF"
  });
}
  
  // Gọi hàm kiểm tra trạng thái đèn mỗi giây
  setInterval(checkLightStatus, 1000);
  //// Gọi hàm kiểm tra trạng thái đèn mỗi giây
  setInterval(checkLightStatus_1, 1000);
  // Hàm cập nhật trạng thái thiết bị từ Firebase
  function updateDeviceStatus() {
  var statusRef = database.ref("/THUC AN/HEN GIO CHO AN");
  
  statusRef.on('value', (snapshot) => {
    var status = snapshot.val();
    document.getElementById("deviceStatus").innerText = status;
  });
  }
  
 
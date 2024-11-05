// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMTtzh_B9KEeXZuMTKxfNVG7zI71HFZuY",
  authDomain: "do-an-2-chan-nuoi-ga.firebaseapp.com",
  projectId: "do-an-2-chan-nuoi-ga",
  storageBucket: "do-an-2-chan-nuoi-ga.appspot.com",
  messagingSenderId: "502685498185",
  appId: "1:502685498185:web:74f42391d5de190a577898"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

let coDangTrongHenGioChoAn = false;
let coDangTrongHenGioChieuSang = false;
















//CHẤT LƯỢNG KHÔNG KHÍ ............................................................................

//đọc không khí
database.ref("/CHAT LUONG KHONG KHI/KHONG KHI").on("value",function(snapshot){
  var kk = snapshot.val();  
  document.getElementById("khongkhi").innerHTML = kk;
  console.log(kk);
});

// QUẠT HÚT
var q02_on = document.getElementById("q02_on");
var q02_off = document.getElementById("q02_off");

     
database.ref("/CHAT LUONG KHONG KHI").get().then((snapshot) => {
  if(snapshot.exists()){
    console.log(snapshot.val())

    var quat_02_status = snapshot.val()
    if (quat_02_status["QUAT HUT"] == "ON")
      document.getElementById("q02_img").src ="./img/quat_on.png"
    else
      document.getElementById("q02_img").src = "./img/quat_off.png"
  }
  else
    console.log("No data available!")
})

q02_on.onclick = function(){
    document.getElementById("q02_img").src = "./img/quat_on.png"
    
    firebase.database().ref("/CHAT LUONG KHONG KHI").update({
    "QUAT HUT": "ON"
  })
}
q02_off.onclick = function(){
    document.getElementById("q02_img").src = "./img/quat_off.png"
    
  firebase.database().ref("/CHAT LUONG KHONG KHI").update({
        "QUAT HUT": "OFF"
    })
}

//TUONG TÁC NGƯỢC LẠI FIREBASE VÀ WEB
database.ref("/CHAT LUONG KHONG KHI/QUAT HUT").on("value", function (snapshot) {
  let ledState = snapshot.val();
  if (ledState == "ON")
    document.getElementById(`q02_img`).src = `./img/quat_on.png`
  else
    document.getElementById(`q02_img`).src = `./img/quat_off.png`
});



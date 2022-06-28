const firebaseConfig = {
    apiKey: "AIzaSyDV7Lzi4kwbV_F_iao3YZHALg23GEfn1lg",
    authDomain: "spo2trackerlogin.firebaseapp.com", 
    databaseURL: "https://spo2trackerlogin-default-rtdb.firebaseio.com",
    projectId: "spo2trackerlogin",
    storageBucket: "spo2trackerlogin.appspot.com",
    messagingSenderId: "1030568387976",
    appId: "1:1030568387976:web:d5308f441fbf8962e3863d"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebase.database()


window.onload = function(){
    
    
    
    
    var dbref = database.ref();

    console.log(1);
    dbref.child('values/'+ 1).get().then((snapshot)=>{
      var data = snapshot.val();
      for(let d in data){
        console.log(d)
        for (values in data[d]){
          console.log(data[d][values])
        }
        console.log("___________");
      }
    })
  }
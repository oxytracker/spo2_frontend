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
var PERSON_ID = null
var PERSON_EMAIL = null
var PERSON_NAME = null

function register () {
  name = document.getElementById('name').value
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  confpassword = document.getElementById('confpassword').value

  if (validate_email(email) == false) {
    alert('Email is incorrect!!')
    return
  }
  if(validate_password(password,confpassword)==false){
    alert('Password not same !!')
    return
  }

  const occup = checkOccupation();
  if(occup ==false){
    alert('not selcted')
    return
  }else{
    selectedOcc =  occup
  }
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {

    var user = auth.currentUser
    var database_ref = database.ref()

    var user_data = {
      name : name,
      email : email,
      occupation: selectedOcc,
      last_login : Date.now()
    }

    database_ref.child('login/'+selectedOcc + '/' + name).set(user_data)

    alert('User Created!!')
  })
  .catch(function(error) {
    var error_code = error.code
    var error_message = error.message
    alert(error_message)
  })
}

function login(){
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  if (validate_email(email) == false ) {
    alert('Email or Password is Outta Line!!')
    return
  } else{
    personEmail = email
  }


  auth.signInWithEmailAndPassword(email,password)
  .then(function(){
    var user = auth.currentUser
    var database_ref = database.ref()



    if (user != null) {
      // The user object has basic properties such as display name, email, etc.
      // const PERSON_NAME = user.name;
      PERSON_EMAIL = user.email;

      // console.log(PERSON_EMAIL);
      // console.log(name);

    }

    console.log(PERSON_EMAIL);

    var dbref = database.ref();
    // var email = 'tpat2@mail.com'
    var patientOcc = null
    var occup = checkOccupation();
    dbref.child('login/'+occup).get().then((snapshot)=>{
      var data = snapshot.val();
      for(let d in data){
            PERSON_NAME = data[d].name
        if(data[d].email== PERSON_EMAIL){
          patientOcc = data[d].occupation
          if(patientOcc=="doctor"){
            window.location.href = 'doctor.html';
          }else if(patientOcc == "patient"){
            console.log(PERSON_NAME);
            dbref.child('personID').set(PERSON_NAME)
            setTimeout(function(){
            window.location.href= 'patient.html'
            },2000)
          }else if(patientOcc == "nurse"){
            window.location.href = 'nurse-form.html'
          }else{
            alert("invalid! try again ")
          }
          // console.log(patientID);
        }
      }
    })
    var user_data = {
      last_login : Date.now()
    }

    // database_ref.child('users/' + user.uid).update(user_data)

    // alert('User Logged In!!  '+ name)
  })
  .catch(function(error){
    var error_code = error.code
    var error_message = error.message
    alert(error_message)
  })

}

function table2(){
  var database_ref = database.ref()
  var data
  var data1
  name = document.getElementById('name').value
  patientID = document.getElementById('patientID').value
  var user_ref = database.ref('login/patient/'+name)
  user_ref.on('value',function(snapshot) {
    data = snapshot.val()
    console.log(data);

    // database_ref.child('table2/'+data.name).set(data)
  })
  var user_ref1 = database.ref('table3/'+patientID)
  user_ref1.on('value',function(snapshot) {
    data1 = snapshot.val()
    console.log(data1);
  })

  var table2_data = {
    name : data.name,
    email : data.email,
    patientID : data1.patientID,
  }
  database_ref.child('table2/'+data.name).set(table2_data)
  alert("user added")

}

function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    return true
  } else {
    return false
  }
}

function validate_password(password,confpassword){
    if(password == confpassword){
      return true
    }else{
      return false
    }
}

function checkOccupation(){
  const radioButtons = document.querySelectorAll('input[name="occ"]');
  let occup
  for(const radioButton of radioButtons){
    if(radioButton.checked){
      occup= radioButton.value;
      return occup
    }
  }
  return false
}


function getPerson(){
  /*
  1. Get's the person who is actually signed in if single user
  2. For doctor, get's the person as per drop down menu
  */

}


const getPatientId = async(patientID)=>{
  var dbref = database.ref();
  console.log(patientID);
  dbref.child('values/'+ patientID).get().then((snapshot)=>{
    var data = snapshot.val();
    for(let d in data){
      for (values in data[d]){
        console.log(data[d][values])
      }
        console.log("___________");
      }
    })
  }

function doctorCalled() {
      var dbref = database.ref();
      var values = []
      dbref.child('table2/').get().then((snapshot)=>{
        var data = snapshot.val();
        // console.log(data);
        for(let d in data){
          values.push(d)
        }
      })
      setTimeout(function(){
        console.log(values);
      for(const val of values){
        const aa = document.createElement("li");
        const bb = document.createElement("button")
        bb.innerText = val
        bb.classList.add("dropdown-item");
        bb.setAttribute("id",val)
        bb.setAttribute("onclick","chart(this.id)")
        document.getElementById("dropdown-list").appendChild(aa).appendChild(bb);
      }
      }, 3000);

  }


function chart(name){
  var dbref = database.ref();
  var patID = null
  var values = null
  var arrval =[]
  dbref.child('table2/'+name).get().then((snapshot)=>{
    var data = snapshot.val();
    patID = data.patientID;
    console.log(patID);
  })
  setTimeout(function(){

  dbref.child('values/'+patID).get().then((snapshot)=>{
    values = snapshot.val();
  })

  setTimeout(function(){
    arrval.push(values);
    var spo2_data= [];
    var bpm_data= [];
    var time_data= [];
    arrval.filter(item =>{
      iterateObject(item)
    });
    function iterateObject(obj){
      for(prop in obj){
          if(typeof(obj[prop])=="object"){
            iterateObject(obj[prop]);
          }else{
            if(prop=="spo2"){
              spo2_data.push(obj[prop])
            }
            if(prop=="bpm"){
              bpm_data.push(obj[prop])
            }
            if(prop=="timestamp"){
              time_data.push(obj[prop])
            }
          }
      }
    }
    console.log(spo2_data,bpm_data,time_data);
    let options1 = {
            type: 'line',
            data: {
                    labels: time_data,
                    datasets: [{
                            label: "time vs Spo2",
                            data: spo2_data,
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            borderColor: '#E98580'
                    }]
            },
            options: {
                    scales: {
                            x: {
                                    display: true,
                                    title: {
                                            display: false,
                                            text: 'Time',
                                            font: {
                                                    family: 'Raleway',
                                                    size: 20,
                                                    weight: 'bold',
                                                    lineHeight: 1.2,
                                            },
                                            padding: { top: 20, left: 0, right: 0, bottom: 0 }
                                    }
                            },
                            y: {
                                    display: true,
                                    suggestedMin: 80,
                                    title: {
                                            display: true,
                                            text: 'SPO2',
                                            font: {
                                                    family: 'Raleway',
                                                    size: 20,
                                                    style: 'normal',
                                                    lineHeight: 1.2
                                            },
                                            padding: { top: 30, left: 0, right: 0, bottom: 0 }
                                    }
                            }
                    },
                    animation: {
                                    duration: 0
                            }
            },
    };

    let options2 = {
            type: 'line',
            data: {
                    labels: time_data,
                    datasets: [{
                            label: "time vs bpm",
                            data: bpm_data,
                            fill: false,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                            borderColor: '#ECD662'
                    }]
            },
            options: {
                    scales: {
                            x: {
                                    display: true,
                                    title: {
                                            display: false,
                                            text: 'Time',
                                            font: {
                                                    family: 'Raleway',
                                                    size: 20,
                                                    weight: 'bold',
                                                    lineHeight: 1.2,
                                            },
                                            padding: { top: 20, left: 0, right: 0, bottom: 0 }
                                    }
                            },
                            y: {
                                    display: true,
                                    suggestedMin: 50,
                                    title: {
                                            display: true,
                                            text: 'BPM',
                                            font: {
                                                    family: 'Raleway',
                                                    size: 20,
                                                    style: 'normal',
                                                    lineHeight: 1.2
                                            },
                                            padding: { top: 30, left: 0, right: 0, bottom: 0 }
                                    }
                            }
                    },
                    animation: {
                                    duration: 0
                            }
            },
    };
    let chart1 = new Chart(document.getElementById('canvas1'), options1);

    let chart2 = new Chart(document.getElementById('canvas2'), options2);

    document.getElementById("clear").addEventListener("click",function(){
      chart1.destroy();
      chart2.destroy()
    })
  },1000)

  },500);
}



function patchart(){
  var dbref = database.ref()
  var name= null
  dbref.child('personID').get().then((snapshot)=>{
    name = snapshot.val()
  })
  setTimeout(function(){
    var patID = null
    var values = null
    var arrval =[]
    dbref.child('table2/'+name).get().then((snapshot)=>{
      var data = snapshot.val();
      patID = data.patientID;
      console.log(patID);
    })
    setTimeout(function(){
    const aa = document.createElement("h2")
    aa.innerText = "Hello "+ name;
    document.getElementById("welcome").appendChild(aa)
    dbref.child('values/'+patID).get().then((snapshot)=>{
      values = snapshot.val();
    })

    setTimeout(function(){
      arrval.push(values);
      var spo2_data= [];
      var bpm_data= [];
      var time_data= [];
      arrval.filter(item =>{
        iterateObject(item)
      });
      function iterateObject(obj){
        for(prop in obj){
            if(typeof(obj[prop])=="object"){
              iterateObject(obj[prop]);
            }else{
              if(prop=="spo2"){
                spo2_data.push(obj[prop])
              }
              if(prop=="bpm"){
                bpm_data.push(obj[prop])
              }
              if(prop=="timestamp"){
                time_data.push(obj[prop])
              }
            }
        }
      }
      console.log(spo2_data,bpm_data,time_data);
      let options1 = {
              type: 'line',
              data: {
                      labels: time_data,
                      datasets: [{
                              label: "time vs Spo2",
                              data: spo2_data,
                              fill: false,
                              pointRadius: 0,
                              pointHoverRadius: 0,
                              borderColor: '#E98580'
                      }]
              },
              options: {
                      scales: {
                              x: {
                                      display: true,
                                      title: {
                                              display: false,
                                              text: 'Time',
                                              font: {
                                                      family: 'Raleway',
                                                      size: 20,
                                                      weight: 'bold',
                                                      lineHeight: 1.2,
                                              },
                                              padding: { top: 20, left: 0, right: 0, bottom: 0 }
                                      }
                              },
                              y: {
                                      display: true,
                                      suggestedMin: 80,
                                      title: {
                                              display: true,
                                              text: 'SPO2',
                                              font: {
                                                      family: 'Raleway',
                                                      size: 20,
                                                      style: 'normal',
                                                      lineHeight: 1.2
                                              },
                                              padding: { top: 30, left: 0, right: 0, bottom: 0 }
                                      }
                              }
                      },
                      animation: {
                                      duration: 0
                              }
              },
      };

      let options2 = {
              type: 'line',
              data: {
                      labels: time_data,
                      datasets: [{
                              label: "time vs bpm",
                              data: bpm_data,
                              fill: false,
                              pointRadius: 0,
                              pointHoverRadius: 0,
                              borderColor: '#ECD662'
                      }]
              },
              options: {
                      scales: {
                              x: {
                                      display: true,
                                      title: {
                                              display: false,
                                              text: 'Time',
                                              font: {
                                                      family: 'Raleway',
                                                      size: 20,
                                                      weight: 'bold',
                                                      lineHeight: 1.2,
                                              },
                                              padding: { top: 20, left: 0, right: 0, bottom: 0 }
                                      }
                              },
                              y: {
                                      display: true,
                                      suggestedMin: 50,
                                      title: {
                                              display: true,
                                              text: 'BPM',
                                              font: {
                                                      family: 'Raleway',
                                                      size: 20,
                                                      style: 'normal',
                                                      lineHeight: 1.2
                                              },
                                              padding: { top: 30, left: 0, right: 0, bottom: 0 }
                                      }
                              }
                      },
                      animation: {
                                      duration: 0
                              }
              },
      };
      let chart1 = new Chart(document.getElementById('canvas1'), options1);

      let chart2 = new Chart(document.getElementById('canvas2'), options2)
    },1000)

    },500);

  },2000)
}

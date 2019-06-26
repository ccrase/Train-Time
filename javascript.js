//$(document).ready(function () {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCu3TmOx32P7nj2P1lW-u9mTiKgrHKCvkA",
    authDomain: "test-project-21c2a.firebaseapp.com",
    databaseURL: "https://test-project-21c2a.firebaseio.com",
    projectId: "test-project-21c2a",
    storageBucket: "test-project-21c2a.appspot.com",
    messagingSenderId: "332271622227",
    appId: "1:332271622227:web:6c1b5cbb4874911c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  //intialize variables
  let tName;
  let tDestination;
  let tFrequency;
  let tNextArrival = 0;
  let tMinutesAway = 0;
  let name;
  let destination;
  let firstTrain;
  let frequency;


  $("#submit").on("click", function (event) {
    event.preventDefault();
    name = $("#train-name").val();
    destination = $("#destination").val();
    firstTrain = $("#first-train").val();
    frequency = $("#frequency").val();

    $(".form-control").val("");
    //set the values in the database
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

  database.ref().on("value", function (snapshot) {
    $(".schedule-data").empty();
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      tName = childData.name;
      tDestination = childData.destination;
      tFrequency = childData.frequency;
      
      //collect current time
      var currentTime = moment();
      //convert time backwards 
      var convertFirstTime = moment(childData.firstTrain, "HH:mm").subtract(1, "years");
      //difference between times 
      var difference = currentTime.diff(moment(convertFirstTime), "minutes");
      console.log("the difference is: " + difference);
      //time apart
      var timeRemainder = difference % tFrequency;
      //minutes until train 
      var minutesTilTrain = tFrequency - timeRemainder;
      console.log("minutes until next train" + minutesTilTrain);
      //next train
      var nextTrain = currentTime.add(minutesTilTrain, "minutes");
      nextTrain = moment(nextTrain).format("hh:mm");
      console.log(nextTrain);



      $(".schedule-data").append("<tr><td>" + tName +
        "</td><td>" + tDestination +
        "</td><td>" + tFrequency +
        "</td><td>" + nextTrain +
        "</td><td>" + minutesTilTrain +
        "</td></tr>");

    });
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

//});

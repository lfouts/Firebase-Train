$(document).ready(function(){

var config = {
    apiKey: "AIzaSyC1D53pyEMm-o2N2Z8qV8aHDjRhuwD_ZmY",
    authDomain: "train-2346f.firebaseapp.com",
    databaseURL: "https://train-2346f.firebaseio.com",
    projectId: "train-2346f",
    storageBucket: "train-2346f.appspot.com",
    messagingSenderId: "981968047980"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  // Initial Values
  var trainName = "";
  var destination = "";
  var frequency = 0;
  var firstArrival = "";
  var nextArrival = "";
  var minutesAway = "";

  $("#submit").on("click", function(event) {
    event.preventDefault();
console.log("hello");
    // Grabbed values from text boxes
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstArrival = $("#first-arrival-input").val().trim();


    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstArrival: firstArrival,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

  });

  database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

    var sv = snapshot.val();

    var newRow = $("<tr>");
    var trainNameCell = $("<td>").text(sv.trainName);
    var destinationCell = $("<td>").text(sv.destination);
    var frequencyCell = $("<td>").text(sv.frequency);
    var firstArrivalCell= $("<td>").text(sv.firstArrival);


    $(newRow).append(trainNameCell);
    $(newRow).append(destinationCell);
    $(newRow).append(frequencyCell);
    $(newRow).append(firstArrival);


    var firstTimeConverted = moment(sv.firstArrival, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    var tRemainder = diffTime % sv.frequency;
    console.log(tRemainder);
    var tMinutesTillTrain = sv.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var nextTrainCell= $("<td>").text(nextTrain);
    var minutesTillTrain= $("<td>").text(tMinutesTillTrain);

    $(newRow).append(nextTrainCell);
    $(newRow).append(minutesTillTrain);

    $("#currentTrain").append(newRow);

  });
});

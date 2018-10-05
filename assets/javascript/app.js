// Initialize Firebase
var config = {
    apiKey: "AIzaSyCM979EPYelDC5jjWU4u3KfcZLY5noG6hY",
    authDomain: "train-bootstrap-2.firebaseapp.com",
    databaseURL: "https://train-bootstrap-2.firebaseio.com",
    projectId: "train-bootstrap-2",
    storageBucket: "train-bootstrap-2.appspot.com",
    messagingSenderId: "531124418432"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database ();
// refined function to append to the table
function appendTableRow (name, destination, frequency, nextTrain, minsAway) {
    var newTableRow = $('<tr>')
        .append($('<td>').text(name))
        .append($('<td>').text(destination))
        .append($('<td>').text(frequency))
        .append($('<td>').text(nextTrain))
        .append($('<td>').text(minsAway))
    $('#tbody').append(newTableRow);
}
function calculateTime (firstTrain, frequency) {
    var militaryTime = 'HH:mm';
    // substracts one year so ints in the past
    firstTrain = moment(firstTrain, militaryTime).subtract(1, 'years');
    // difference between current time and first train in minutes
    var diffTime = moment().diff(moment(firstTrain), 'minutes');
    // remaining time
    var tRemainder = diffTime % frequency;
    // frequency
    var minsAway = frequency - tRemainder;
    // calculates the next train and displays it in militaryTime
    var nextTrain = moment().add(minsAway, 'minutes');
    nextTrain = moment(nextTrain).format(militaryTime)
    //Returns two vars
    return [nextTrain, minsAway];
}
// ????
$(document).ready( function () {
    // submits the information to firebase
    $('#train-form').submit( function (event) {
        event.preventDefault();
        name = $('#train-name').val().trim();
        destination = $('#destination').val().trim();
        firstTrain = $('#first-train').val().trim();
        frequency = $('#frequency').val().trim();
        database.ref().push({
            name,
            destination,
            firstTrain,
            frequency
        })
        $('input').val('');
    })
    // creates children for each submition
    database.ref().on('child_added', function (snapshot) {
        var name = snapshot.val().name;
        var destination = snapshot.val().destination;
        var firstTrain = snapshot.val().firstTrain;
        var frequency = snapshot.val().frequency;
        // momentJS Calcs
        var time = calculateTime(firstTrain, frequency);
        // returned values from the fuction
        var nextTrain = time[0];
        var minsAway = time[1];
        // appends everything together
        appendTableRow(name, destination, frequency, nextTrain, minsAway);
    })
})
    setInterval( function () {
        $('#tbody').empty();
        database.ref().on('child_added', function (snapshot) {
            var name = snapshot.val().name;
            var destination = snapshot.val().destination;
            var firstTrain = snapshot.val().firstTrain;
            var frequency = snapshot.val().frequency;
            // momentJS Calcs
            var time = calculateTime(firstTrain, frequency);
            // returned values from the fuction
            var nextTrain = time[0];
            var minsAway = time[1];
            // appends everything together
            appendTableRow(name, destination, frequency, nextTrain, minsAway);
        })     
    }, 60000)

$('#title').addClass('animated shake');
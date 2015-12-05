

// var weight = '';
// var score = '';
var max_event = 6;

if (Meteor.isClient){

  Template.inputfields.events({
    'submit form': function(form) {
      form.preventDefault();

      var totalWeight =  parseInt(document.forms["myForm"]["weight1"].value) +  parseInt(document.forms["myForm"]["weight2"].value) +  parseInt(document.forms["myForm"]["weight3"].value) + parseInt(document.forms["myForm"]["weight4"].value) +  parseInt(document.forms["myForm"]["weight5"].value);

      document.getElementById("showMe").innerHTML = totalWeight;

      if (isNaN(totalWeight)) {
        document.getElementById("showMe").innerHTML = "Each assignment must have a weight, please add the weight of each score";
      }
      else if (totalWeight < 100) {
        document.getElementById("showMe").innerHTML = "Sorry, your total weight is less than 100% (total weight must equal 100%)";
      }
      else if(totalWeight > 100) {
        document.getElementById("showMe").innerHTML = "Sorry, your total weight is greater than 100% (total weight must equal 100%)";
      }
      else {
        var gscore = new Array(max_event);
        var gweight = new Array(max_event);
        var tempScore = parseInt(document.forms["myForm"]["score1"].value);
        var tempWeight = parseInt(document.forms["myForm"]["weight1"].value);;
        var gpa = tempScore * tempWeight;

        for (var i = 1; i < max_event; i++) {
          gscore[i] = "score" + i.toString();
          gweight[i] = "weight" + i.toString();
        }

        for (var i = 2; i < max_event; i++) {
            tempScore = parseInt(document.forms["myForm"][gscore[i]].value);
            tempWeight = parseInt(document.forms["myForm"][gweight[i]].value);
            gpa = gpa + (tempScore * tempWeight);
        }

        gpa = gpa / 100;

        document.getElementById("showMe").innerHTML = gpa.toString() + "%";

      }
    } // function

  });

}
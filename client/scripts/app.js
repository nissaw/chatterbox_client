// YOUR CODE HERE:
//The URL you should be using is https://api.parse.com/1/classes/chatterbox
//create a separate button to add room, prompt for room name anfdi add
/////////////////////ESCAPE FUNCTION/////////////////////////////////
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

var escapeHtml = function(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

/////////////////////INSERT MESSAGE/////////////////////////////////

var insertMessage = function() {
  var getUsername = function() {
    var arrayOfUsername = window.location.search.split("");
    var result = arrayOfUsername.slice(10,arrayOfUsername.length).join("");
    return result;
  };
  var getText = function() {
    return escapeHtml($('form #newmessage').val());
  };
  var Message = function() {
    this.username = getUsername();
    this.text = getText();
    //need to edit this to get currently viewing room
    this.roomname = '4chan';
  };
  var message = new Message();
  
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message. Error: ', data);
    }
  });
};

//////////////////MESSAGE/ROOM UPDATE//////////////////////////////////
// var currentData = {};
setInterval(function() {
$.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
  type: 'GET',
  contentType: 'application/json',
  success: function(data) {
    getUpdates(data); 
    currentData = data;
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to retrieve message. Error: ', data);
  }
});
},1000);

var getUpdates = function(data) {
  $('#posts').empty();
  $('#rooms').empty();
  // data.results = an array of objects that contain roomname, username
  // manipulate the data (possibly assign it to a new variable ) by checking for the roomname
  var rooms = {};
  for (var i = 0; i < data.results.length; i++) {
        var room = escapeHtml(data.results[i].roomname);
        var user = escapeHtml(data.results[i].username);
        var message = escapeHtml(data.results[i].text);
        $('#posts').append($('<p class =""' + user + '">' + user + '</p>'));
        $('#posts').append($('<div class="messages">' + message + '</div>'));
        rooms[room] = true;
  }
  //add room function 
  for (var key in rooms) {
    $('#rooms').append($('<option id="' + key + '" value= "' + key + '">' + key + '</option>'));
  }
   $('#rooms').append($('<option id=createNewRoom>Create A New Room</option>'));
}
//////////////////UPDATING ROOM SELECTION//////////////////////////////////
//when click on room name, clear messages and post message with room names as property
//loop over the #rooms (contains all selection) and apply functionality all of the rooms in there 
//on click, getUpdates with new rooms as constraints 
// $(option).click(function() {
//   this 
// })
// currentDate[room] === requested room


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

  var getRoom = function(){
  return escapeHtml($('#rooms').val());
};

  var Message = function() {
    this.username = getUsername();
    this.text = getText();
    this.roomname = getRoom();
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
  setTimeout(getMessages, 500);
};

//////////////////MESSAGE UPDATE//////////////////////////////////
var currentData;
var getMessages = function(param) {  // getMessages(roomname)

  if (param === undefined){
    param = 'order=-createdAt'
  }

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox?' + param,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      getRooms(data);
      currentData = data.results;
      switchRoom();//displayMessages(data); 
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message. Error: ', data);
    }
  });
};

setTimeout(getMessages, 500); 


//////////////////UPDATING ROOM SELECTION//////////////////////////////////
var switchRoom = function() {
  // console.log("You are switching rooms");
   $('#posts').empty();

    var room = escapeHtml($('#rooms').val());
    // console.log(room);
    if (room === 'Create A New Room') {
      createNewRoom();
    } else if (room === "Main Room") {
      for (var i = 0; i < currentData.length; i++) {
        var messageObj = currentData[i];
        var user = escapeHtml(messageObj.username);
        var message = escapeHtml(messageObj.text);
        $('#posts').append($('<p class="users" id ="' + user + '" >' + user + '</p>'));
        $('#posts').append($('<div class="messages" id ="' + user + '">' + message + '</div>'));
      }
    } else {
      for ( var i = 0; i < currentData.length; i++ ){
        var messageObj = currentData[i];
        if (messageObj.roomname === room){
          var user = escapeHtml(messageObj.username);
          var message = escapeHtml(messageObj.text);
          $('#posts').append($('<p class="users" id ="' + user + '" >' + user + '</p>'));
          $('#posts').append($('<div class="messages" id ="' + user + '">' + message + '</div>'));

        }
      }
    }
  };

  var createNewRoom = function() {
    var newRoomName = escapeHtml(prompt("What do you want to name your Room? Reminder: Your room wont be added until you initiate a conversation."));
    $('#rooms').prepend($('<option id="' + newRoomName + '" value= "' + newRoomName + '">' + newRoomName + '</option>'));
  };
///// POPULATES THE DROPDOWN WITH ALL AVAILABLE ROOMS///////////
var getRooms = function(data) {
  $('#rooms').empty();
  var rooms = {};
  for (var i = 0; i < data.results.length; i++) {
        var room = escapeHtml(data.results[i].roomname);
        rooms[room] = true;
  }
  $('#rooms').append($('<option id=mainroom>Main Room</option>'));
  for (var key in rooms) {
    $('#rooms').append($('<option id="' + key + '" value= "' + key + '">' + key + '</option>'));
  }
   $('#rooms').append($('<option id=createNewRoom>Create A New Room</option>'));
};

$(function() {
  $("#posts").on('click', 'p', function() {
      var user = $(this).attr('id');
      $('#posts #' + user ).addClass('friends');
  });
});



// outstanding issues
  //submit sends you back to main room... doesn't keep you in same place
  

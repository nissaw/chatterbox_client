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
    console.log(this.roomname)
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

var switchRoom = function() {
  console.log("You are switching rooms");
   $('#posts').empty();

    var room = escapeHtml($('#rooms').val());
    console.log(room);

    for ( var i = 0; i < currentData.length; i++ ){
      var messageObj = currentData[i];
      if (messageObj.roomname === room){
        var user = messageObj.username;
        var message = messageObj.text;
        $('#posts').append($('<p class =""' + user + '">' + user + '</p>'));
        $('#posts').append($('<div class="messages">' + message + '</div>'));

      }
    }
  };
   


// var displayMessages = function(data) {
//   $('#posts').empty();

//   if (escapeHtml($('#rooms').val()) === "Main Room") {
//     for (var i = 0; i < data.results.length; i++) {
//           var user = escapeHtml(data.results[i].username);
//           var message = escapeHtml(data.results[i].text);
//           $('#posts').append($('<p class =""' + user + '">' + user + '</p>'));
//           $('#posts').append($('<div class="messages">' + message + '</div>'));
//     } 
//   } else {
//     var currentRoom = escapeHtml($('#rooms').val());
//     console.log(currentRoom);
//     for (var i = 0; i < data.results.length; i++) { 
//       console.log(data.results[i].roomname);
//       if (data.results[i].roomname === currentRoom) {
//         var user = escapeHtml(data.results[i].username);
//         var message = escapeHtml(data.results[i].text);
//         $('#posts').append($('<p class =""' + user + '">' + user + '</p>'));
//         $('#posts').append($('<div class="messages">' + message + '</div>'));
//       }
//     }
//   }
// };




//////////////////UPDATING ROOM SELECTION//////////////////////////////////
//when click on room name, clear messages and post message with room names as property
//loop over the #rooms (contains all selection) and apply functionality all of the rooms in there 
//on click, getUpdates with new rooms as constraints 
// $(option).click(function() {
//   this 
// })
// currentDate[room] === requested room
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



// var switchRoom = function() {
//   alert("switched room!");
// }

//option onclick
//get current room variable like above
//fix update messages to check for room
//execute getMessages 
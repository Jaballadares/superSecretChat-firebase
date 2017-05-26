// Reveal secret login
$('.top-bar_chat').on('click', function() {
  $('.loginBox').slideToggle();
});

$('.circles').on('click', function() {
  $('.chatModule').removeClass('hide');
  // replace circles with chatModule
  $(this).replaceWith($('.chatModule'));
});



// FIREBASE CODE
var theMessages = new Firebase("https://supersecretchatapp.firebaseio.com/messages");

var users = new Firebase("https://supersecretchatapp.firebaseio.com/users");

$('.signIn').click(function() {
  var name = $('.name').val();
  var chatter = users.push({
    name: name
  });
  var postUsers = chatter.key();
  theMessages.authWithPassword({
    email: $('.email').val(),
    password: $('.pwd').val()
  }, authHandler);
});

$('.pwd').on('keypress', function(event) {
  if (event.which == 13 || event.keyCode == 13) {
    var name = $('.name').val();
    var chatter = users.push({
      name: name
    });
    var postUsers = chatter.key();
    // theMessages.set({name : name});
    theMessages.authWithPassword({
      email: $('.email').val(),
      password: $('.pwd').val()
    }, authHandler);
  }
});

function authHandler(error, authData) {
  if (error) {
    $('.loginBox').append("<span class='oops'>" + "Try Again" + "</span>");
  } else {
    // me = authData;
    $('.loginBox input').hide();
    $('.loginBox').append("<span class='signedIn'>" + "Logged In" + "</span>").fadeOut("slow");
  }
}

$('.typedMessage').on('keypress', function(event) {
  if (event.which == 13 || event.keyCode == 13) {
    var newMessage = $('.typedMessage').val();
    saveToFB(newMessage);
    $('.typedMessage').val("");
    return false;
  }
});

$('.sendMessage').on('click', function() {
  var newMessage = $('.typedMessage').val();
  saveToFB(newMessage);
  $('.typedMessage').value = '';
  return false;
});

function saveToFB(newMessage) {
  if (newMessage.length !== 0) {
    theMessages.push({
      message: newMessage,
      creator: theMessages.getAuth().uid,
      user: $('.name').val()
    });
  }
}

theMessages.on("child_added", function(snapshot) {
  var data = snapshot.val();
  console.log("Message " + data.creator);
  if (data.creator === "simplelogin:6") {
    var isJohn = "<span class='userName' id='john'>" + "John B." + "</span>";
    $('.discussion').append(isJohn + "<li class='newMessage'>" + data.message + "</li>");
  } else {
    var isKayla = "<span class='userName' id='kayla'>" + "Kayla Q." + "</span>";
    $('.discussion').append(isKayla + "<li class='newMessage'>" + data.message + "</li>");
  }
  // $('.discussion').append("<span class='userName'>" + data.user + "</span>" + "<li class='newMessage'>" + data.message + "</li>");
  $('.messages').animate({
    scrollTop: $('.messages')[0].scrollHeight
  }, 100);
});
// push username into object

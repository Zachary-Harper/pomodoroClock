$(function() {
  let clock = new Clock();
  clock.displayCurrentTime();
  clock.displaySessionTime();
  clock.displayBreakTime();
  clock.displaySessionCount();
  //Event Listeners
  $(".time-session .plus").click(function() {
    clock.changeSessionTime("add");
  });
  $(".time-session .minus").click(function() {
    clock.changeSessionTime("subtract");
  });
  $(".time-break .plus").click(function() {
    clock.changeBreakTime("add");
  });
  $(".time-break .minus").click(function() {
    clock.changeBreakTime("subtract");
  });
  $(".time-start").click(function() {
    clock.toggleClock();
  });
  $(".time-reset").click(function() {
    clock.reset();
  });

});
function Clock() {
  var startTime = 1500;
  var currentTime = 1500;
  var sessionTime = 1500;
  var breakTime = 300;
  var sessionCount = 0;
  var mode = "Session";
  var active = false;
  var _this = this;
  var timer;
  var startAudio = new Audio("../assets/start.mp3");
  var endAudio = new Audio("../assets/end.mp3");

  //Function to convert a number of seconds into a formatted time string
  function formatTime(secs) {
    var result = "";
    var seconds = secs % 60;
    var minutes = parseInt(secs / 60) % 60;
    var hours = parseInt(secs / 3600);
    function addLeadingZeroes(time) {
      if (time < 10) {
        return "0" + time;
      } else {
        return time;
      }
    }
    if (hours > 0) {
      result += hours + ":";
    }
    //Build up the result string with minutes and seconds
    result += addLeadingZeroes(minutes) + ":" + addLeadingZeroes(seconds);
    //Return the result string
    return result;
  }
  this.displayCurrentTime = function() {
    $(".main-display").text(formatTime(currentTime));
    if (mode === "Session" && $(".progress-radial").hasClass("break")) {
      $(".progress-radial")
        .removeClass("break")
        .addClass("session");
    } else if (mode === "Break" && $(".progress-radial").hasClass("session")) {
      $(".progress-radial")
        .removeClass("session")
        .addClass("break");
    }
    $(".progress-radial").attr("class", function(index, currentValue) {
      return currentValue.replace(
        /(^|\s)step-\S+/g,
        " step-" + (100 - parseInt((currentTime / startTime) * 100))
      );
    });
    console.log($(".progress-radial").attr("class"));
  };
  this.displaySessionTime = function() {
    $(`.time-session-display`).text(parseInt(sessionTime / 60) + "min");
  };
  this.displayBreakTime = function() {
    $(`.time-break-display`).text(parseInt(breakTime / 60) + "min");
  };
  //Function to display the session count
  this.displaySessionCount = function() {
    //If our session count is 0, we should show the text Pomodoro Clock
    if (sessionCount === 0) {
      $(".session-count").html("<h2>Pomodoro Clock</h2>");
    } else if (mode === "Session") {
      $(".session-count").html("<h2>Session " + sessionCount + "</h2>");
    } else if (mode === "Break") {
      $(".session-count").html("<h2>Break</h2>");
    }
  };
  //CHANGE TIME FUNCTIONS
  //Function to add or subtract 60 seconds from the session time whenever the plus or minus buttons are interacted with
  this.changeSessionTime = function(command) {
    if (!active) {
      this.reset();
      if (command === "add") {
        sessionTime += 60;
      } else if (sessionTime > 60) {
        sessionTime -= 60;
      }
      currentTime = sessionTime;
      startTime = sessionTime;
      this.displaySessionTime();
      this.displayCurrentTime();
    }
  };
  this.changeBreakTime = function(command) {
    if (!active) {
      this.reset();
      if (command === "add") {
        breakTime += 60;
      } else if (breakTime > 60) {
        breakTime -= 60;
      }
      this.displayBreakTime();
    }
  };
  this.toggleClock = function() {
    if (!active) {
      active = true;
      if (sessionCount === 0) {
        sessionCount = 1;
        this.displaySessionCount();
        startAudio.play();
      }
      $(".time-start").text("Pause");
      timer = setInterval(function() {
        _this.stepDown();
        
      }, 1000);
    } else {
      $(".time-start").text("Start");
      active = false;
      clearInterval(timer);
    }
  };
  this.stepDown = function() {
    if (currentTime > 0) {
      currentTime--;
      this.displayCurrentTime();
      if (currentTime === 0) {
        if (mode === "Session") {
          mode = "Break";
          currentTime = breakTime;
          startTime = breakTime;
          this.displaySessionCount();
          endAudio.play();
        } else {
          mode = "Session";
          currentTime = sessionTime;
          startTime = sessionTime;
          startTime = sessionTime;
          sessionCount++;
          this.displaySessionCount();
          startAudio.play();
        }
      }
    }
  };
  this.reset = function() {
    clearInterval(timer);
    active = false;
    mode = "Session";
    currentTime = sessionTime;
    sessionCount = 0;

    $(".time-start").text("Start");

    this.displayCurrentTime();
    this.displaySessionTime();
    this.displaySessionCount();
  };
}

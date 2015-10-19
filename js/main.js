var courseData = [
  {
    "name": "1st Hour",
    "startTime": "8:00 am",
    "endTime": "8:55 am"
  },
  {
    "name": "2nd Hour",
    "startTime": "9:00 am",
    "endTime": "9:55 am"
  },
  {
    "name": "3rd Hour",
    "startTime": "10:00 am",
    "endTime": "10:55 am"
  },
  {
    "name": "4th Hour",
    "startTime": "11:00 am",
    "endTime": "11:55 am"
  },
  {
    "name": "5th Hour",
    "startTime": "12:00 pm",
    "endTime": "12:55 pm"
  },
  {
    "name": "6th Hour",
    "startTime": "1:00 pm",
    "endTime": "1:55 pm"
  },
  {
    "name": "7th Hour",
    "startTime": "2:00 pm",
    "endTime": "2:55 pm"
  },
];

function Schedule(courses, currentTime) {
    this.courses = courses;
    this.currentTime = currentTime;

    this.schoolIsInSession = function() {
        var firstCourse = this.courses[0];
        var lastCourse = this.courses[this.courses.length - 1];

        return this.currentTime > firstCourse['startTime'] && this.currentTime < lastCourse['endTime'];
    }

    this.isBeforeSchool = function() {
        var firstCourse = this.courses[0];

        return this.currentTime < firstCourse['startTime'];
    }

    this.isAfterSchool = function() {
        var lastCourse = this.courses[this.courses.length - 1];

        return this.currentTime > lastCourse['endTime'];
    }

    this.getCurrentCourse = function() {
        for ( var i = 0; i < this.courses.length; i++ ) {
            var course = this.courses[i];
            if (this.currentTime >= course['startTime'] && this.currentTime <= course['endTime']) {
                return course;
            }
        }
        return null;
    }

    this.getNextCourse = function() {
        for ( var i = 0; i < this.courses.length; i++ ) {
            var course = this.courses[i];
            if (this.currentTime <= course['startTime']) {
                return course;
            }
        }
        return null;
    }
}

$(document).ready( function() {

    function parseTime(timeString) {
        if (timeString == '') return null;

        var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
        if (time == null) return null;

        var hours = parseInt(time[1],10);
        if (hours == 12 && !time[4]) {
              hours = 0;
        }
        else {
            hours += (hours < 12 && time[4])? 12 : 0;
        }
        var d = new Date();
        d.setHours(hours);
        d.setMinutes(parseInt(time[3],10) || 0);
        d.setSeconds(0, 0);
        return d;
    }

    function buildSchedule(currentTime) {
        var courses = [];
        for ( var i = 0; i < courseData.length; i++ ) {
            var courseJSON = courseData[ i ];
            var course = {
                'name': courseJSON['name'],
                'startTime': parseTime(courseJSON['startTime']),
                'endTime': parseTime(courseJSON['endTime'])
            };
            courses.push(course);
        }
        var schedule = new Schedule(courses, currentTime);
        return schedule;
    }

    function displayTime() {
        var currentTime = new Date();
        var militaryHours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var hours = 0;

        // Let's set the AM and PM meridiem and
        // 12-hour format
        var meridiem = "AM";  // Default is AM

        if (militaryHours > 12) {
            hours = militaryHours - 12; // Convert to 12-hour format
            meridiem = "PM"; // Keep track of the meridiem
        }
        // 0 AM and 0 PM should read as 12
        if (hours === 0) {
            hours = 12;
        }

        // Format minutes and seconds the same way
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        // This gets a "handle" to the clock div in our HTML
        var clock = document.getElementById('clock');

        // Then we set the text inside the clock div
        // to the hours, minutes, and seconds of the current time
        clock.innerText = hours + ":" + minutes + ":" + seconds + " " + meridiem;

        var message = document.getElementById('message');

        var schedule = buildSchedule(currentTime);
        if (schedule.schoolIsInSession()) {
            var currentCourse = schedule.getCurrentCourse();
            if (currentCourse) {
                var minutesRemaning = currentCourse['endTime'].getMinutes() - currentTime.getMinutes();
                message.innerText = "It is currently " + currentCourse['name'] + ". " + minutesRemaning + " minutes remaining.";
            } else {
                var nextCourse = schedule.getNextCourse();
                var diff = currentTime - nextCourse['startTime'];
                var minutesUntilNextCourse = Math.floor(Math.abs(((diff % 86400000) % 3600000) / 60000)); // minutes
                var secondsUntilNextCourse = 60 - currentTime.getSeconds();
                if (secondsUntilNextCourse < 10) {
                    secondsUntilNextCourse = "0" + secondsUntilNextCourse;
                } else if (secondsUntilNextCourse == 60) {
                    secondsUntilNextCourse = "00";
                }
                message.innerText = "Between courses. " + minutesUntilNextCourse + ":" + secondsUntilNextCourse + " until " + nextCourse['name'] + ".";
            }
        } else {
            if (schedule.isBeforeSchool()) {
                message.innerText = "Good morning! Classes will begin soon.";
            }
            else if (schedule.isAfterSchool()) {
                message.innerText = "School's out! Have a great evening.";
            }
        }
    }

    displayTime();

    // This makes our clock 'tick' by repeatedly
    // running the displayTime function every second.
    setInterval(displayTime, 1000);

});

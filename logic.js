/**
 * 
 * @returns {undefined}
 */
var languageStrings = {
    //Notifications
    //Errors
    //Major errors.
    localStorageNotPresent: "This application cannot operate in browsers which don't support the localStorage object. Please upgrade.",
    databaseFault: "The data storage has been corrupted.",
    dbCreationFail: "The browser prevented the preparation of the local data storage. Please enable HTML 5 web storage and make sure at least 4 MB are available for this app. ",
    //Medium errors.
    dayNotCreated: "Unable to record the requested time.",
    //First-time usage
    welcome: "Welcome to Manuel's Time Tracker. All preparations are done.",
    //Normal UI text.
    //Report page.
    report_date_change: "Change date",
    report_date_change_name: "Date",
    report: "Report for the date ",
    report_na: "No records for the day available.",
    report_heading_quanitity: "Amount",
    report_heading_description: "Description",
    report_heading_actions: "Actions",
    report_entry_total: "Total",
    record_time_heading: "Record time",
    record_time_quantity: "Quantity:",
    record_time_description: "Description:",
    //Processing an attempt to report time.
    record_time_nan: "Please enter a number as quantity.",
    record_time_all_good: "Time recorded.",
    //Prompts
    deletion_prompt:"It is possible to reset the entire database. Do you want to do this?",
    //Month names
    january: "January",
    feburary: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
    //"Data Management" page
    deleteAllText : "Clicking 'Delete Data' will delete all recorded time. Proceed with caution!",
    deleteAllButton : "Delete Data",
    //General purpose
    button_submit: "Submit"

};

var lsObj = window.localStorage;

/**
 * Do some preparations and then show the current day.
 * @returns {undefined}
 */
function init() {
    dataStoreCreated = false;
    //If localStorage is not present, the app is very useless.
    if (!lsObj) {
        displayNotification(languageStrings.localStorageNotPresent, false);
        return;
    }
    //After changes in data storage behaviour, this should be called. Development purposes only.
    //lsObj.clear();
    //Check if localStorage is not prepared.
    if (!lsObj.getItem("MTT-Prepared")) {
        displayNotification(languageStrings.welcome, true);
        //Prepare empty database.
        try {
            lsObj.setItem("MTT-Prepared", "true");
            lsObj.setItem("MTT-Version", "1");
            lsObj.setItem("MTT-TrackedDays", "0");
            lsObj.setItem("MTT-Days", "");
            dataStoreCreated = true;
        } catch (error) {
            console.log(error.message);
            displayNotification(languageStrings.dbCreationFail + "<br> Could be caused by the exception " + error.message + "<br>If you know what you do, consult your browser console.");
        }
    }
    //Check if DB is faulty.
//    if (!sanityCheck()) {
//        if (!dataStoreCreated)
//            displayNotification(languageStrings.databaseFault, false);
//        else
//            displayNotification(languageStrings.dbCreationFail, false);
//        return;
//    }
    //Load report page for the first time.
    document.getElementById("home-button").onclick = clickOnHomeButton;
    document.getElementById("stats-button").onclick = function (){window.alert("This does not exist yet.");};
    document.getElementById("about-button").onclick = document.getElementById("stats-button").onclick;
    document.getElementById("delete-button").onclick = generateDMPage;
    reloadRecordPage();
}

/**
 * Change the date to view the reports for.
 * @returns {undefined}
 */
function changeDate() {
    //Obtain day, month and year.
    var day = document.getElementById("day_field");
    var month = document.getElementById("month_field");
    var year = document.getElementById("year_field");
    day =  day.options[day.selectedIndex].value;
    month = month.options[month.selectedIndex].value;
    year = year.options[year.selectedIndex].value;
    //Validity check. If a date is not valid, JS will simply jump to the next possible
    //day after the fault month. The month change can be detected.
      var d = new Date(parseInt(year),parseInt(month)-1,parseInt(day));
      if(d.getMonth() == parseInt(month)-1 ){
         clearContentField();
         generateRecordPage(day,parseInt(month),year)
      }
      else window.alert("You supplied an invalid date.");

}

/**
 * Prompts the user for deletion of the entire keystore.
 * @returns {undefined}
 */
function promptForDeletion(){
   if(confirm(languageStrings.deletion_prompt)){
       for(var i = 0; i<lsObj.length; i++){
           var subject_to_del = lsObj.key(i);
           if(subject_to_del.includes("MTT")){
               lsObj.removeItem(subject_to_del);
           }
       }
       ///OLD CODE (see ticket #1)
       //clearContentField();
       //location.reload(true);
       //NEW CODE
       clearContentField();
       init();
   }
}

/**
 * Prepare and deliver the "Data Management" page.
 * @returns {undefined}
 */
function generateDMPage(){
    clearContentField();
    //Line breaks.
    appendContent("<br><br>",true);
    //Option 1 - Delete saved records
    appendContent("<b>" +languageStrings.deleteAllButton + "</b><br><br>" +"<b class='warning'>" + languageStrings.deleteAllText + "</b><button id='delete' onclick='promptForDeletion()'>" + languageStrings.deleteAllButton + "</button>",true);
    
    
    flushBuffer();
}

/**
 * Prepare and deliver the time recording utility to the user.
 * @param {Number} day Day of the date.
 * @param {Number} month Month of the date.    
 * @param {Number} year Day of the date.  
 * @returns {undefined}
 */
function generateRecordPage(day = undefined, month = undefined, year = undefined) {
    //Option to change date.
    appendContent("<br><br><b>" + languageStrings.report_date_change + "</b>", true);
    //Day field.
    appendContent("<br><br> " + languageStrings.report_date_change_name, true);
    appendContent("<select id='day_field' name='day'>", true);
    //Generate day field entries.
    for (var i = 1; i < 32; i++) {
        if(i==day)appendContent("<option value='" + i + "' selected>" + i + "</option>", true);
        else appendContent("<option value='" + i + "'>" + i + "</option>", true);
    }
    appendContent("</select>", true);
    //Month field.
    appendContent("<select id='month_field' name='month'>", true);
    //Generate month field entries.
    for (var i = 1; i < 13; i++) {
        if(i==month)appendContent("<option value='" + i + "' selected>" + getMonthString(i) + "</option>", true);
        else appendContent("<option value='" + i + "'>" + getMonthString(i) + "</option>", true);
    }
    appendContent("</select>", true);
    //Year field.
    appendContent("<select id='year_field' name='year'>", true);
    //Generate 100 years from now on.
    for (var i = year; i >= year - 100; i--) {
        if(i==year)appendContent("<option value='" + i + "' selected>" + i + "</option>", true)
        else appendContent("<option value='" + i + "'>" + i + "</option>", true);
    }
    appendContent("</select>", true);
    flushBuffer();
    appendContent("<button onclick='changeDate()'>" + languageStrings.button_submit + "</button>");
    //Report heading.
    appendContent("<h4>" + languageStrings.report + " " + day + " " + getMonthString(month) + " " + year + "</h4>");
    //Make sure day, month fit the required syntax.
    //Check if day is even present in keystore.
    if (lsObj.getItem("MTT-" + day + "-" +month +"-" + year + "-Bookings") === null) {
        appendContent(languageStrings.report_na + "<br><br><br>");
    } else {
        var sumHours = 0;
        //Get amount of booked hours.
        var numberOfHours = Number(lsObj.getItem("MTT-" + day + "-" + month + "-" + year + "-Bookings"));
        if (numberOfHours === 0) {
            appendContent(languageStrings.report_na + "<br><br><br>");
        } else {
            appendContent("<table style='width: 40%; text-align: center' border=1> \n <tr> \n <th>" + languageStrings.report_heading_quanitity
                    + "</th> \n <th> " + languageStrings.report_heading_description
                    + "</th> \n <th> " + languageStrings.report_heading_actions + " </th> \n </tr>", true);
            for (var i = 0; i < numberOfHours; i++) {
                /*
                 * MTT-14122019-B-0-H  : Number of the booked time in hours. Floating point precision.
                 * MTT-14122019-B-0-DES  : Description of what has been done.
                 * MTT-14122019-B-0-DEL : Boolean value which says if the entry is valid or invalid (revoked). 
                 */
                appendContent("<tr>", true);
                var hours = Number(lsObj.getItem("MTT-" + day + "-" + month + "-" + year + "-B-" + i + "-H"));
                sumHours += hours;
                appendContent("<td>" + hours + " h</td>", true);
                appendContent("<td>" + lsObj.getItem("MTT-" + day + "-" + month + "-" + year + "-B-" + i + "-DES") + "</td>", true);
                appendContent("</tr>", true);
            }
            appendContent("<tr> <th> " + sumHours + " h</th><th>" + languageStrings.report_entry_total + "</th></tr>", true);
            appendContent("</table><br><br><br>", true);
            flushBuffer();
        }

    }
    //Display option to book time.
    appendContent("<b>" + languageStrings.record_time_heading
            + "</b><br><br>" +
            languageStrings.record_time_quantity
            + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='time-to-record'></input>h<br>" +
            languageStrings.record_time_description
            + " <input id='text-of-record'></input><br><button onclick=record_entry(" +
            +day +"," + month + "," + year +
            ")>" +
            languageStrings.button_submit +
            "</button>");
}
/**
 *Process a request to record time.
 */
function record_entry(day,month,year) {
    var hours = document.getElementById("time-to-record").value;
    //Check if value is not acceptable (not numeric/empty)
    if(hours.includes(",")){
        hours = hours.replace(",",".");
    }
    if (isNaN(hours) || hours === "") {
        window.alert(languageStrings.record_time_nan);
        return;
    }
    //Get record no. for this day.
    var index = findBookingIndex(day,month,year);
    //Something went totally wrong.
    if (index === false) {
        displayNotification(languageStrings.dayNotCreated, false);
        reloadRecordPage();
        return;

    }
    lsObj.setItem("MTT-" + day + "-" + month + "-" + year + "-B-" + index + "-H", hours);
    lsObj.setItem("MTT-" + day + "-" + month + "-" + year + "-B-" + index + "-DES", document.getElementById("text-of-record").value);
    lsObj.setItem("MTT-" + day + "-" + month + "-" + year + "-B-" + index + "-DEL", true);
    displayNotification(languageStrings.record_time_all_good, true);
    generateRecordPage(day,month,year);

}

/**
 * Handles the click on the home button.
 * @returns {undefined}
 */
function clickOnHomeButton(){
    clearContentField();
    reloadRecordPage();
}

/**
 * Reload report page with current date.
 * @returns {undefined}
 */
function reloadRecordPage() {
    //Get the date of today and get day, month and year separate.
    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    //Generate page. Same effect as if someone presses the "Home" button.
    generateRecordPage(day, month, year);
}


/**
 * Ensures there is a valid index for the incoming record.
 * If a day does not exist yet, it is created.
 * In case a day cannot be created, an error value is returned.
 * @param {String} timeString The value of the date to book in. 
 * @returns {Mixed} false if an error occured, otherwise the index of the next
 * hours record.
 */

function findBookingIndex(day,month,year) {
    var index = 0;
    try {
        //Trivial case: Complete keystore is empty.
        if (Number(lsObj.getItem("MTT-TrackedDays")) === 0) {
            lsObj.setItem("MTT-TrackedDays", "1");
            lsObj.setItem("MTT-" + day + "-" + month + "-" + year + "-Bookings", "1");
            lsObj.setItem("MTT-Days", day + "-" + month + "-" + year);
            return 0;

        }
        //Alternate cases: There is at least one day.
        //Case: Our day has already one entry.
        if (Number(lsObj.getItem("MTT-TrackedDays")) !== 0 && lsObj.getItem("MTT-Days").includes(day + "-" + month + "-" + year)) {
            var amountOfEntries = Number(lsObj.getItem("MTT-" + day + "-" + month + "-" + year + "-Bookings"));
            amountOfEntries++;
            lsObj.setItem("MTT-" + day + "-" + month + "-" + year + "-Bookings", amountOfEntries);
            return --amountOfEntries;

        }
        //Case: Our day does not exist yet.
        else {
            var amountOfDays = Number(lsObj.getItem("MTT-TrackedDays"));
            amountOfDays++;
            lsObj.setItem("MTT-TrackedDays", amountOfDays);
            lsObj.setItem("MTT-" + day + "-" + month + "-" + year + "-Bookings", "1");
            lsObj.setItem("MTT-Days", lsObj.getItem("MTT-Days") + " " + day + "-" + month + "-" + year);
        return 0;
        }

    } catch (error) {
        return false;
    }
    return false;
}


/**
 * Obtain the month as number.
 * @returns {Number} THe numeric representation of the supplied month.
 */
function monthStringToNo(monthString) {
    switch (monthString) {
        case languageStrings.january:
            return 1;
        case languageStrings.february:
            return 2;
        case languageStrings.march:
            return 3;
        case languageStrings.april:
            return 4;
        case languageStrings.may:
            return 5;
        case languageStrings.june:
            return 6;
        case languageStrings.july:
            return 7;
        case languageStrings.august:
            return 8;
        case languageStrings.september:
            return 9;
        case languageStrings.october:
            return 10;
        case languageStrings.november:
            return 11;
        case languageStrings.december:
            return 12;


    }
}

/**
 * Obtain the month as word.
 * @param {Number} monthNo
 * @returns {String} Name of the month.
 */
function getMonthString(monthNo) {
    switch (monthNo) {
        case 1:
            return languageStrings.january;
        case 2:
            return languageStrings.feburary;
        case 3:
            return languageStrings.march;
        case 4:
            return languageStrings.april;
        case 5:
            return languageStrings.may;
        case 6:
            return languageStrings.june;
        case 7:
            return languageStrings.july;
        case 8:
            return languageStrings.august;
        case 9:
            return languageStrings.september;
        case 10:
            return languageStrings.october;
        case 11:
            return languageStrings.november;
        case 12:
            return languageStrings.december;
    }
}


/**
 * Sanity check of data.
 * Value of "MTT-Version" needs to be 0.
 * Value of "MTT-TrackedDays" needs to be 0 or higher.
 * Value of "MTT-Days" must be not null and a clear string or filled with dates
 * separated by spaces in the format shown below.
 * A day string will start with the prefix "MTT-DDMMYYYY". Today, December 14 2019 looks
 * like this.
 * "MTT-14-12-2019-Bookings": The amount of entries for the day.
 * A day does exist as long as bookings exist. They are indexed from 0 to n.
 * A booking entity looks like this:
 * MTT-DDMMYY-B-N. N is the index. This said, its data keys look like this:
 * MTT-14-12-2019-B-0-H  : Number of the booked time in hours. Floating point precision.
 * MTT-14-12-2019-B-0-DES  : Description of what has been done.
 * MTT-14-12-2019-B-0-DEL : Boolean value which says if the entry is valid or invalid (revoked).
 * If the entry is valid, it will be shown in normal text font.
 * If it is invalid, the text will be stroked and red.
 * @returns {boolean} Returns true if the data are all okay.
 * @deprecated
 */
function sanityCheck() {
    //Check if database "head" is wrong.
    if (lsObj.length === 0 || Number(lsObj.getItem("MTT-Version")) !== 0 || Number(lsObj.getItem("MTT-TrackedDays")) < 0 || lsObj.getItem("MTT-Days") === null)
        return false;
    //Check if date index is correct.
    var dateArray = lsObj.getItem("MTT-Days").split(" ");
    for (var i = 0; i < dateArray.length; i++) {
        //Check if entry is not a number.
        if (isNaN(dateArray[i]))
            return false;
        //Get hold of the date as variable.
        let date = Number(dateArray[i]);
        //Verify the correctness of the bookings string.
        if (isNaN(lsObj.getItem("MTT-" + date + "-Bookings")))
            return false;
        //Get the amount of bookings as number.
        let bookingsNo = Number(lsObj.getItem("MTT-" + date + "-Bookings"));
        //Traverse through the bookings.
        for (var j = 0; j < bookingsNo; j++) {
            //Check if hours are NaN and alert in that case.
            if (isNaN(lsObj.getItem("MTT-" + date + "-B-" + j)))
                return false;
            //Check if description text exists.
            if (lsObj.getItem("MTT-" + date + "-B-" + j + "-DES") === undefined)
                return false;
            //Check if validity flag is set and correctly set.
            if (Boolean(lsObj.getItem("MTT-" + date + "-B-" + j + "-DEL")) !== true &&
                    Boolean(lsObj.getItem("MTT-" + date + "-B-" + j + "-DEL")) !== false
                    )
                return false;
        }

    }

    //All checks passed. 
    return true;


}
/**
 * Resets the content area of the page.
 * @returns {undefined}
 */
function clearContentField() {
    document.getElementById("page-content").innerHTML = "";
}
/**
 * Add HTML code to the content area of the page.
 * @param {String} htmlString HTML code to add to page.
 * @param {Boolean} buffer Should the HTML code be buffered?
 * @returns {undefined}
 */
function appendContent(htmlString, buffer = false) {
    if (!buffer)
        document.getElementById("page-content").innerHTML = document.getElementById("page-content").innerHTML + htmlString;
    else
        auxillaryBuffer = auxillaryBuffer + htmlString;
}
/**
 * This auxillary buffer is dedicated to cases when HTML strings cannot be immediately added to the page
 * and parts of HTML code need to be added to the page of the same time.
 * @type String
 */
var auxillaryBuffer = "";

/**
 * Flushes the buffer for HTML code and applies the entire to the page at once.
 * Required for tables.
 */
function flushBuffer() {
    appendContent(auxillaryBuffer);
    auxillaryBuffer = "";
}


/**
 * Small function to display notification text. Please note that the content 
 * area will be cleared after this call.
 * Render the page content after the usage of this.
 * @param {type} success
 * @param {type} text
 * @returns {undefined}
 */
function displayNotification(text, success = true) {
    if (success) {
        document.getElementById("page-content").innerHTML = "<h3 class='success'>" + text + "</h3></br>";
    } else {
        document.getElementById("page-content").innerHTML = "<h3 class='warning'>" + text + "</h3></br>";
}
}

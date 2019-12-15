/**
 * 
 * @returns {undefined}
 */
var languageStrings = {
    //Notifications
    //Errors
    localStorageNotPresent: "This application cannot operate in browsers which don't support the localStorage object. Please upgrade.",
    databaseFault: "The data storage has been corrupted.",
    dbCreationFail: "The browser prevented the preparation of the local data storage. Please enable HTML 5 web storage and make sure at least 4 MB are available for this app. ",
    //First-time usage
    welcome: "Welcome to Manuel's Time Tracker. All preparations are done.",
    //Normal UI text.
    //Report page.
    report: "Report for the date ",
    report_na: "No records for the day available.",
    record_time_heading: "Record time",
    record_time_quantity: "Quantity:",
    record_time_description: "Description:",
    //Processing an attempt to report time.
    record_time_nan: "Please enter a number as quantity.",
    //Month names
    january: "January",
    feburary: "February",
    march: "March",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
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
    lsObj.clear();
    //Check if localStorage is not prepared.
    if (!lsObj.getItem("MTT-Prepared")) {
        displayNotification(languageStrings.welcome, true);
        //Prepare empty database.
        try {
            lsObj.setItem("MTT-Prepared", "true");
            lsObj.setItem("MTT-Version", "0");
            lsObj.setItem("MTT-TrackedDays", "0");
            lsObj.setItem("MTT-Days", "");
            dataStoreCreated = true;
        } catch (error) {
            console.log(error.message);
            displayNotification(languageStrings.dbCreationFail + "<br> Could be caused by the exception " + error.message + "<br>If you know what you do, consult your browser console.");
        }
    }
    //Check if DB is faulty.
    if (!sanityCheck()) {
        if (!dataStoreCreated)
            displayNotification(languageStrings.databaseFault, false);
        else
            displayNotification(languageStrings.dbCreationFail, false);
        return;
    }
    //Get the date of today and get day, month and year separate.
    var now = new Date();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    //Generate page. Same effect as if someone presses the "Home" button.
    generateRecordPage(day, month, year);
    //generateRecordPage();
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
    //appendContent("Change date:" )
    //Report heading.
    appendContent("<h4>" + languageStrings.report + " " + day + " " + getMonthString(month) + " " + year + "</h4>");
    //Make sure day, month fit the required syntax.
    if (day < 10) {
        day = String("0" + day);
    }

    //Check if day is even present in keystore.
    if (lsObj.getItem("MTT-" + day + month + year + "-Bookings") === null) {
        appendContent(languageStrings.report_na + "<br><br><br>");
    }
    //Display option to book time.
    appendContent("<b>" + languageStrings.record_time_heading
            + "</b><br><br>" +
            languageStrings.record_time_quantity
            + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='time-to-record'></input>h<br>" +
            languageStrings.record_time_description
            + " <input id='text-of-record'></input><br><button onclick=record_entry(" +
            +day + month + year +
            ")>" +
            languageStrings.button_submit +
            "</button>");
}
/**
 *Process a request to record time.
 */
function record_entry(timeString) {
    var hours = document.getElementById("time-to-record").value;
    if (isNaN(hours) || hours === "") {
        window.alert(languageStrings.record_time_nan);
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
 * "MTT-14122019-Bookings": The amount of entries for the day.
 * A day does exist as long as bookings exist. They are indexed from 0 to n.
 * A booking entity looks like this:
 * MTT-DDMMYY-B-N. N is the index. This said, its data keys look like this:
 * MTT-14122019-B-0-H  : Number of the booked time in hours. Floating point precision.
 * MTT-14122019-B-0-DES  : Description of what has been done.
 * MTT-14122019-B-0-DEL : Boolean value which says if the entry is valid or invalid (revoked).
 * If the entry is valid, it will be shown in normal text font.
 * If it is invalid, the text will be stroked and red.
 * @returns {boolean} Returns true if the data are all okay.
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
 * @param {type} htmlString
 * @returns {undefined}
 */
function appendContent(htmlString) {
    document.getElementById("page-content").innerHTML = document.getElementById("page-content").innerHTML + htmlString;
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
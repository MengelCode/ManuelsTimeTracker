# Manuel's Time Tracker

## The Project

While training JavaScript, I felt that I could need an utility for time management. 
I did not want to check for existing solutions and grasped the opportunity for additional training.


## The Tool
"Manuel's Time Tracker" is a small utility where you can create daily reports with your activities. 
You can enter time in hours and a description for everything and toggle the overview to show any valid calendar day.
It is a work in progress and many things (like editing single entries or import/export data functions) are still missing.
All data are saved via HTML 5 local storage. The application is completely client-side.


## Delivery over a webserver.
You can serve the corresponding files via a web server. You should be aware that in ANY case, all data will be saved locally
and will never be communicated back to the HTTP server, in opposite to web cookies. Web browsers deliver the local storage 
at a "per domain" basis, so for your local file system and for additional web domains, you will have separate memory.
The application itself is suitable for single-user use. 


## Try it out!
While I cannot recommend to replace something in your workflow with the utility, you are invited to have this as addition. 
Long-time tests in daily life are also happening from my side at the time of the writing.


## Licensing
The application is licensed under the MIT license. Feel free to distribute copies of the software under its conditions.

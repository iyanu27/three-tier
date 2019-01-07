## A 3-tier environment

A 3-tier environment often consists of 
1. a UI frontend, typically a browser or app
2. a server which which performs server-side logic, and
3. a database for data storage and stored procedures

This proof-of-concept application comprises a React/Redux frontend web app and a backend server written in python and 
backed by a sqlite database (for development purposes). It allows a user to login and logout, with session state being stored in a cookie. 
If the user refreshes the page whilst having a valid session cookie, the app will display the user's name.

The frontend itself could be independently considered as 3-tier architecture; React is used as the UI layer, 
whilst Redux is used for both business logic (actions) and storage (state).

## Instructions on how to run
In any development environment, reproducibility and automation are key to success. 
To that end, this app has been runs as a Docker image and unit tests are incorporated into the build file.

The container (~ 250 MB) can be run as follows:

`docker run -p 8085:8085 sriv1211/three-tier`

and then navigating to http://localhost:8085. Don't forget to open the console to see the the redux workflow.
This app simulates a simple locker system that allows users to drop and pick up items.

## We have different modules:
- bloq - each bloq contains one or more lockers
- locker - each locker contains one rent
- rent - each rent is dropped off by a user and picked up by another

## There are 2 types of users in this app:
1. OPERATIONS_USER - can create, get, update and delete bloqs and lockers. can access all rents endpoints
2. REGULAR_USER - can create rents, can only view rents created by him, can update rents created by him

## How this works:
1. OPERATIONS_USER - Create a bloq
2. OPERATIONS_USER - Create a locker in one of the bloqs created (a bloqId is necessary for this)
3. REGULAR_USER - Create a rent giving his email and the email from the receiver, the rent has a status = CREATED
4. REGULAR_USER - Assigns a rent to one locker (using the lockerId), the locker must have status = OPEN and isOccupied = false, this action changes the status of the rent to WAITING_DROPOFF
5. REGULAR_USER - The sender user drops the rent in the assigned locker, when this happens a random code is generated and added to the rent, the status of the rent changes to WAITING_PICKUP, the locker status changes to CLOSED and isOccupied = true, finally an email is sent to the receiver with the code
6. REGULAR_USER - The receiver user picks up the rent, the code must be provided, if the code is correct the status of the rent changes to DELIVERED, the locker status changes to OPEN and isOccupied = false
7. REGULAR_USER - The sender user receives an email confirming the delivery of the rent

This app uses a mongodb to store all the data related to bloqs, lockers, rents and users.
To achieve the email feature this app uses nodemailer and mailtrap.io for the SMTP configs.

All endpoints require authentication, the token must be provided in the header of the request.
Some endpoints require a specific role.

## Project setup

```bash
# install dependencies
$ npm install

# set parameters in .env file
create a .env file in the root of the project
and set the same parameters as in the .env.example file
```

## Compile and run the project

```bash
# start mongoDB and start app
$ docker compose up -d && npm run dev
```

## Run tests

```bash
# unit tests
$ npm run test
# CS498_FP Scheduler for UIUC Classes

## Functionality
* Use Course Explorer API / scrape
* Display weekly calendar
* Facebook login integration
* Easy A API
* Scheduling algorithm / some way to schedule classes
* Search for classes
* Save / load schedules
* Detail modal view for classes

# Backend Url: 
* User Endpoint: http://scheduler.intense.io/api/user/:userid
* Schedule Endpoint: http://scheduler.intense.io/api/schedules/:scheduleid


## Database Schema

### Class
|Name|Type|
|---|---|
|id|int|
|name|string|
|required|string|

### Section
|Name|Type|
|---|---|
|id|int|
|crn|int|
|name|string|
|term|string|
|section_code|string|
|class_location|string|
|instructor|string|
|credit_hours|int|
|section_type|string|
|class_times|array of array of int|
|restrictions|string|

`class_times` is stored as follows:

    [ day of week, start time, end time ]

Day of week is an integer from 1-7 representing Monday - Sunday, or 0 if there is no information.

Start and end times are integers from 0 to 1439 representing minutes after midnight. For example, 480 represents 8:00 AM and 1439 represents 11:59 PM.

`credit_hours` currently will only return the lower limit of a range if there is a range of credit hours a course can have (for example, all CS 498 sections will be marked as 1 credit hour).

### User
|Name|Type|
|---|---|
|id|int|
|name|string|
|email|string|
|hash|string|
|schedules|array of Schedules|

`schedules` is an array of Schedules that gives `id`, `name`, and `term` for each schedule.

`hash` is not returned by the API; it is used only in the backend for authentication. API calls should use `pass` instead.

### Schedule
|Name|Type|
|---|---|
|id|int|
|name|string|
|user|int|
|term|string|

## API Calls

### POST /api/login
Requires authentication

### POST /api/logout
Requires authentication

### GET /api/users

### POST /api/users

### GET /api/users/:id

### PUT /api/users/:id
Requires authentication

### DELETE /api/users/:id

### GET /api/schedules

### POST /api/schedules
Requires authentication

### GET /api/schedules/:id

### PUT /api/schedules/:id
Requires authentication

### DELETE /api/schedules/:id
Requires authentication

### GET /api/classes

### GET /api/classes/:id

### GET /api/sections/:id

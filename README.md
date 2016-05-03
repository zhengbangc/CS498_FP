# CS498_FP

## Functionality
* Use Course Explorer API / scrape
* Display weekly calendar
* Facebook login integration
* Easy A API
* Scheduling algorithm / some way to schedule classes
* Search for classes
* Save / load schedules
* Detail modal view for classes

#Backend Url: 
#User Endpoint: http://scheduler.intense.io/api/user/:userid
#Schedule Endpoint: http://scheduler.intense.io/api/schedules/:scheduleid


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
|section_code|string|
|class_location|string|
|instructor|string|
|credit_hours|int|
|section_type|int|
|class_times|array of array of int|
|restrictions|string|

### User
|Name|Type|
|---|---|
|id|int|
|name|string|
|email|string|
|hash|string|
|schedules|[ ]|

### Schedule
|Name|Type|
|---|---|
|id|int|
|name|string|
|user|int|
|classes|array of Class|
|sections|array of Section|

## API Calls

### POST /api/login

### POST /api/logout

### GET /api/users

### POST /api/users

### GET /api/users/:id

### PUT /api/users/:id

### DELETE /api/users/:id

### GET /api/schedules

### POST /api/schedules

### GET /api/schedules/:id

### PUT /api/schedules/:id

### DELETE /api/schedules/:id

### GET /api/classes

### GET /api/classes/:id

### GET /api/sections/:id

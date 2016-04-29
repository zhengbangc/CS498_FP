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

Backend Url: http://scheduler.intense.io/api/users

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
|code|string|
|hours|int|
|type|int|
|time|object|

### User
|Name|Type|
|---|---|
|id|int|
|name|string|
|email|string|
|hash|string|

### Schedule
|Name|Type|
|---|---|
|id|int|
|name|string|
|user|User|
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

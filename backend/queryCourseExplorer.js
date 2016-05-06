'use strict';
require('events').EventEmitter.prototype._maxListeners = 1000;
let uiuc = require('uiuc').default
let Section = require('./models.js').Section;
let Class = require('./models.js').Class;

let parseTime = function(time) {
    let t = time.split(' ');
    let hour = parseInt(t[0].split(':')[0]);
    let min = parseInt(t[0].split(':')[1]);
    if(t[1] == 'PM' && hour != 12) {
        hour += 12;
    } else if(t[1] == 'AM' && hour == 12) {
        hour = 0;
    }
    return hour * 60 + min;
};

let courseName = function(course) {
    return course['$'].id + ' - ' + course.label[0];    
};

let courseRequired = function(course) {
    return '';
};

let courseTerm = function(course) {
    return course.parents[0].term[0]['_'];
};

let courseDescription = function(course) {
    return course.description[0];
};

let sectionName = function(section, course) {
    let name = (section.sectionTitle || course.label || course.name)[0];
    if(name.length == 1) name = '';
    return name;
};

let sectionCode = function(section, course) {
    return (section.sectionNumber || [''])[0].replace(/ /g, '');
};

let sectionLocation = function(section, course) {
    let meeting = section.meetings[0].meeting[0];
    if(meeting.roomNumber && meeting.buildingName)
        return meeting.roomNumber[0] + ' ' + meeting.buildingName[0];
    else
        return '';
};

let sectionTimes = function(section, course) {
    let meeting = section.meetings[0].meeting[0];
    if(meeting.daysOfTheWeek && meeting.start && meeting.end) {
        let days = meeting.daysOfTheWeek[0].replace(/ /g, '').replace(/M/g, '1').replace(/T/g, '2').replace(/W/g, '3').replace(/R/g, '4').replace(/F/g, '5').replace(/S/g, '6').replace(/U/g, '7');
        days = days.split('').map(function(x) { return parseInt(x, 10)});
        let start = parseTime(meeting.start[0]);
        let end = parseTime(meeting.end[0]);
        return days.map(function(x) {
            return [x, start, end];
        });
    }
};

let sectionInstructors = function(section, course) {
    let meeting = section.meetings[0].meeting[0];
    if(meeting.instructors[0].instructor) {
        return meeting.instructors[0].instructor.map(function(x) {
            return x['_'];
        }).join(', ');
    } else {
        return '';
    }
};

let sectionType = function(section, course) {
    let meeting = section.meetings[0].meeting[0];
    if(meeting.type) {
        return meeting.type[0]['_'];
    } else {
        return '';
    }
}

let sectionDescription = function(section, course) {
    let description = (section.sectionText || course.description || [''])[0];
    if(description.length == 1) description = '';
    return description;
}

let addSectionsToDb = function(course, sections) {
    let section_objs = [];
    for(let i = 0; i < sections.length; i++) {
        let section = sections[i];
        let section_obj = {}

        section_obj['name'] = sectionName(section, course);
        section_obj['crn'] = parseInt(section['$'].id);
        section_obj['section_code'] = sectionCode(section, course);
        section_obj['section_location'] = sectionLocation(section, course);
        section_obj['section_times'] = sectionTimes(section, course);
        section_obj['instructor'] = sectionInstructors(section, course);

        let meeting = section.meetings[0].meeting[0];
        section_obj['section_type'] = sectionType(section, course);
        section_obj['credit_hours'] = parseInt(course['credit_hours'][0].split(' '));
        section_obj['description'] = sectionDescription(section, course);
        section_obj['restrictions'] = (section.sectionNotes || [''])[0]

        section_obj['class'] = course.id;

        section_objs.push(section_obj);
    }
    for(let i = 0; i < section_objs.length; i++) {
        let section_obj = section_objs[i];
        (function(s) {
            Section.create(s).then(function(res) {
                console.log('Added section ' + res.name);
            });
        })(section_obj);
    }
}

let addSubjectToDb = function(year, term, subject) {
    uiuc.getSchedule({year: year, term: term, subject: subject, active: true}).then(function(res) {
        let courses = res.subjectData.cascadingCourses[0].cascadingCourse;
        let course_objs = []
        for(let i = 0; i < courses.length; i++) {
            let course = courses[i];
            let course_obj = {}
            course_obj['name'] = courseName(course);
            course_obj['required'] = courseRequired(course);
            course_obj['term'] = courseTerm(course);
            course_obj['description'] = courseDescription(course);
            course_obj['sections'] = course.detailedSections[0].detailedSection;
            course_obj['credit_hours'] = course.creditHours;
            course_objs.push(course_obj);
            console.log('Processed class ' + course_obj.name + ' - ' + term);
        }
        for(let i = 0; i < course_objs.length; i++) {
            (function(c) {
                Class.create(c).then(function(res) {
                    console.log('Added class ' + res.name + ' - ' + res.term);
                    c['id'] = res.id;
                    addSectionsToDb(c, c.sections);
                });
            })(course_objs[i]);
        }
    });
};
let inputyear = process.argv[2];
let inputsubject = process.argv[3];
uiuc.getSchedule({year: inputyear}).then(function(res) {
    for(let i = 0; i < res.terms.length; i++) {
        let term = res.terms[i];
        console.log('Getting term ' + term + ' ' + inputyear + ' for ' + inputsubject);
        addSubjectToDb(inputyear, term, inputsubject);
    }
});

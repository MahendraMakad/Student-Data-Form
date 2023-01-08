var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var connToken = '90938139|-31949272998210700|90955119';
var dbName = 'SCHOOL-DB';
var relName = 'STUDENT-TABLE';

function resetForm() {
    $('#rollNo').val("");
    $('#studentName').val("");
    $('#studentClass').val("");
    $('#birthDate').val("");
    $('#studentAddress').val("");
    $('#enrollmentDate').val("");
    $('#rollNo').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#update').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#rollNo').focus();
}

function validateData() {
    var rollno, name, studentClass, birthdate, address, enrollmentDate;
    rollno = $('#rollNo').val();
    name = $('#studentName').val();
    studentClass = $('#studentClass').val();
    birthdate = $('#birthDate').val();
    address = $('#studentAddress').val();
    enrollmentDate = $('#enrollmentDate').val();
    if (rollno == '') {
        alert('Roll No is missing.');
        $('#rollNo').focus();
        return "";
    }
    if (name == '') {
        alert('Name is missing.');
        $('#studentName').focus();
        return "";
    }
    if (studentClass == '') {
        alert('Class is missing.');
        $('#studentClass').focus();
        return "";
    }
    if (birthdate == '') {
        alert('Birth date is missing.');
        $('#birthDate').focus();
        return "";
    }
    if (address == '') {
        alert('Address is missing.');
        $('#studentAddress').focus();
        return "";
    }
    if (enrollmentDate == '') {
        alert('Address is missing.');
        $('#enrollmentDate').focus();
        return "";
    }
    var jsonStrObj = {
        rollNo:rollno,name:name,address:address,birthdate:birthdate
        ,enrollmentDate:enrollmentDate
    }
    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj =='') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $('#rollNo').focus();
}

function updateData() {
    $('#update').prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relName, localStorage.getItem(""));
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    console.log(resultObj);
    $('#rollNo').focus();
}

function getStudentIdAsJsonObj() {
    var stdId = $('#rollNo').val();
    var jsonStr = {
        id: stdId
    }
    return JSON.stringify(jsonStr);
}

function getStudent() {
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, studentIdJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    if (resultObj.status == 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#studentName').focus();
    }
    else if (resultObj.status == 200) {
        $('#rollNo').prop("disabled", true);
        fillData(resultObj);
        $('#update').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#studentName').focus();
    }
}


function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#rollNo').val(data.rollNo);
    $('#studentName').val(data.studentName);
    $('#studentClass').val(data.studentClass);
    $('#birthDate').val(data.birthDate);
    $('#enrollmentDate').val(data.enrollmentDate);
}
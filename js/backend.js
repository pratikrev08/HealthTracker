// GET all users currently stored on db
function getUsers(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        mode: 'cors'
    };

    return fetch("http://localhost:5001/api/v1/get_users", requestOptions)
        .then(response => response.text())
        .then(result => {
            return result;
        })
        .catch(error => console.log('error', error));
}

// PUT new user on PostgreSQL db
function putUser(username, password){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({'username': username, 'password': password});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        mode: 'cors'
    };

    return fetch("http://localhost:5001/api/v1/create_user", requestOptions)
        .then(response => response.text())
        .then(result => {
            return result;
        })
        .catch(error => console.log('error', error));
}

// GET data to load into UI
function getData(username, password){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({'username': username, 'password': password});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        mode: 'cors'
    };

    return fetch("http://localhost:5001/api/v1/pull_data", requestOptions)
        .then(response => response.text())
        .then(result => {
            return result;
        })
        .catch(error => console.log('error', error));
}

// parse and PUT new data to new user created
function putData(userid, data){
    var formData = new FormData();
    formData.append('healthData', data);
    formData.append('userid', userid);
    axios.post("http://localhost:5001/api/v1/push_data", formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
    .then((response) => {
        return response
    }, (error) => {
        console.log(error);
    });
}
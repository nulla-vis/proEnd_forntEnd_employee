document.getElementById('submitLogin').addEventListener('click', (e) => {
    e.preventDefault()
    check()
})
const check = () => {
    // remove error message
    let elements = document.getElementsByClassName('invalid-feedback');
    let elements_isInvalid = document.getElementsByClassName('is-invalid');
    let elementsDismissable = document.getElementsByClassName('alert-dismissible');
    
    while (elements_isInvalid.length) elements_isInvalid[0].classList.remove('is-invalid');
    
    while(elements.length) elements[0].parentNode.removeChild(elements[0]);

    while(elementsDismissable.length) elementsDismissable[0].parentNode.removeChild(elementsDismissable[0]);

    // get input data with DOM
    const email = document.getElementById('exampleInputEmail')
    const password = document.getElementById('exampleInputPassword')
    
    // check if inputted is null or not
    if(email.value != '' && password.value != '' ) {
        login(email.value, password.value)
    } else if(email.value === '' && password.value === '') {
        email.classList.add("is-invalid")
        showError(email, 'メールまたはユーザーネームを入力してください。')

        password.classList.add("is-invalid")
        showError(password, 'パスワードを入力してください。')
    } else if(email.value === '') {
        email.classList.add("is-invalid")
        showError(email, 'メールまたはユーザーネームを入力してください。')
    } else {
        password.classList.add("is-invalid")
        showError(password, 'パスワードを入力してください。')
    }
}

const login = (email, password) => {
    fetch('http://projectenshuuemployee-env.eba-qw8yp2xr.us-east-2.elasticbeanstalk.com/api/auth/signin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": email,
            "password": password
        })
    }).then( res => res.json() )
    .then( res => {
        console.log(res)
        // authentication
        authenticate(res)
    } ).catch(function () {
     console.log("Promise Rejected");
});
}

const authenticate = (response) => {
    if(response.accessToken) {
        let inMemoryToken = response.accessToken;
        console.log( inMemoryToken );
        localStorage.setItem('user', JSON.stringify(response));
        location.href = 'dashboard.html';

    }
    else {
        failedError('そのユーザは登録していません。')  
    }
}

const showError = (element, errorMessage) => {

    let alertMessage = document.createElement('div')

    alertMessage.classList.add('invalid-feedback')
    alertMessage.textContent = errorMessage
    
    element.parentNode.insertBefore(alertMessage, element.nextSibling)
}

const failedError = (errorMessage) => {
    const title = document.getElementById('application-title')
    let alertMessage = document.createElement('div')
    alertMessage.classList.add('alert')
    alertMessage.classList.add('alert-warning')
    alertMessage.classList.add('alert-dismissible')
    alertMessage.classList.add('fade')
    alertMessage.classList.add('show')
    alertMessage.setAttribute("role", "alert")
    alertMessage.innerHTML = `
    <strong>${errorMessage}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>`
    title.parentNode.insertBefore(alertMessage, title.nextSibling)
}

const localstorage_user = JSON.parse(localStorage.getItem('user'))

// check authorization before accessing the page
const checkAuthorization = (user) => {
    if(!user || user.roles[0] !==  'ROLE_ADMIN') {
        location.href = 'login.html';
    }
}

const initialpageData = () => {

    document.querySelector('.userName').textContent = localstorage_user.username.charAt(0).toUpperCase() + localstorage_user.username.slice(1)

    // remove and add active class to sidebar Nav
    let activeClass = document.getElementsByClassName('active');
    while (activeClass.length) activeClass[0].classList.remove('active');
    document.querySelector('#newUserNav').classList.add('active')

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem("user");
        location.href = 'login.html';
    })

}

const checkForm = () => {
    userError = true
    lastNameError = true
    firstNameError = true
    emailError = true
    passwordError = true
    confirmPasswordError =true

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const userName = document.getElementById('inputUserName')
    const lastName = document.getElementById('lastName')
    const firstName = document.getElementById('firstName')
    const email = document.getElementById('inputEmail')
    const password = document.getElementById('inputPassword')
    const confirmPassword = document.getElementById('inputPasswordConfirm')
    const role = document.getElementById('inputRole')

    if(userName.value === ''){
        userError = true
        document.getElementById('userNameCheck').textContent = "ユーザー名を入力してください"
    }else {
        userError = false
        document.getElementById('userNameCheck').textContent = ""
    }
    
    if(lastName.value === ''){
        lastNameError = true
        document.getElementById('lastNameCheck').textContent = "このフィールドを空にすることはできません"
    }else {
        lastNameError = false
        document.getElementById('lastNameCheck').textContent = ""
    }
    if(firstName.value === ''){
        firstNameError = true
        document.getElementById('firstNameCheck').textContent = "このフィールドを空にすることはできません"
    }else {
        firstNameError = false
        document.getElementById('firstNameCheck').textContent = ""
    }

    if(email.value.match(pattern)) {
        emailError = false
        document.getElementById('emailCheck').textContent = ""
    } else {
        emailError = true
        document.getElementById('emailCheck').textContent = "有効なメールアドレスを入力してください"
    }

    if(password.value === '' || password.value.length < 8){
        passwordError = true
        document.getElementById('passwordCheck').textContent = "パスワードを8〜20文字入力してください"
    }else{
        passwordError = false
        document.getElementById('passwordCheck').textContent = ""
    }

    if(confirmPassword.value === ''){
        confirmPasswordError = true
        document.getElementById('confirmPasswordCheck').textContent = "パスワードを再入力してください"
    }
    else{
        if(password.value !== confirmPassword.value) {
            confirmPasswordError = true
            document.getElementById('passwordCheck').textContent = "パスワードが一致しません"
            document.getElementById('confirmPasswordCheck').textContent = "パスワードが一致しません"
        }else {
            confirmPasswordError = false
            document.getElementById('confirmPasswordCheck').textContent = ""
            document.getElementById('passwordCheck').textContent = ""
        }
    }

    if(!userError && !lastNameError && !firstNameError && !emailError && !passwordError && !confirmPasswordError) {
        const userObject = {
            "username": userName.value,
            "firstname": firstName.value,
            "lastname": lastName.value,
            "email": email.value,
            "password" : password.value,
            "roles": [role.value]
        }


        registerNewuser(userObject)
    }
}

const registerNewuser = (user) => {
    fetch('http://projectenshuuemployee-env.eba-qw8yp2xr.us-east-2.elasticbeanstalk.com/api/auth/signup', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then( res => res.json() )
    .then( res => {
        successNotification(user.username)
    } ).catch(function () {
     console.log("Promise Rejected");
    });
}

const successNotification = (username) => {
    sessionStorage.setItem("successRegister", `<strong>${username}</strong>が登録完了`);
    location.reload();
}

// run all function=====================================================================


checkAuthorization(localstorage_user)
window.onload = () => {
    initialpageData()

    if(sessionStorage.getItem("successRegister") !== null) {
        let feedbackMessage = document.getElementById('register-message')
        feedbackMessage.style.display = 'block'
        
        let message = sessionStorage.getItem("successRegister")
        document.getElementById('success-message').innerHTML = message
        
        document.getElementById('closeAlertMessage').addEventListener('click', () => {
            sessionStorage.clear()
            console.log('clear')
        })
    }
    
    document.getElementById('submitRegister').addEventListener('click', (e) => {
        e.preventDefault()
        checkForm()
    })
}

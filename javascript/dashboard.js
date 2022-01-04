const localstorage_user = JSON.parse(localStorage.getItem('user'))



window.onload = () => {
    document.querySelector('.userName').textContent = localstorage_user.username.charAt(0).toUpperCase() + localstorage_user.username.slice(1)

    let activeClass = document.getElementsByClassName('active');
    while (activeClass.length) activeClass[0].classList.remove('active');
    document.querySelector('#dashboardNav').classList.add('active')

    checkAuthorization(localstorage_user)
}

const checkAuthorization = (user) => {
    if(!user) {
        location.href = 'login.html';
    }
    const token = user.accessToken
    let page = ''
    
    switch(user.roles[0]) {
        case 'ROLE_ADMIN':
            page = 'admin'
            break;
        case 'ROLE_MODERATOR':
            page = 'moderator'
            break;
        case 'ROLE_USER':
            page = 'user'
            break;
    }

    
    fetch( `http://projectenshuuemployee-env.eba-qw8yp2xr.us-east-2.elasticbeanstalk.com/api/test/${page}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-access-token': token
        },
    }).then( res => res.json() )
    .then( res => {
       
        pageData()
    } ).catch(function () {
        console.log("Promise Rejected");
   });
}





// Generate page data
const pageData = () => {
    

    // remove and add active class to sidebar Nav
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem("user");
        location.href = 'login.html';
    })
}


// Generate page for admin
const adminPage = () => {

}






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
    document.querySelector('#userListNav').classList.add('active')

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem("user");
        location.href = 'login.html';
    })

}

const getAllUser = (user) => {
    const token = user.accessToken
    fetch( `http://projectenshuuemployee-env.eba-qw8yp2xr.us-east-2.elasticbeanstalk.com/api/user/allUser`, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'x-access-token': token
        },
    }).then( res => res.json() )
    .then( res => {
        console.log(res)
        showAllUser(res)
    } ).catch(function () {
        console.log("Promise Rejected");
   });
}

const showAllUser = (data) => {
    let table_data = ""
    count = 1
    const table = document.getElementById('userData')
    data.forEach(single_data => {
        let name = ''
        if(single_data.lastname !== undefined) {
            name += `${single_data.lastname}`
        }
        if(single_data.firstname !== undefined) {
            name += ` ${single_data.firstname}`
        }
        table_data += `
        <tr>
            <th>${count++}</th>
            <td>${single_data.username}</td>
            <td>${name}</td>
            <td>${single_data.email}</td>
            <td>${getRole(single_data.roles[0])}</td>
        </tr>
      `
    })
    
    table.innerHTML = table_data
}

const getRole = (roleId) => {
    let role = ''
    switch(roleId) {
        case '61d24f31e08c1ebcebb06fe3':
            role = 'user'
            break
        case '61d24f31e08c1ebcebb06fe5':
            role = 'admin'
            break
    }

    return role
}
// run all function=====================================================================


checkAuthorization(localstorage_user)
window.onload = () => {
    initialpageData()
    getAllUser(localstorage_user)
}

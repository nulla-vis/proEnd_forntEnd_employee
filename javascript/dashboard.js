const localstorage_user = JSON.parse(localStorage.getItem('user'))

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
      
       employeeCount(res)
        
    } ).catch(function () {
        console.log("Promise Rejected");
   });
}

const employeeCount = (data) => {
    document.querySelector('.employee-count').textContent = data.length
}

const getAllOrderhistrory = () => {
    $.ajax({
        url:'http://localhost:3000/order/allFinishedDetail',
        method: 'get',
        contentType: "application/json",
        success: function(data) {
            showData(data)
            buildLineChart(data)
        },
        error: function(errorThrown) {
            alert(errorThrown)
        }
    })
}

const showData = (data) => {
    let completed = 0
    let canceled = 0
    data.forEach(single_data => {
        if(single_data.status === 2) {
            completed++
        }
        if(single_data.status === 3) {
            canceled++
        }
    })

    document.querySelector('.order-completed').textContent = completed
    document.querySelector('.order-canceled').textContent = canceled

    buildPieChart(completed, canceled)
}

const buildLineChart = (order_data) => {
    current_year = new Date().getFullYear()
    month_array = [0,0,0,0,0,0,0,0,0,0,0,0]
    order_data.forEach(single_data => {
        data_time = new Date(single_data.updatedAt)
        if(data_time.getYear()+1900 === current_year) {
            month_array[data_time.getMonth()]++
        }
    })
    console.log(month_array)
    datanya = new Date(order_data[0].updatedAt)
    console.log(datanya.getYear()+1900)
    console.log(current_year)

    
    const labels = [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月',
    ];
    
    const data = {
    labels: labels,
    datasets: [{
        label: '注文数',
        lineTension: 0.3,
        pointRadius: 3,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: month_array,
    }]
    };
    
    const config = {
    type: 'line',
    data: data,
    options: {}
    };

    const myChart = new Chart(
        document.getElementById('myAreaChart'),
        config
    );
}

const buildPieChart = (completed, canceled) => {    
        var ctx = document.getElementById("myPieChart");
        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ["全注文数", "注文完了数", "キャンセル注文数"],
                datasets: [{
                data: [completed+canceled, completed, canceled],
                backgroundColor: ['#4e73df', '#1cc88a', '#e63737'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#e20d0d'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 0/5,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutoutPercentage: 80,
            },
        });
}


checkAuthorization(localstorage_user)
window.onload = () => {

    document.querySelector('.userName').textContent = localstorage_user.username.charAt(0).toUpperCase() + localstorage_user.username.slice(1)

    let activeClass = document.getElementsByClassName('active');
    while (activeClass.length) activeClass[0].classList.remove('active');
    document.querySelector('#dashboardNav').classList.add('active')

    getAllUser(localstorage_user)
    getAllOrderhistrory()
}






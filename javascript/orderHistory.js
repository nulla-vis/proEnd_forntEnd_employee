// options for date
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log('order history')
// options for currency
const formatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
});

const checkAuthorization = (user) => {
    if(!user) {
        location.href = 'login.html';
    }
}

const localstorage_user = JSON.parse(localStorage.getItem('user'))
checkAuthorization(localstorage_user)

window.onload = () => {
    // feedbackMessage()
    initialpageData()
    getAllOrderhistrory()
}

const initialpageData = () => {
    document.querySelector('.userName').textContent = localstorage_user.username.charAt(0).toUpperCase() + localstorage_user.username.slice(1)

    // remove and add active class to sidebar Nav
    let activeClass = document.getElementsByClassName('active');
    while (activeClass.length) activeClass[0].classList.remove('active');
    document.querySelector('#orderHistory').classList.add('active')

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem("user");
        location.href = 'login.html';
    })
}

const getAllOrderhistrory = () => {
    $.ajax({
        url:'http://localhost:3000/order/allOrders',
        method: 'get',
        contentType: "application/json",
        success: function(data) {
            console.log(data)
            buildOrderHistoryList(data)
        }
    })
}

const buildOrderHistoryList = (data) => {
    let table_data = ""
    count = 1
    const table = document.getElementById('orderHistoryData')
    data.forEach(single_data => {
        const data_date = new Date(single_data.createdAt)
        table_data += `
        <tr>
            <th>${count++}</th>
            <th>${single_data.id}</th>
            <td>${formatter.format(single_data.total_price)}</td>
            <td>${data_date.toLocaleDateString('ja-JP', options)} ${data_date.toLocaleTimeString('ja-JP')}</td>
            <td><span class="${setStatus(single_data.status).badge}">${setStatus(single_data.status).orderStatus}</span></td>
        </tr>
      `
    })
    
    table.innerHTML = table_data
}

const setStatus = (orderStatus) => {
    switch(orderStatus) {
        case 0:
            orderStatus = '注文した。'
            badge = 'badge badge-primary'
            break 
        case 1:
            orderStatus = '注文届け完了'
            badge = 'badge badge-info'
            break;   
        case 2:
            orderStatus = '注文完了(有料)'
            badge = 'badge badge-success'
            break 
        case 3:
            orderStatus = 'ご注文はキャンセルされました'
            badge = 'badge badge-danger'
            break;   
    }

    return {orderStatus: orderStatus, badge: badge}
}

const feedbackMessage = () => {
    if(sessionStorage.getItem("updatemessage") !== null) {
        let feedbackMessage = document.getElementById('alert-message')
        feedbackMessage.style.display = 'block'
        setTimeout(function() {
            feedbackMessage.style.display = 'none'
        },3500)
        sessionStorage.clear()
    }
}

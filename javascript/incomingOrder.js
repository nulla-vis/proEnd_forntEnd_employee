
window.onload = () => {
    checkAuthorization(localstorage_user)
    initialpageData()
    incomingAllOrder()
}
const localstorage_user = JSON.parse(localStorage.getItem('user'))
const socket = io("http://localhost:3000/");
socket.on('incomingOrder', function(data){
    buildOrderList(data.order) 
})

socket.on('getAllOrder', function(data){
    buildOrderList(data.order)   
}) 


const buildOrderList = (order_data) => {
    console.log(order_data[0])
    let all_order = ""
    for(order of order_data) {
        all_order +=`
        <div class="card" style="width: 18rem; margin-left: 20px; margin-top: 20px;">
            <img src="${order.menu_image}" class="card-img-top" alt="${order.menu_title}">
            <div class="card-body">
                <h5 class="card-title" style="text-align: center">${order.menu_title}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">数量 : ${order.amount}</li>
                <li class="list-group-item">テーブル番号 : ${order.table_number}</li>
            </ul>
            <div class="card-body" style="text-align: center;">
                <a href="" class="badge badge-pill badge-info updateOrder" id="updateOrder" style="margin: 0px 20px;" data-toggle="modal" data-target="#updateModal">更新</a>
                <a href="" class="badge badge-pill badge-danger deleteOrder" id="deleteOrder" style="margin: 0px 20px;">削除</a>
          </div>
        </div>
        `
    }

    document.querySelector('#showAllOrder').innerHTML = all_order
}


const checkAuthorization = (user) => {
    if(!user) {
        location.href = 'login.html';
    }
}

const initialpageData = () => {
    document.querySelector('.userName').textContent = localstorage_user.username.charAt(0).toUpperCase() + localstorage_user.username.slice(1)

    // remove and add active class to sidebar Nav
    let activeClass = document.getElementsByClassName('active');
    while (activeClass.length) activeClass[0].classList.remove('active');
    document.querySelector('#incomingOrderNav').classList.add('active')

    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem("user");
        location.href = 'login.html';
    })


}

const incomingAllOrder = () => {
    fetch( `http://localhost:3000/order/allIncoming`, {
        method: 'get',
    }).then( res => res.json()
    ).then( res => {
        console.log(res)
    } );
}

// update order

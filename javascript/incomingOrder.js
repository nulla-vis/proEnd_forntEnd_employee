
window.onload = () => {

    checkAuthorization(localstorage_user)
    initialpageData()

}
const localstorage_user = JSON.parse(localStorage.getItem('user'))
const socket = io("http://localhost:3000/");
socket.on('incomingOrder', function(data){
    buildOrderList(data.order) 
})

socket.on('getAllOrder', function(data){
    buildOrderList(data.order)   
}) 

const setStatus = (orderStatus) => {
    switch(orderStatus) {
        case 0:
            orderStatus = '料理中';
            break;
        case 1:
            orderStatus = 'ご注文はすぐに配達されます'
            break;
        case 2:
            orderStatus = '注文が届け完了'
            break 
        case 3:
            orderStatus = 'ご注文はキャンセルされました'
            break;   
    }

    return orderStatus
}


const buildOrderList = (order_data) => {
    let all_order = ""
    let order_status = ""
    for(order of order_data) {
        order_status = setStatus(order.status)
        all_order +=`
        <div class="card" style="width: 18rem; margin: 20px 15px;">
            <img src="${order.menu_image}" class="card-img-top" alt="${order.menu_title}" style="width: 100%; border: 1px solid rgba(0,0,0,.125); height: 160px">
            <div class="card-body" style="max-height: 55px">
                <h5 class="card-title" style="text-align: center">${order.menu_title}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">オーダーID : ${order.id}</li>
                <li class="list-group-item">数量 : ${order.amount}</li>
                <li class="list-group-item">テーブル番号 : ${order.table_number}</li>
                <li class="list-group-item">ステータス : ${order_status}</li>
            </ul>
            <div class="card-body" style="text-align: center;">
                <a href="" class="badge badge-pill badge-info updateOrder" id="updateOrder" style="margin: 0px 20px;" data-toggle="modal" data-target="#updateModal" data-id="${order.id}">更新</a>
                <a href="" class="badge badge-pill badge-danger deleteOrder" id="deleteOrder" style="margin: 0px 20px;">削除</a>
          </div>
        </div>
        `
    }

    document.querySelector('#showAllOrder').innerHTML = all_order

    updateSetting()

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

const feedbackMessage = () => {
    if(sessionStorage.getItem("updatemessage") !== null) {
        let feedbackMessage = document.getElementById('alert-message')
        console.log(sessionStorage.getItem("updatemessage"))
        feedbackMessage.style.display = 'block'
        setTimeout(function() {
            feedbackMessage.style.display = 'none'
        },3500)
        sessionStorage.clear()
    }
}


// update order
const updateSetting = () => {
    $(function() {
        $('.updateOrder').on('click', function() {
            
            const id = $(this).data('id')
            // change id in hidden input element tag in HTML
            $('#id').val(id)
        })

        
        $('#submitUpdate').on('submit', function(event) {
            event.preventDefault()
            const id = $('#id').val()
            const status = $('#status').val()
            $.ajax({
                url: 'http://localhost:3000/order/update',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify({id : id, status: status}),
                success: function(res) {
                }
            })

            sessionStorage.setItem("updatemessage", `オーダーID : ${id} のステータスが更新完了!。`);

            $(function () {
                $('#updateModal').modal('toggle');
                feedbackMessage()
             });

        })

        
    })
}
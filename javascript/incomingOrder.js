const localstorage_user = JSON.parse(localStorage.getItem('user'))
// options for date
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

// check authorization before accessing the page
const checkAuthorization = (user) => {
    if(!user) {
        location.href = 'login.html';
    }
}

checkAuthorization(localstorage_user)

window.onload = () => {
    feedbackMessage()
    initialpageData()
}

const socket = io("http://localhost:3000/");
socket.on('incomingOrder', function(data){
        document.getElementById("no-order-message").style.display = 'none'
        buildOrderList(data.order) 
})

socket.on('getAllOrder', function(data){
    if(data.message || data.order.every(item => item.status > 1)) {
        document.getElementById("no-order-message").style.display = 'block'
    }else {
        document.getElementById("no-order-message").style.display = 'none'
        buildOrderList(data.order) 
    }
}) 

const setStatus = (orderStatus) => {
    switch(orderStatus) {
        case 0:
            orderStatus = '料理中';
            badge = 'badge badge-primary'
            break;
        case 1:
            orderStatus = 'ご注文はすぐに配達されます'
            badge = 'badge badge-info'
            break;
        case 2:
            orderStatus = '注文が届け完了'
            badge = 'badge badge-success'
            break 
        case 3:
            orderStatus = 'ご注文はキャンセルされました'
            badge = 'badge badge-danger'
            break;   
    }

    return {orderStatus: orderStatus, badge: badge}
}


const buildOrderList = (order_data) => {
    let all_order = ""
    for(order of order_data) {
        if(order.status <= 2) {
            const data_date = new Date(order.createdAt)
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
                    <li class="list-group-item">日時 : <p style="text-align:center;">${data_date.toLocaleDateString('ja-JP', options)} ${data_date.toLocaleTimeString('ja-JP')}</p></li>
                    <li class="list-group-item">ステータス : <h5 style="text-align:center;"><span class="${setStatus(order.status).badge}">${setStatus(order.status).orderStatus}</span></h5></li>
                </ul>
                <div class="card-body" style="text-align: center;">
                    <a href="" class="badge badge-pill badge-info updateOrder" id="updateOrder" style="margin: 0px 20px;" data-toggle="modal" data-target="#updateModal" data-id="${order.id}">更新</a>
                    <a href="" class="badge badge-pill badge-danger deleteOrder" id="deleteOrder" style="margin: 0px 20px;" data-toggle="modal" data-target="#deleteModal" data-id="${order.id}">削除</a>
              </div>
            </div>
            `
        }
    }

    document.querySelector('#showAllOrder').innerHTML = all_order

    updateSetting()

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
    if(sessionStorage.getItem("updateMessage") !== null) {
        let feedbackMessage = document.getElementById('alert-message')
        feedbackMessage.style.display = 'block'
        setTimeout(function() {
            feedbackMessage.style.display = 'none'
        },3500)
        sessionStorage.clear()
    }
    if(sessionStorage.getItem("deleteMessage") !== null) {
        let feedbackMessage = document.getElementById('alert-message')
        feedbackMessage.textContent = sessionStorage.getItem("deleteMessage")
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

        $('.deleteOrder').on('click', function() {
            
            const id = $(this).data('id')
            // change id in hidden input element tag in HTML
            $('#deleteId').val(id)
            $('.modalDeleteContent').html(`<h5>オーダーID<span style="color: red;">${id}</span>を削除しますか。</h5>`)
            
        })

        
        $('#submitUpdate').on('submit', function(event) {
            // event.preventDefault()
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

            sessionStorage.setItem("updateMessage", `オーダーID : ${id} のステータスが更新完了!。`);

            // $(function () {
            //     $('#updateModal').modal('toggle');
            //     feedbackMessage()
            //  });

        })

        $('#submitDeleteOrder').on('submit', function(event) {
            console.log('masuk')
            // event.preventDefault()
            const id = $('#deleteId').val()
            $.ajax({
                url: 'http://localhost:3000/order/delete',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify({id : id}),
                success: function(res) {
                }
            })

            sessionStorage.setItem("deleteMessage", `オーダーID : ${id} 削除しました。`);
        })

        
    })
}
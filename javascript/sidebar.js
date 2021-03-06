const generateSideBar = (user_role) => {
    switch(user_role) {
        case 'ROLE_ADMIN':
            adminSideBar()
            break;
        case 'ROLE_USER':
            userSideBar()
    }
}
const adminSideBar = () => {
    sidebar = document.querySelector('#accordionSidebar')

    sidebar.innerHTML = `
    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="dashboard.html">
        <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-utensils"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Contactless Admin</div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Nav Item - Dashboard -->
    <li class="nav-item" id="dashboardNav">
        <a class="nav-link" href="dashboard.html">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>ダッシュボード</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">


    <!-- Nav Item - User Menu -->

    <li class="nav-item" id="userListNav">
        <a class="nav-link" href="userList.html">
        <i class="fas fa-users"></i>
            <span>ユーザ一覧</span></a>
    </li>
    <li class="nav-item" id="newUserNav">
        <a class="nav-link" href="registerUser.html">
        <i class="fas fa-user-plus"></i>
            <span>新ユーザー登録</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Nav Item - Order Menu -->

    <li class="nav-item" id="incomingOrderNav">
        <a class="nav-link" href="incomingOrder.html">
        <i class="fas fa-concierge-bell"></i>
            <span>入ってくる注文</span></a>
    </li>
    <li class="nav-item" id="orderHistory">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#orderHistory"
            aria-expanded="true" aria-controls="orderHistory">
            <i class="fas fa-list-ul"></i>
            <span>注文履歴</span>
        </a>
        <div id="orderHistory" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <a class="collapse-item" href="orderDetailHistory.html">注文詳細一覧</a>
                <a class="collapse-item" href="orderHistory.html">注文一覧</a>
            </div>
        </div>
    </li>
    
    <!-- Divider -->
    <hr class="sidebar-divider">
    `
}

const userSideBar = () => {
    sidebar = document.querySelector('#accordionSidebar')

    sidebar.innerHTML = `
    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="dashboard.html">
        <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-utensils"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Contactless</div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Nav Item - Dashboard -->
    <li class="nav-item" id="dashboardNav">
        <a class="nav-link" href="dashboard.html">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>ダッシュボード</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">

    <!-- Nav Item - Order Menu -->

    <li class="nav-item" id="incomingOrderNav">
        <a class="nav-link" href="incomingOrder.html">
        <i class="fas fa-concierge-bell"></i>
            <span>入ってくる注文</span></a>
    </li>
    <li class="nav-item" id="orderHistory">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#orderHistory"
            aria-expanded="true" aria-controls="orderHistory">
            <i class="fas fa-list-ul"></i>
            <span>注文履歴</span>
        </a>
        <div id="orderHistory" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
                <a class="collapse-item" href="orderDetailHistory.html">注文詳細一覧</a>
                <a class="collapse-item" href="orderHistory.html">注文一覧</a>
            </div>
        </div>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider">
    `
}


generateSideBar(localstorage_user.roles[0])

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
   return () => import(`./components/${path}.vue`)
}

const router = new VueRouter({
    mode:"history",
    routes: [
        {
            path:'/',
            name:'Main',
            meta:{title:'Main'},
            component: importComponent('Main'),
        },
        {
            path:"/customer",
            name:"Customer",
            meta: {title:'Customer'},
            component: importComponent('Customer/DashboardLayoutCustomer'),
            children: [
                {
                    path: '/profile-customer',
                    name: 'Profile',
                    meta: {title: 'Profile'},
                    component: importComponent('Customer/Profile'),
                },
                {
                    path: '/transaksi',
                    name: 'Transaksi',
                    meta: {title: 'Transaksi'},
                    component: importComponent('Customer/Transaksi'),
                },
            ]
        },
        {
            path: '/admin',
            name: 'Admin',
            meta: {title: 'Admin'},
            component: importComponent('Admin/DashboardLayoutAdmin'),
            children: [
                {
                    path: '/profile-admin',
                    name: 'Profile',
                    meta: {title: 'Profile'},
                    component: importComponent('Admin/Profile'),
                },
                {
                    path: '/kelola-pegawai',
                    name: 'Pegawai',
                    meta: {title: 'Pegawai'},
                    component: importComponent('Admin/Pegawai'),
                },
                {
                    path: '/kelola-driver',
                    name: 'Driver',
                    meta: {title: 'Driver'},
                    component: importComponent('Admin/Driver'),
                },
                {
                    path: '/kelola-mobil',
                    name: 'Mobil',
                    meta: {title: 'Mobil'},
                    component: importComponent('Admin/Mobil'),
                },
                {
                    path: '/kelola-mitra',
                    name: 'Mitra',
                    meta: {title: 'Mitra'},
                    component: importComponent('Admin/Mitra'),
                }
            ]
        },
        {
            path: '/customerservice',
            name: 'Customer Service',
            meta: {title: 'Customer Service'},
            component: importComponent('CustomerService/DashboardLayoutCustomerService'),
            children: [
                {
                    path: '/profile-customerservice',
                    name: 'Profile Customer Service',
                    meta: {title: 'Profile'},
                    component: importComponent('CustomerService/Profile'),
                },
                {
                    path: '/data-customer',
                    name: 'Data Customer',
                    meta: {title: 'Customer'},
                    component: importComponent('CustomerService/Customer'),
                },
                {
                    path: '/data-transaksi',
                    name: 'Data Transaksi',
                    meta: {title: 'Transaksi'},
                    component: importComponent('CustomerService/Transaksi'),
                }
            ]
        },
        {
            path: '/manager',
            name: 'Manager',
            meta: {title: 'Manager'},
            component: importComponent('Manager/DashboardLayoutManager'),
            children: [
                {
                    path: '/profile-manager',
                    name: 'Profile Manager',
                    meta: {title: 'Profile'},
                    component: importComponent('Manager/Profile'),
                },
                {
                    path: '/kelola-promo',
                    name: 'Promo',
                    meta: {title: 'Promo'},
                    component: importComponent('Manager/Promo'),
                },
                {
                    path: '/penjadwalan-pegawai',
                    name: 'Detail Jadwal Pegawai',
                    meta: {title: 'Penjadwalan Pegawai'},
                    component: importComponent('Manager/DetailJadwal'),
                },
                {
                    path: '/kelola-jadwal',
                    name: 'Jadwal Pegawai',
                    meta: {title: 'Jadwal Pegawai'},
                    component: importComponent('Manager/Jadwal'),
                },
                {
                    path: '/rating-ajr',
                    name: 'Rating AJR',
                    meta: {title: 'Rating AJR'},
                    component: importComponent('Manager/RatingPerusahaan'),
                }
            ]
        },
        
        
        
    ]
});

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title
    if (to.name !== 'Main' && localStorage.getItem('token')===null) next({ name: 'Main' })
    else next()
})

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title
    if (to.name === 'Manager' && localStorage.getItem('role')!=='Manager') next({ name: localStorage.getItem('role')})
    else next()
})

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title
    if (to.name === 'Customer Service' && localStorage.getItem('role')!=='Customer Service') next({ name: localStorage.getItem('role')})
    else next()
})

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title
    if (to.name === 'Admin' && localStorage.getItem('role')!=='Admin') next({ name: localStorage.getItem('role')})
    else next()
})

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title
    if (to.name === 'Customer' && localStorage.getItem('role')!=='Customer') next({ name: localStorage.getItem('role')})
    else next()
})


export default router;
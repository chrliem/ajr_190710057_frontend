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
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: importComponent('Admin/DashboardLayoutAdmin'),
            children: [
                {
                    path: '/profile-pegawai',
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
    //     {
    //         path: '/customerservice',
    //         name: 'customerservice',
    //         component: importComponent('CustomerService/DashboardLayout'),
    //         children: [
    //             {
    //                 path: '/customer',
    //                 name: 'customer',
    //                 meta: {title: 'customer'},
    //                 component: importComponent('CustomerService/Customer'),
    //             }
    //         ]
    //     },
    //     {
    //         path: '/manager',
    //         name: 'manager',
    //         component: importComponent('Manager/DashboardLayout'),
    //         children: [
    //             {
    //                 path: '/promo',
    //                 name: 'promo',
    //                 meta: {title: 'promo'},
    //                 component: importComponent('Manager/Promo'),
    //             },
    //             {
    //                 path: '/jadwal',
    //                 name: 'jadwal',
    //                 meta: {title: 'jadwal'},
    //                 component: importComponent('Manager/Jadwal'),
    //             }
    //         ]
    //     },
        
        
        
    ]
});

router.beforeEach((to,from,next)=>{
    document.title=to.meta.title
    next()
})

export default router;
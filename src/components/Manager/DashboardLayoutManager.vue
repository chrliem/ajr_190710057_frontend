<template>
    <div class="dashboard">
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant.sync="mini"
        permanent
        class="fullheight elevation-6"
        app
        color="blue lighten-4"
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img :src="logoAJR"></v-img>
          </v-list-item-avatar>

          <v-list-item-title><strong>Manager</strong></v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            tag="router-link"
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn color="red" @click="logout">Logout</v-btn>
      </v-navigation-drawer>
      <router-view></router-view>
        
    </div>
</template>
<script>
export default {
 name: "Dashboard",
 data() {
   return {
     drawer:true,
     logoAJR: require('@/assets/logoAJR.png'),
     items: [
       { title: localStorage.getItem('nama'), icon: "mdi-account-circle", to: "/profile-manager" },
       { title: "Jadwal", icon: "mdi-account-clock", to: "/kelola-jadwal" },
       { title: "Penjadwalan", icon: "mdi-account-multiple-plus", to: "/penjadwalan-pegawai" },
       { title: "Promo", icon: "mdi-ticket-percent", to: "/kelola-promo" },
       { title: "Rating AJR", icon: "mdi-star", to: "/rating-ajr" }
     ],
   }   
 },
 
 methods:{
      logout(){
        localStorage.removeItem('id')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('nama')
        this.$router.push({name:'Main'})
      },
//       readData(){
//             var url=this.$api+'/getuser/' + localStorage.getItem('id')
//             this.$http.get(url,{
//                 headers:{
//                     'Authorization':'Bearer '+localStorage.getItem('token')
//                 }
//             }).then(response=>{
//                 this.users=response.data.data
//             })
//         },
//  },
//  mounted(){
//         this.readData();
    },
};
</script>
<stylescoped>
  .fullheight{
    min-height:100vh !important;
  }
</style>
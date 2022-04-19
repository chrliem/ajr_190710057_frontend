<template>
 <v-main class="list">
     
    <v-container class="fullheight">
        <h3 class="text-h3 font-weight-medium mb-5">Pegawai AJR</h3>
        
        <v-card color="orange lighten-2+" class="elevation-6">
            <v-card-title class="elevation-4 yellow darken-2">
                <h3 class="text-h3 font-weight-medium">Profile</h3>
            </v-card-title>
        </v-card>
    </v-container>
    
    <v-container>
    <v-card color="orange lighten-2" class="elevation-6">
  
      <v-card-text align="left">
            <div class="text-left">Nama Pegawai    : {{pegawais.nama_pegawai}}</div>
            <div class="text-left">Role            : {{setRole(pegawais.id_role)}}</div>
            <div class="text-left">Tanggal Lahir   : {{pegawais.tgl_lahir_pegawai}}</div>
            <div class="text-left">Jenis Kelamin   : {{pegawais.jenis_kelamin_pegawai}}</div>
            <div class="text-left">Alamat          : {{pegawais.alamat_pegawai}}</div>
            <div class="text-left">No Telepon      : {{pegawais.no_telepon_pegawai}}</div>
            <div class="text-left">Alamat email    : {{pegawais.email_pegawai}}</div>
            <div
                v-bind:class="setColorStatus(pegawais.status_aktif)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatus(pegawais.status_aktif)}}</div>
      </v-card-text>
    <v-card-actions>
       <v-btn class="mr-2" @click="dialog = true" color="cyan darken-4 white--text" fab large>
        <span class="material-icons" >border_color </span>
        </v-btn>
    </v-card-actions>
  </v-card>
   </v-container>

   <v-dialog v-model="dialog" persistent max-width="600px">
     <v-card class="amber accent-1">
        <v-card-text class="pt-4">
            <div>
                <v-form  ref="form">
                    <v-text-field label="Name" v-model="pegawais.nama_pegawai"> </v-text-field>
                    <v-layout justify-end>
                        <v-btn class="mr-2" @click="submit" color="cyan darken-4 white--text">
                        <span class="material-icons">check</span> UPDATE
                        </v-btn>
                        <v-btn @click="close" class="grey darken-3 white--text mr-2">
                        <span class="material-icons">close</span>BATAL
                        </v-btn>
                            
                    </v-layout>
                </v-form>
            </div>
        </v-card-text>
    </v-card>
   </v-dialog>
   <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
    {{error_message}}
    </v-snackbar> 
 </v-main>
</template>
<script>
/* eslint-disable */
export default{
    name: "Profile",
    data() {
        return {
            load: false,
            snackbar: false,
            error_message: '',
            color: '', 
            dialog: false,
            pegawais:[],
        };
    },
    methods: {
    readData(){
            var url=this.$api+'/pegawai/3' //+ localStorage.getItem('id')
            this.$http.get(url,{
                headers:{
                    'Authorization':'Bearer '+localStorage.getItem('token')
                }
            }).then(response=>{
                this.pegawais=response.data.data
            })
        },
        setStatus(status_aktif){
      if(status_aktif===1){
        return 'Aktif'
      }else{
        return 'Tidak Aktif'
      }
    },
    setColorStatus(status_aktif){
      if(status_aktif===1){
        return 'success'
      }else{
        return 'warning'
      }
    },
    setRole(id_role){
      if(id_role===1){
        return 'Manager'
      }else if(id_role===2){
        return 'Customer Service'
      }else if(id_role===3){
        return 'Admin'
      }
    },
    },
    
    mounted(){
        this.readData();
    },
}
</script>
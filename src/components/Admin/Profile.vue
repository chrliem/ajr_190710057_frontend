<template>
 <v-main class="list">
     
    <v-container class="fullheight">        
        <v-card class="elevation-6">
            <v-card-title class="elevation-4">
                <h3 class="text-h3 font-weight-medium">Profil Pegawai</h3>
            </v-card-title>
        </v-card>
    </v-container>
    
    <v-container>
    <v-card class="elevation-6">
  
      <v-card-text align="left">
        <v-img
                :src="$baseURL+'/storage/foto_pegawai/'+pegawais.foto_pegawai+'/'"
                height="200px"
                width="200px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img height="550px" width="550px" :src="$baseURL+'/storage/foto_pegawai/'+pegawais.foto_pegawai+'/'"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div class="text-left"><strong>Nama Pegawai </strong>   : {{pegawais.nama_pegawai}}</div>
            <div class="text-left"><strong>Role          </strong>   : {{setRole(pegawais.id_role)}}</div>
            <div class="text-left"><strong>Tanggal Lahir </strong>   : {{pegawais.tgl_lahir_pegawai}}</div>
            <div class="text-left"><strong>Jenis Kelamin </strong>   : {{pegawais.jenis_kelamin_pegawai}}</div>
            <div class="text-left"><strong>Alamat        </strong>   : {{pegawais.alamat_pegawai}}</div>
            <div class="text-left"><strong>No Telepon    </strong>   : {{pegawais.no_telepon_pegawai}}</div>
            <div class="text-left"><strong>Alamat email  </strong>   : {{pegawais.email}}</div>
            <v-chip
                v-bind:class="setColorStatus(pegawais.status_aktif)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatus(pegawais.status_aktif)}}</v-chip>
      </v-card-text>
  </v-card>
   </v-container>

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
          show:false,
          show1: false,
            load: false,
            snackbar: false,
            error_message: '',
            color: '', 
            dialog: false,
            pegawais:[],
            absolute: true,
            overlay: false,
            pegawai: new FormData,
            form:{
              nama_pegawai: null,
              id_role: null,
              tgl_lahir_pegawai: null,
              jenis_kelamin_pegawai: null,
              alamat_pegawai: null,
              no_telepon_pegawai: null,
              foto_pegawai: null,
              email_pegawai: null,
              password_pegawai: null
            }
        };
    },
    methods: {
    readData(){
            var url=this.$api+'/pegawai/' + localStorage.getItem('id')+'/'
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
    close(){
        this.dialog = false;
        },
    },
    
    mounted(){
        this.readData();
    },
}
</script>
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
            <div class="text-left"><strong>Alamat email  </strong>   : {{pegawais.email_pegawai}}</div>
            <v-chip
                v-bind:class="setColorStatus(pegawais.status_aktif)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatus(pegawais.status_aktif)}}</v-chip>
      </v-card-text>
    <v-card-actions>
    </v-card-actions>
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
    update(){
                this.pegawai.append('nama_pegawai',this.form.nama_pegawai);
                this.pegawai.append('id_role', this.form.id_role);
                this.pegawai.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('alamat_pegawai',this.form.alamat_pegawai);
                this.pegawai.append('no_telepon_pegawai',this.form.no_telepon_pegawai);
                this.pegawai.append('foto_pegawai',this.form.foto_pegawai);
                this.pegawai.append('email_pegawai', this.form.email_pegawai);
                this.pegawai.append('password_pegawai', this.form.password_pegawai);
                this.pegawai.append('status_aktif',this.form.status_aktif);
              
                var url = this.$api+'/pegawai/'+this.editId+'/';
                this.load = true;
                this.$http.post(url, this.pegawai, {
                    headers: {
                    'Authorization':'Bearer' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType='Tambah';
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            close(){
                this.dialog = false;
        },
        resetForm(){
                this.form = {
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
            },
            cancel(){
                this.resetForm();
                this.dialog = false;
        },
        editHandler(pegawais){
                this.editId = pegawais.id_pegawai;
                this.form.nama_pegawai = pegawais.nama_pegawai;
                this.form.id_role = pegawais.id_role;
                this.form.tgl_lahir_pegawai = pegawais.tgl_lahir_pegawai;
                this.form.jenis_kelamin_pegawai = pegawais.jenis_kelamin_pegawai;
                this.form.alamat_pegawai = pegawais.alamat_pegawai;
                this.form.no_telepon_pegawai = pegawais.no_telepon_pegawai;
                this.form.foto_pegawai = pegawais.foto_pegawai;
                this.form.email_pegawai = pegawais.email_pegawai;
                this.form.password_pegawai = pegawais.password_pegawai;
                this.form.status_aktif = pegawais.status_aktif;
                this.dialog = true;
            },
    },
    
    mounted(){
        this.readData();
    },
}
</script>
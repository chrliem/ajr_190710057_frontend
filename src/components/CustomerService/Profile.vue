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
                :src="$baseURL+'/storage/foto_pegawai/'+pegawais.foto_pegawai"
                height="200px"
                width="200px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img :src="$baseURL+'/storage/foto_pegawai/'+pegawais.foto_pegawai"></v-img>
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
       <!-- <v-btn color="primary" dark @click="editHandler(pegawais)" > Edit Profil
        </v-btn> -->
    </v-card-actions>
  </v-card>
   </v-container>

  <!-- <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> Edit Profil Pegawai </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
            <v-radio-group v-model="form.id_role" label="Role Pegawai" required>
              <v-radio v-bind:value="2" label="Customer Service"></v-radio>
              <v-radio v-bind:value="3" label="Admin"></v-radio>
            </v-radio-group>
            <p>Tanggal Lahir Pegawai</p>
            <v-date-picker v-model="form.tgl_lahir_pegawai" label="Tanggal Lahir Pegawai" required></v-date-picker>
            <v-radio-group v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin Pegawai" required>
              <v-radio value="Laki-laki" label="Laki-laki"></v-radio>
              <v-radio  value="Perempuan" label="Perempuan"></v-radio>
            </v-radio-group>
            <v-text-field v-model="form.alamat_pegawai" label="Alamat Pegawai" required></v-text-field>
            <v-text-field v-model="form.no_telepon_pegawai" label="No Telepon Pegawai" required></v-text-field>
            <v-text-field v-model="form.email_pegawai" label="Email Pegawai" required></v-text-field>
            <v-text-field 
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                v-model="form.password_pegawai" label="Password Pegawai" required></v-text-field>
            <v-file-input
                v-model="form.foto_pegawai"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Foto Pegawai"
                prepend-icon="mdi-camera"
                label="Foto Pegawai"
              ></v-file-input>       
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="update">Simpan</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog> -->

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
            var url=this.$api+'/pegawai/' + localStorage.getItem('id')
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
              
                var url = this.$api+'/pegawai/'+this.editId;
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
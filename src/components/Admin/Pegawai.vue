<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Pegawai AJR </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Pegawai</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :items-per-page="10" :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.id_role`]="{ item }">
                    <span v-if="item.id_role===2"><div>Customer Service</div></span>
                    <span v-else-if="item.id_role===3"><div>Admin</div></span>
                     <span v-else-if="item.id_role===1"><div>Manager</div></span>
                </template>
                 <template v-slot:[`item.status_aktif`]="{ item }">
                    <span v-if="item.status_aktif===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_aktif===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.foto_pegawai`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/foto_pegawai/'+item.foto_pegawai+'/'"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="green" @click="viewHandler(item.id_pegawai)">mdi-eye-circle</v-icon></v-chip>
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip v-show="item.status_aktif===1"><v-icon color="red" @click="deleteHandler(item.id_pegawai)">mdi-delete</v-icon></v-chip>                  
                </template>
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="detail_pegawai" persistent max-width="600px">
            <v-card max-width="600px">
              <v-card-title>
                  Detail Data Pegawai
                  <v-spacer></v-spacer>
                   <v-btn color="success" @click="close">Close</v-btn>
            </v-card-title>
            <v-card-text align="left">
            <v-img
                :src="$baseURL+'/storage/foto_pegawai/'+pegawai1.foto_pegawai+'/'"
                height="200px"
                width="200px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img width="550px" height="550px" :src="$baseURL+'/storage/foto_pegawai/'+pegawai1.foto_pegawai+'/'"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div class="text-left"><strong>Nama Pegawai </strong>   : {{pegawai1.nama_pegawai}}</div>
            <div class="text-left"><strong>Role          </strong>   : {{setRole(pegawai1.id_role)}}</div>
            <div class="text-left"><strong>Tanggal Lahir </strong>   : {{pegawai1.tgl_lahir_pegawai}}</div>
            <div class="text-left"><strong>Jenis Kelamin </strong>   : {{pegawai1.jenis_kelamin_pegawai}}</div>
            <div class="text-left"><strong>Alamat        </strong>   : {{pegawai1.alamat_pegawai}}</div>
            <div class="text-left"><strong>No Telepon    </strong>   : {{pegawai1.no_telepon_pegawai}}</div>
            <div class="text-left"><strong>Alamat email  </strong>   : {{pegawai1.email}}</div>
            <v-chip
                v-bind:class="setColorStatus(pegawai1.status_aktif)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatus(pegawai1.status_aktif)}}</v-chip>
                </v-card-text>
               
            </v-card>
            </v-dialog>

        <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Pegawai </span>
        </v-card-title>
        <v-card-text>
          <v-container>
              
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
            <v-radio-group  v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.id_role" label="Role Pegawai" required>
              <v-radio v-bind:value="1" label="Manager"></v-radio>
              <v-radio v-bind:value="2" label="Customer Service"></v-radio>
              <v-radio v-bind:value="3" label="Admin"></v-radio>
            </v-radio-group>
            <p v-show="cekStatusAktif(form.status_aktif)===false">Tanggal Lahir Pegawai</p>
            <v-date-picker v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.tgl_lahir_pegawai" label="Tanggal Lahir Pegawai" required></v-date-picker>
            <v-radio-group v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.jenis_kelamin_pegawai" label="Jenis Kelamin Pegawai" required>
              <v-radio value="Laki-laki" label="Laki-laki"></v-radio>
              <v-radio  value="Perempuan" label="Perempuan"></v-radio>
            </v-radio-group>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.alamat_pegawai" label="Alamat Pegawai" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.no_telepon_pegawai" label="No Telepon Pegawai" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.email_pegawai" label="Email Pegawai" required></v-text-field>
            <v-form ref="form">
                <v-file-input 
                    ref="foto_pegawai"
                    v-show="cekStatusAktif(form.status_aktif)===false"
                    id="foto"
                    enctype="multipart/form-data"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Upload Foto Pegawai"
                    prepend-icon="mdi-camera"
                    label="Foto Pegawai"
                ></v-file-input>       
              </v-form>
            <v-radio-group v-if="cekStatusAktif(form.status_aktif)"  v-model="form.status_aktif" label="Status Aktif" required>
                <v-radio v-bind:value="1" label="Aktif"></v-radio>
                <v-radio v-bind:value="0" label="Tidak Aktif"></v-radio>
            </v-radio-group>    
              
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="setForm">Simpan</v-btn>          
        </v-card-actions>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" top>
            <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
            </div>
        </v-snackbar>
      </v-card>
    </v-dialog>

     <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Anda yakin ingin menghapus pegawai ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">Hapus</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm1" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Anda yakin ingin mengubah data pegawai ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel1">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="update">Konfirmasi</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar1" :color="color" timeout="2000" bottom>
        {{response_message}}
        </v-snackbar> 
    </v-main>
</template>

<script>
/* eslint-disable */ 
    export default{
        name: "Pegawai", 

        data(){
            return{
                show:false,
                show1:false,
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                snackbar1: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                dialogConfirm1: false,
                detail_pegawai: false,
                response_message: '',
                overlay: false,
                headers: [
                    {text: "Foto", value:"foto_pegawai"},
                    {text: "Nama Pegawai", value: "nama_pegawai", align: "center", width: "25%"},
                    {text: "Role", value: "id_role", align: "center", width: "25%"},
                    {text: "Status Aktif", value: "status_aktif", align: "center", width: "25%"},
                    {text: "Actions", value:'actions',align: "center", width: "25%"}
                ],
                pegawai: new FormData,
                pegawai1: [],
                pegawais: [],
                form: {
                    nama_pegawai: '',
                    id_role: '',
                    tgl_lahir_pegawai: '',
                    jenis_kelamin_pegawai: '',
                    alamat_pegawai: '',
                    no_telepon_pegawai: null,
                    email_pegawai: null,
                    password_pegawai: null,
                    foto_pegawai: null,
                },
                editId: '',
                deleteId: '',
                getId:'',
            };
        },
        methods:{
            setForm(){
                if(this.inputType !== 'Tambah'){
                    this.dialogConfirm1 = true;
                }else{
                    this.save();
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
            cekInputType(){
                if(this.inputType==='Tambah'){
                    return false;
                }else return true;
            },
            cekStatusAktif(status_aktif){
                if(status_aktif===0){
                    return true;
                }else{
                    return false;
                }
            },
            setColorStatus(status_aktif){
                if(status_aktif===1){
                    return 'success'
                }else{
                    return 'warning'
                }
            },
            setStatus(status_aktif){
                if(status_aktif===1){
                    return 'Aktif'
                }else{
                    return 'Tidak Aktif'
                }
            },
            readData(){
                var url=this.$api+'/pegawai/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                            'Access-Control-Allow-Origin':'*'
                        }
                    }).then(response=>{
                        this.pegawais=response.data.data
                    })
            },
            readDatabyId(){
                var url=this.$api+'/pegawai/'+this.getId+'/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.pegawai1=response.data.data
                    })
            },
            save(){

                var foto_pegawai = document.getElementById('foto');

                if(foto_pegawai.files[0]){
                    this.pegawai.append('foto_pegawai',foto_pegawai.files[0]);
                }

                this.pegawai.append('nama_pegawai',this.form.nama_pegawai);
                this.pegawai.append('id_role', this.form.id_role);
                this.pegawai.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('alamat_pegawai',this.form.alamat_pegawai);
                this.pegawai.append('no_telepon_pegawai',this.form.no_telepon_pegawai);
                this.pegawai.append('email', this.form.email_pegawai);

                var url = this.$api+'/pegawai/'
                this.load = true;
                this.$http.post(url, this.pegawai, {
                    headers: {
                    'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                    location.reload();
                   
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            update(){

                var temp_foto_pegawai = document.getElementById('foto');

                if(temp_foto_pegawai.files[0]){
                    this.pegawai.append('foto_pegawai',temp_foto_pegawai.files[0]);
                }

                this.pegawai.append('nama_pegawai',this.form.nama_pegawai);
                this.pegawai.append('id_role', this.form.id_role);
                this.pegawai.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('alamat_pegawai',this.form.alamat_pegawai);
                this.pegawai.append('no_telepon_pegawai',this.form.no_telepon_pegawai);
                this.pegawai.append('email', this.form.email_pegawai);
                this.pegawai.append('status_aktif',this.form.status_aktif);
              
                var url = this.$api+'/pegawai/'+this.editId+'/';
                this.load = true;
                this.$http.post(url, this.pegawai, {
                    headers: {
                    'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message  = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = false;
                    this.dialogConfirm1 = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType='Tambah';
                    location.reload();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            deleteData(){
                var url = this.$api+'/pegawai/'+this.deleteId+'/delete/';
                this.load = true;
                this.$http.get(url,{
                    headers: {
                    'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType='Tambah';
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            cancel(){
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah'
                location.reload();
            },
            cancel1(){
                this.dialogConfirm1 = false;
            },
            resetForm(){
                this.form = {
                    nama_pegawai: '',
                    id_role: '',
                    tgl_lahir_pegawai: '',
                    jenis_kelamin_pegawai: '',
                    alamat_pegawai: '',
                    no_telepon_pegawai: '',
                    email_pegawai: '',
                    password_pegawai: '',
                    foto_pegawai: '',
                },
                location.reload();                
            },
            editHandler(item){
                this.inputType = 'Ubah';
                this.editId = item.id_pegawai;
                this.form.nama_pegawai = item.nama_pegawai;
                this.form.id_role = item.id_role;
                this.form.tgl_lahir_pegawai = item.tgl_lahir_pegawai;
                this.form.jenis_kelamin_pegawai = item.jenis_kelamin_pegawai;
                this.form.alamat_pegawai = item.alamat_pegawai;
                this.form.no_telepon_pegawai = item.no_telepon_pegawai;
                this.form.email_pegawai = item.email;
                this.form.status_aktif = item.status_aktif;
                this.dialog = true;
            },
            viewHandler(id_pegawai){
                this.getId = id_pegawai;
                this.readDatabyId();
                this.detail_pegawai = true;
                
            },
            deleteHandler(id_pegawai){
                this.deleteId=id_pegawai;
                this.dialogConfirm=true;
            },
            close(){
                this.dialog= false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.detail_pegawai = false;
                this.readData();
            },
        },
        computed:{
            formTitle(){
                return this.inputType;
            },
        },
        mounted(){
            this.readData();
            this.readDatabyId();
        }
    }
</script>
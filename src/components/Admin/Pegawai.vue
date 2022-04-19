<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Pegawai AJR </h2>
        </v-container>

        <v-container>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Pegawai</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card>
            <v-data-table :headers="headers" :items="pegawais" :search="search">
                <template v-slot:[`item.id_role`]="{ item }">
                    <span v-if="item.id_role===2"><div>Customer Service</div></span>
                    <span v-else-if="item.id_role===3"><div>Admin</div></span>
                </template>
                 <template v-slot:[`item.status_aktif`]="{ item }">
                    <span v-if="item.status_aktif===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_aktif===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.foto_pegawai`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/foto_pegawai/'+item.foto_pegawai"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip><v-icon color="red" @click="deleteHandler(item.id_pegawai)">mdi-delete</v-icon></v-chip>                  
                </template>
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Pegawai </span>
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
                v-if="cekInputType()"
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

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{error_message}}
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
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                headers: [
                    {text: "Nama Pegawai", value: "nama_pegawai"},
                    {text: "Role", value: "id_role"},
                    {text: "Tanggal Lahir", value: "tgl_lahir_pegawai"},
                    {text: "Jenis Kelamin", value: "jenis_kelamin_pegawai"},
                    {text: "Alamat", value: "alamat_pegawai"},
                    {text: "No Telepon", value: "no_telepon_pegawai"},
                    {text: "Foto", value:"foto_pegawai"},
                    {text: "Email", value:"email_pegawai"},
                    {text: "Status Aktif", value: "status_aktif", align: "center"},
                    {text: "Actions", value:'actions'}
                ],
                pegawai: new FormData,
                pegawais: [],
                form: {
                    nama_pegawai: null,
                    id_role: null,
                    tgl_lahir_pegawai: null,
                    jenis_kelamin_pegawai: null,
                    alamat_pegawai: null,
                    no_telepon_pegawai: null,
                    foto_pegawai: null,
                    email_pegawai: null,
                    password_pegawai: null
                },
                editId: '',
                deleteId: '',
            };
        },
        methods:{
            setForm(){
                if(this.inputType !== 'Tambah'){
                    this.update();
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
            readData(){
                var url=this.$api+'/pegawai/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.pegawais=response.data.data
                    })
            },
            save(){
                this.pegawai.append('nama_pegawai',this.form.nama_pegawai);
                this.pegawai.append('id_role', this.form.id_role);
                this.pegawai.append('tgl_lahir_pegawai', this.form.tgl_lahir_pegawai);
                this.pegawai.append('jenis_kelamin_pegawai', this.form.jenis_kelamin_pegawai);
                this.pegawai.append('alamat_pegawai',this.form.alamat_pegawai);
                this.pegawai.append('no_telepon_pegawai',this.form.no_telepon_pegawai);
                this.pegawai.append('foto_pegawai',this.form.foto_pegawai);
                this.pegawai.append('email_pegawai', this.form.email_pegawai);

                var url = this.$api+'/pegawai/'
                this.load = true;
                this.$http.post(url, this.pegawai, {
                    headers: {
                    'Authorization':'Bearer' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
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
            deleteData(){
                var url = this.$api+'/pegawai/'+this.deleteId+'/delete';
                this.load = true;
                this.$http.put(url,{
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
            cancel(){
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah'
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
            editHandler(item){
                this.inputType = 'Ubah';
                this.editId = item.id_pegawai;
                this.form.nama_pegawai = item.nama_pegawai;
                this.form.id_role = item.id_role;
                this.form.tgl_lahir_pegawai = item.tgl_lahir_pegawai;
                this.form.jenis_kelamin_pegawai = item.jenis_kelamin_pegawai;
                this.form.alamat_pegawai = item.alamat_pegawai;
                this.form.no_telepon_pegawai = item.no_telepon_pegawai;
                this.form.foto_pegawai = item.foto_pegawai;
                this.form.email_pegawai = item.email_pegawai;
                this.form.password_pegawai = item.password_pegawai;
                this.form.status_aktif = item.status_aktif;
                this.dialog = true;
            },
            deleteHandler(id){
                this.deleteId=id;
                this.dialogConfirm=true;
            },
            close(){
                this.dialog= false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
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
        }
    }
</script>
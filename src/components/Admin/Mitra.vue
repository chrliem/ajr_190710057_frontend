<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Mitra </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Mitra</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="mitras" :search="search">
                 <template v-slot:[`item.status_aktif`]="{ item }">
                    <span v-if="item.status_aktif===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_aktif===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip v-show="item.status_aktif===1"><v-icon color="red" @click="deleteHandler(item.id_mitra)">mdi-delete</v-icon></v-chip>                 
                </template>
            </v-data-table>
        </v-card>
        </v-container>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Mitra </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.nama_mitra" label="Nama Mitra" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.no_ktp_mitra" label="No KTP Mitra" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.alamat_mitra" label="Alamat Mitra" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_aktif)===false" v-model="form.no_telepon_mitra" label="No Telepon Mitra" required></v-text-field> 
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
        <v-card-text>Anda yakin ingin menghapus mitra ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="red" text @click="deleteData">Hapus</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm1" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Anda yakin ingin mengubah data mitra ini?</v-card-text>
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
export default({
    name:"Mitra",
    data() {
        return{
            inputType: 'Tambah',
            snackbar: false,
            snackbar1: false,
            error_message: '',
            response_message: '',
            load: false,
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            dialogConfirm1: false,
            headers: [
                {text: "Nama Mitra", value: "nama_mitra"},
                {text: "Nomor KTP", value: "no_ktp_mitra"},
                {text: "Alamat", value: "alamat_mitra"},
                {text: "No Telepon", value: "no_telepon_mitra"},
                {text: "Status Aktif", value: "status_aktif"},
                {text: "Actions", value: "actions"}
            ],
            mitra: new FormData,
            mitras: [],
            form: {
                nama_mitra: '',
                no_ktp_mitra: '',
                alamat_mitra: '',
                no_telepon_mitra: ''
            },
            editId: '',
            deleteId: '',
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
        cekStatusAktif(status_aktif){
            if(status_aktif===0){
                return true;
            }else{
                return false;
            }
        },
        readData(){
            var url=this.$api+'/mitra/'
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
                    this.mitras=response.data.data
                })
        },
        save(){
            this.mitra.append('nama_mitra',this.form.nama_mitra);
            this.mitra.append('alamat_mitra',this.form.alamat_mitra);
            this.mitra.append('no_ktp_mitra',this.form.no_ktp_mitra);
            this.mitra.append('no_telepon_mitra',this.form.no_telepon_mitra);
            var url = this.$api+'/mitra/'
            this.load = true;
            this.$http.post(url, this.mitra, {
                headers: {
                'Authorization':'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.response_message = response.data.message;
                this.color = "green";
                this.snackbar1 = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error=>{
                this.error_message = error.response.data.message;
                this.color = "blue";
                this.snackbar = true;
                this.load = false;
            });
        },
        update(){
            this.mitra.append('nama_mitra',this.form.nama_mitra);
            this.mitra.append('alamat_mitra',this.form.alamat_mitra);
            this.mitra.append('no_ktp_mitra',this.form.no_ktp_mitra);
            this.mitra.append('no_telepon_mitra',this.form.no_telepon_mitra);
            this.mitra.append('status_aktif',this.form.status_aktif);
            var url = this.$api+'/mitra/'+this.editId;
                this.load = true;
                this.$http.post(url, this.mitra, {
                    headers: {
                    'Authorization':'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = false;
                    this.dialogConfirm1 = false;
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
        deleteData(){
            var url = this.$api+'/mitra/'+this.deleteId+'/delete';
            this.load = true;
            this.$http.get(url,{
                headers: {
                'Authorization':'Bearer ' + localStorage.getItem('token'),
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
        },
        cancel1(){
            this.dialogConfirm1 = false;
        },
        resetForm(){
            this.form = {
                nama_mitra: null,
                no_ktp_mitra: null,
                alamat_mitra: null,
                no_telepon_mitra: null
            }
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_mitra;
            this.form.nama_mitra = item.nama_mitra;
            this.form.no_ktp_mitra = item.no_ktp_mitra;
            this.form.no_telepon_mitra = item.no_telepon_mitra;
            this.form.alamat_mitra = item.alamat_mitra;
            this.form.status_aktif = item.status_aktif;
            this.dialog = true;
        },
        deleteHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        close(){
            this.dialog= false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.readData();
        } 
    },
    computed:{
        formTitle(){
            return this.inputType;
        },
    },
    mounted(){
        this.readData();
    }
})
</script>

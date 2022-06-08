<template>
    <v-main class="list" >
        <v-container >
            <h2 class="text-h3" font-weight-medium mb-5>Promo </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Promo</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :items-per-page="5" :headers="headers" :items="promos" :search="search">
                 <template v-slot:[`item.status_promo`]="{ item }">
                    <span v-if="item.status_promo===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_promo===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.potongan_promo`]="{ item }">
                    <span>{{item.potongan_promo*100}}%</span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                    <v-chip v-show="item.status_promo===1"><v-icon color="red" @click="deleteHandler(item.id_promo)">mdi-delete</v-icon></v-chip>                  

                </template>
            </v-data-table>
        </v-card>
        </v-container>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card >
        <v-card-title>
          <span class="headline"> {{formTitle}} Promo </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.kode_promo" label="Kode Promo" required></v-text-field>
            <v-text-field  v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
            <v-textarea  v-model="form.keterangan" label="Keterangan" required></v-textarea>
            <v-text-field  type="number" v-model="form.potongan_promo" append-icon="mdi-percent" label="Potongan Promo" required></v-text-field> 
            <v-radio-group  v-model="form.status_promo" label="Status Promo" required>
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
        <v-card-text>Anda yakin ingin menghapus promo ini?</v-card-text>
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
        <v-card-text>Anda yakin ingin mengubah data promo ini?</v-card-text>
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
    name:"Promo",
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
                {text: "Kode Promo", value: "kode_promo"},
                {text: "Jenis Promo", value: "jenis_promo"},
                {text: "Keterangan", value: "keterangan"},
                {text: "Potongan Promo", value: "potongan_promo"},
                {text: "Status Promo", value: "status_promo"},
                {text: "Actions", value: "actions"}
            ],
            promo: new FormData,
            promos: [],
            form: {
                kode_promo: '',
                jenis_promo: '',
                keterangan: '',
                potongan_promo: '',
                status_promo: ''
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
        cekStatusPromo(status_promo){
            if(status_promo===0){
                return true;
            }else{
                return false;
            }
        },
        readData(){
            var url=this.$api+'/promo/'
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
                    this.promos=response.data.data
                })
        },
        save(){
            var convertPotongan = this.form.potongan_promo/100;
            this.promo.append('kode_promo',this.form.kode_promo);
            this.promo.append('jenis_promo',this.form.jenis_promo);
            this.promo.append('keterangan',this.form.keterangan);
            this.promo.append('potongan_promo',convertPotongan);
            this.promo.append('status_promo',this.form.status_promo);
            var url = this.$api+'/promo/'
            this.load = true;
            this.$http.post(url, this.promo, {
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
            var convertPotongan = this.form.potongan_promo/100;
            this.promo.append('kode_promo',this.form.kode_promo);
            this.promo.append('jenis_promo',this.form.jenis_promo);
            this.promo.append('keterangan',this.form.keterangan);
            this.promo.append('potongan_promo',convertPotongan);
            this.promo.append('status_promo',this.form.status_promo);
            var url = this.$api+'/promo/'+this.editId+'/';
                this.load = true;
                this.$http.post(url, this.promo, {
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
            var url = this.$api+'/promo/'+this.deleteId+'/delete/';
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
                kode_promo: '',
                jenis_promo: '',
                keterangan: '',
                potongan_promo: '',
                status_promo: ''
            }
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_promo;
            this.form.kode_promo = item.kode_promo;
            this.form.jenis_promo = item.jenis_promo;
            this.form.keterangan = item.keterangan;
            this.form.potongan_promo = item.potongan_promo*100;
            this.form.status_promo = item.status_promo;
            this.dialog = true;
        },
        deleteHandler(id_promo){
            this.deleteId = id_promo;
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

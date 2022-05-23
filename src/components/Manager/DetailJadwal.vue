<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Jadwal Pegawai </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Penjadwalan </v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="detailjadwals" :search="search">
                 <template v-slot:[`item.id_jadwal`]="{ item }">
                    <span v-for="jadwal in jadwals" :key="jadwal.id_jadwal">
                        <span v-if="item.id_jadwal===jadwal.id_jadwal">
                            <strong>Hari: </strong>{{jadwal.hari}}
                            <strong>Shift: </strong>{{jadwal.shift}}
                            </span>
                    </span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip><v-icon color="red" @click="deleteHandler(item.id)">mdi-delete</v-icon></v-chip>                 
                </template>
                <template v-slot:[`item.id_pegawai`]="{ item }">
                    <span v-for="pegawai in pegawais" :key="pegawai.id_pegawai">
                        <span v-if="item.id_pegawai===pegawai.id_pegawai">{{pegawai.nama_pegawai}}</span>
                    </span>
                </template>
                
            </v-data-table>
        </v-card>
        </v-container>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Penjadwalan </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-radio-group v-model="form.id_pegawai" label="Pegawai" required>
              <v-radio v-for="pegawai in pegawais" :label="pegawai.nama_pegawai" :key="pegawai.id_pegawai" :value="pegawai.id_pegawai"></v-radio>
            </v-radio-group>
            <v-radio-group v-model="form.id_jadwal" label="Pilihan Jadwal" required>
              <v-radio v-for="jadwal in jadwals" :label="jadwal.hari+' '+jadwal.shift" :key="jadwal.id_jadwal" :value="jadwal.id_jadwal"></v-radio>
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
        <v-card-text>Anda yakin ingin menghapus penjadwalan ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="red" text @click="deleteData">Hapus</v-btn>          
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
    name:"Detail Jadwal",
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
            headers: [
                {text: "Hari", value: "hari"},
                {text: "Shift", value: "shift"},
                
                {text: "Nama Pegawai", value: "nama_pegawai"},
                
                {text: "Actions", value: "actions"}
            ],
            detailjadwal: new FormData,
            detailjadwals: [],
            pegawais: [],
            jadwals: [],
            form: {
                id_pegawai: '',
                id_jadwal: ''
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
        readData(){
            var url=this.$api+'/detailjadwal/'
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
                    this.detailjadwals=response.data.data
                })
        },
        getPegawai(){
                var url=this.$api+'/pegawai/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.pegawais=response.data.data
                    })
        },
        getJadwal(){
                var url=this.$api+'/jadwalpegawai/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.jadwals=response.data.data
                    })
        },
        save(){
            this.detailjadwal.append('id_pegawai',this.form.id_pegawai);
            this.detailjadwal.append('id_jadwal',this.form.id_jadwal);
            var url = this.$api+'/detailjadwal/'
            this.load = true;
            this.$http.post(url, this.detailjadwal, {
                headers: {
                'Authorization':'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.response_message = response.data.message;
                if(this.response_message === 'Pegawai sudah memiliki 6 shift' || this.response_message === 'Pegawai sudah mengisi shift ini'){
                    this.color = 'red';
                }else
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
            this.detailjadwal.append('id_pegawai',this.form.id_pegawai);
            this.detailjadwal.append('id_jadwal',this.form.id_jadwal);
            var url = this.$api+'/detailjadwal/'+this.editId;
                this.load = true;
                this.$http.post(url, this.detailjadwal, {
                    headers: {
                    'Authorization':'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
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
        deleteData(){
            var url = this.$api+'/detailjadwal/'+this.deleteId;
            this.load = true;
            this.$http.delete(url,{
                headers: {
                'Authorization':'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.response_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
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
        resetForm(){
            this.form = {
                id_pegawai: '',
                id_jadwal: ''
            }
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.id_pegawai = item.id_pegawai;
            this.form.id_jadwal = item.id_jadwal;
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
        this.getPegawai();
        this.getJadwal();
    }
})
</script>

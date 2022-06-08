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
                <v-btn color="success" dark @click="dialog = true"> Tambah Pilihan Jadwal</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="jadwals" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                   <v-chip><v-icon color="red" @click="deleteHandler(item.id_jadwal)">mdi-delete</v-icon></v-chip>                 
                </template>
                 <template v-slot:[`item.shift`]="{ item }">
                    <span>Shift {{item.shift}}</span>            
                </template>
            </v-data-table>
        </v-card>
        </v-container>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Pilihan Jadwal </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field prefix="Shift" type="number" min="1" v-model="form.shift" required></v-text-field>
            <v-radio-group v-model="form.hari" label="Hari" required>
              <v-radio value="Senin" label="Senin"></v-radio>
              <v-radio value="Selasa" label="Selasa"></v-radio>
              <v-radio value="Rabu" label="Rabu"></v-radio>
              <v-radio value="Kamis" label="Kamis"></v-radio>
              <v-radio value="Jumat" label="Jumat"></v-radio>
              <v-radio value="Sabtu" label="Sabtu"></v-radio>
              <v-radio value="Minggu" label="Minggu"></v-radio>
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
        <v-card-text>Anda yakin ingin menghapus pilihan jadwal ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="red" text @click="deleteData">Hapus</v-btn>          
        </v-card-actions>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" top>
            <div v-if="error_message">
                    Silakan hapus pegawai yang memiliki jadwal ini di Penjadwalan Pegawai
            </div>
        </v-snackbar>
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
    name:"Jadwal",
    data() {
        return{
            inputType: 'Tambah',
            snackbar: false,
            snackbar1: false,
            error_message: '',
            response_message:'',
            load: false,
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                {text: "Hari", value: "hari"},
                {text: "Shift", value: "shift"},
                {text: "Actions", value: "actions"}
            ],
            jadwal: new FormData,
            jadwals: [],
            form: {
                shift: '',
                jam_mulai: '',
                jam_selesai: '',
                hari: ''
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
                this.jadwal.append('shift', this.form.shift);
                this.jadwal.append('hari',this.form.hari);

            
            var url = this.$api+'/jadwalpegawai/'
            this.load = true;
            this.$http.post(url, this.jadwal, {
                headers: {
                'Authorization':'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.response_message = response.data.message;
                if(this.response_message === 'Pilihan jadwal sudah ada'){
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
        deleteData(){
            var url = this.$api+'/jadwalpegawai/'+this.deleteId+'/';
            this.load = true;
            this.$http.delete(url,{
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
                location.reload();
            }).catch(error=>{
                this.error_message = error.response.data.message;
                this.color = "blue";
                this.snackbar = true;
                this.load = false;
            });
        },
        cancel(){
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah'
        },
        deleteHandler(id_jadwal){
            this.deleteId = id_jadwal;
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

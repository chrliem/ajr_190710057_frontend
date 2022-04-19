
<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Driver AJR </h2>
        </v-container>

        <v-container>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Driver</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card>
            <v-data-table :headers="headers" :items="drivers" :search="search">
                 <template v-slot:[`item.status_aktif`]="{ item }">
                    <span v-if="item.status_aktif===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_aktif===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.status_ketersediaan_driver`]="{ item }">
                    <span v-if="item.status_ketersediaan_driver===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_ketersediaan_driver===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.kemampuan_bahasa_asing`]="{ item }">
                    <span v-if="item.status_ketersediaan_driver===0"><v-chip color="orange">Tidak Bisa</v-chip></span>
                    <span v-else-if="item.status_ketersediaan_driver===1"><v-chip color="green">Bisa</v-chip></span>
                </template>
                <template v-slot:[`item.foto_driver`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/foto_driver/'+item.foto_driver"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                 <template v-slot:[`item.sim_driver`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/sim_driver/'+item.sim_driver"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                 <template v-slot:[`item.surat_bebas_napza`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/surat_bebas_napza/'+item.surat_bebas_napza"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                 <template v-slot:[`item.surat_kesehatan_jiwa`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/surat_kesehatan_jiwa/'+item.surat_kesehatan_jiwa"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                 <template v-slot:[`item.surat_kesehatan_jasmani`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/surat_kesehatan_jasmani/'+item.surat_kesehatan_jasmani"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                <template v-slot:[`item.skck`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/skck/'+item.skck"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip><v-icon color="red" @click="deleteHandler(item.id_driver)">mdi-delete</v-icon></v-chip>            
                </template>
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Driver </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
            <v-text-field v-model="form.alamat_driver" label="Alamat Driver" required></v-text-field>
            <p>Tanggal Lahir Driver</p>
            <v-date-picker v-model="form.tgl_lahir_driver" label="Tanggal Lahir Driver" required></v-date-picker>
            <v-text-field v-model="form.no_telepon_driver" label="Nomor Telepon" required></v-text-field>
            <v-radio-group v-model="form.jenis_kelamin_driver" label="Jenis Kelamin Driver" required>
              <v-radio value="Laki-laki" label="Laki-laki"></v-radio>
              <v-radio  value="Perempuan" label="Perempuan"></v-radio>
            </v-radio-group>
            <v-text-field type="number" v-model="form.tarif_driver_harian" label="Tarif Driver Harian" required></v-text-field>
            <v-radio-group v-model="form.kemampuan_bahasa_asing" label="Kemampuan Bahasa Asing" required>
              <v-radio v-bind:value="1" label="Bisa"></v-radio>
              <v-radio v-bind:value="0" label="Tidak Bisa"></v-radio>
            </v-radio-group>            
            <v-text-field v-model="form.no_sim_driver" label="Nomor SIM" required></v-text-field>
            <v-text-field v-model="form.email_driver" label="Email Driver" required></v-text-field>
            <v-text-field 
                v-if="cekInputType()"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                v-model="form.password_driver" label="Password Driver" required></v-text-field>
            <v-file-input
                v-model="form.foto_driver"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Foto Driver"
                prepend-icon="mdi-camera"
                label="Foto Driver"
              ></v-file-input>  
              <v-file-input
                v-model="form.sim_driver"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload SIM Driver"
                prepend-icon="mdi-camera"
                label="SIM Driver"
              ></v-file-input>
              <v-file-input
                v-model="form.surat_bebas_napza"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Surat Bebas NAPZA"
                prepend-icon="mdi-camera"
                label="Surat Bebas NAPZA"
              ></v-file-input>
              <v-file-input
                v-model="form.surat_kesehatan_jiwa"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Surat Kesehatan Jiwa"
                prepend-icon="mdi-camera"
                label="Surat Kesehatan Jiwa"
              ></v-file-input>
              <v-file-input
                v-model="form.surat_kesehatan_jasmani"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Surat Kesehatan Jasmani"
                prepend-icon="mdi-camera"
                label="Surat Kesehatan Jasmani"
              ></v-file-input>
              <v-file-input
                v-model="form.skck"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload SKCK"
                prepend-icon="mdi-camera"
                label="SKCK"
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
        <v-card-text>Anda yakin ingin menghapus driver ini?</v-card-text>
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
export default {
    name:"Driver",
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
                    {text: "Foto", value:"foto_driver"},
                    {text: "ID Driver", value: "id_driver"},
                    {text: "Nama Driver", value: "nama_driver"},
                    {text: "Alamat", value: "alamat_driver"},
                    {text: "Tanggal Lahir", value: "tgl_lahir_driver"},
                    {text: "Jenis Kelamin", value: "jenis_kelamin_driver"},
                    {text: "No Telepon", value: "no_telepon_driver"},
                    {text: "Email", value:"email_driver"},
                    {text: "Tarif Harian", value: "tarif_driver_harian", align: "center"},
                    {text: "Status Aktif", value: "status_aktif", align: "center"},
                    {text: "Status Ketersediaan", value: "status_ketersediaan_driver", align: "center"},
                    {text: "Kemampuan Bahasa Asing", value: "kemampuan_bahasa_asing", align: "center"},
                    {text: "No SIM", value: "no_sim_driver", align: "center"},
                    {text: "SIM", value: "sim_driver", align: "center"},
                    {text: "Surat Bebas NAPZA", value: "surat_bebas_napza", align: "center"},
                    {text: "Surat Sehat Jiwa", value: "surat_kesehatan_jiwa", align: "center"},
                    {text: "Surat Sehat Jasmani", value: "surat_kesehatan_jasmani", align: "center"},
                    {text: "SKCK", value: "skck", align: "center"},
                    {text: "Actions", value:'actions'}
                ],
                driver: new FormData,
                drivers: [],
                form: {
                    nama_driver: null,
                    alamat_driver: null,
                    tgl_lahir_driver: null,
                    no_telepon_driver: null,
                    jenis_kelamin_driver: null,
                    tarif_driver_harian: null,
                    kemampuan_bahasa_asing: null,
                    no_sim_driver: null,
                    sim_driver: null,
                    surat_bebas_napza: null,
                    surat_kesehatan_jiwa: null,
                    surat_kesehatan_jasmani: null,
                    skck: null,
                    email_driver: null,
                    foto_driver: null,
                    password_driver: null
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
                var url=this.$api+'/driver/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.drivers=response.data.data
                    })
            },
            save(){
                this.driver.append('nama_driver',this.form.nama_driver);
                this.driver.append('alamat_driver', this.form.alamat_driver);
                this.driver.append('no_telepon_driver',this.form.no_telepon_driver)
                this.driver.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
                this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                this.driver.append('tarif_driver_harian',this.form.tarif_driver_harian);
                this.driver.append('kemampuan_bahasa_asing',this.form.kemampuan_bahasa_asing);
                this.driver.append('no_sim_driver',this.form.no_sim_driver);
                this.driver.append('sim_driver',this.form.sim_driver);
                this.driver.append('surat_bebas_napza',this.form.surat_bebas_napza);
                this.driver.append('surat_kesehatan_jiwa',this.form.surat_kesehatan_jiwa);
                this.driver.append('surat_kesehatan_jasmani',this.form.surat_kesehatan_jasmani);
                this.driver.append('skck',this.form.skck);
                this.driver.append('foto_driver',this.form.foto_driver);
                this.driver.append('email_driver', this.form.email_driver);

                var url = this.$api+'/driver/'
                this.load = true;
                this.$http.post(url, this.driver, {
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
                this.driver.append('nama_driver',this.form.nama_driver);
                this.driver.append('alamat_driver', this.form.alamat_driver);
                this.driver.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
                this.driver.append('no_telepon_driver', this.form.no_telepon_driver);
                this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                this.driver.append('tarif_driver_harian',this.form.tarif_driver_harian);
                this.driver.append('kemampuan_bahasa_asing',this.form.kemampuan_bahasa_asing);
                this.driver.append('no_sim_driver',this.form.no_sim_driver);
                this.driver.append('sim_driver',this.form.sim_driver);
                this.driver.append('surat_bebas_napza',this.form.surat_bebas_napza);
                this.driver.append('surat_kesehatan_jiwa',this.form.surat_kesehatan_jiwa);
                this.driver.append('surat_kesehatan_jasmani',this.form.surat_kesehatan_jasmani);
                this.driver.append('skck',this.form.skck);
                this.driver.append('foto_driver',this.form.foto_driver);
                this.driver.append('email_driver', this.form.email_driver);
                this.driver.append('password_driver', this.form.password_driver);
                this.driver.append('status_aktif',this.form.status_aktif);
    
            var url = this.$api+'/driver/'+this.editId;
                this.load = true;
                this.$http.post(url, this.driver, {
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
            var url = this.$api+'/driver/'+this.deleteId+'/delete';
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
                nama_driver: null,
                alamat_driver: null,
                tgl_lahir_driver: null,
                jenis_kelamin_driver: null,
                tarif_driver_harian: null,
                kemampuan_bahasa_asing: null,
                no_sim_driver: null,
                sim_driver: null,
                surat_bebas_napza: null,
                surat_kesehatan_jiwa: null,
                surat_kesehatan_jasmani: null,
                skck: null,
                email_driver: null,
                foto_driver: null,
            }
            },
            editHandler(item){
                this.inputType = 'Ubah';
                this.editId = item.id_driver;
                this.form.nama_driver = item.nama_driver;
                this.form.alamat_driver = item.alamat_driver;
                this.form.tgl_lahir_driver = item.tgl_lahir_driver;
                this.form.jenis_kelamin_driver = item.jenis_kelamin_driver;
                this.form.tarif_driver_harian = item.tarif_driver_harian;
                this.form.kemampuan_bahasa_asing = item.kemampuan_bahasa_asing;
                this.form.no_sim_driver = item.no_sim_driver;
                this.form.sim_driver = item.sim_driver;
                this.form.surat_bebas_napza = item.surat_bebas_napza;
                this.form.surat_kesehatan_jiwa = item.surat_kesehatan_jiwa;
                this.form.surat_kesehatan_jasmani = item.surat_kesehatan_jasmani;
                this.form.skck = item.skck;
                this.form.foto_driver = item.foto_driver;
                this.form.email_driver = item.email_driver;
                this.form.password_driver = item.password_driver;
                this.form.no_telepon_driver = item.no_telepon_driver;
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
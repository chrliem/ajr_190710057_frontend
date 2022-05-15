
<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Driver AJR </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Driver</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="drivers" :search="search">
                 <template v-slot:[`item.status_aktif`]="{ item }">
                    <span v-if="item.status_aktif===0"><v-chip color="orange">Tidak Aktif</v-chip></span>
                    <span v-else-if="item.status_aktif===1"><v-chip color="green" >Aktif</v-chip></span>
                </template>
                <template v-slot:[`item.status_ketersediaan_driver`]="{ item }">
                    <span v-if="item.status_ketersediaan_driver===0"><v-chip color="orange">Tidak Tersedia</v-chip></span>
                    <span v-else-if="item.status_ketersediaan_driver===1"><v-chip color="green" >tersedia</v-chip></span>
                </template>
                <template v-slot:[`item.kemampuan_bahasa_asing`]="{ item }">
                    <span v-if="item.kemampuan_bahasa_asing===0"><v-chip color="orange">Tidak Bisa</v-chip></span>
                    <span v-else-if="item.kemampuan_bahasa_asing===1"><v-chip color="green">Bisa</v-chip></span>
                </template>
                <template v-slot:[`item.rerata_rating`]="{ item }">
                    <span v-for="driverRate in driverRates" :key="driverRate.id_driver">
                        <span v-if="item.id_driver===driverRate.id_driver"><v-icon color="warning">mdi-star</v-icon> {{formatNumber(driverRate.rerata_rating)}}</span>
                    </span>
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
                    <v-chip><v-icon color="green" @click="viewHandler(item.id_driver)">mdi-eye-circle</v-icon></v-chip>
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip v-show="item.status_aktif===1"><v-icon color="red" @click="deleteHandler(item.id_driver)">mdi-delete</v-icon></v-chip>            
                </template>
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="detail_driver" persistent max-width="600px">
            <v-card max-width="600px">
              <v-card-title>
                  Detail Data Driver
                  <v-spacer></v-spacer>
                   <v-btn color="success" @click="close">Close</v-btn>
            </v-card-title>
            <v-card-text align="left">
            <v-img
                :src="$baseURL+'/storage/foto_driver/'+driver1.foto_driver"
                height="200px"
                width="200px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img height="550px" width="550px" :src="$baseURL+'/storage/foto_driver/'+driver1.foto_driver"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div class="text-left"><strong>Nama Driver </strong>   : {{driver1.nama_driver}}</div>
            <div class="text-left"><strong>Alamat        </strong>   : {{driver1.alamat_driver}}</div>
            <div class="text-left"><strong>Tanggal Lahir </strong>   : {{driver1.tgl_lahir_driver}}</div>
            <div class="text-left"><strong>Jenis Kelamin </strong>   : {{driver1.jenis_kelamin_driver}}</div>
            <div class="text-left"><strong>No Telepon    </strong>   : {{driver1.no_telepon_driver}}</div>
            <div class="text-left"><strong>Alamat email  </strong>   : {{driver1.email}}</div>
            <div class="text-left"><strong>Tarif harian </strong>   : {{driver1.tarif_driver_harian}}</div>
            <div class="text-left"><strong>Nomor SIM </strong>   : {{driver1.no_sim_driver}}</div>
            <div class="text-left"><strong>Kemampuan Bahasa Asing </strong>   : {{setKemampuanBahasa(driver1.kemampuan_bahasa_asing)}}</div>
            <strong>Status Ketersediaan: </strong>
            <v-chip
                v-bind:class="setColorStatus(driver1.status_ketersediaan_driver)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatusKetersediaan(driver1.status_ketersediaan_driver)}}</v-chip>
            <v-spacer></v-spacer>
            <strong>Status Aktif: </strong>
            <v-chip
                v-bind:class="setColorStatus(driver1.status_aktif)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatus(driver1.status_aktif)}}</v-chip>
            <p><strong>Dokumen: </strong></p>
            <p> SIM Driver </p>
            <v-img
                :src="$baseURL+'/storage/sim_driver/'+driver1.sim_driver"
                height="200px"
                width="200px"
                @click="overlay1=!overlay1"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay1">
                <v-img height="400px" width="600px" :src="$baseURL+'/storage/sim_driver/'+driver1.sim_driver"></v-img>
             <v-btn color="success" @click="overlay1 = false">Close</v-btn>
          </v-overlay>
          <p> Surat Bebas NAPZA </p>
          <v-img
                :src="$baseURL+'/storage/surat_bebas_napza/'+driver1.surat_bebas_napza"
                height="200px"
                width="200px"
                @click="overlay2=!overlay2"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay2">
                <v-img height="800px" width="600px" :src="$baseURL+'/storage/surat_bebas_napza/'+driver1.surat_bebas_napza"></v-img>
             <v-btn color="success" @click="overlay2 = false">Close</v-btn>
          </v-overlay>
          <p> Surat kesehatan Jiwa </p>
          <v-img
                :src="$baseURL+'/storage/surat_kesehatan_jiwa/'+driver1.surat_kesehatan_jiwa"
                height="200px"
                width="200px"
                @click="overlay3=!overlay3"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay3">
                <v-img height="800px" width="600px" :src="$baseURL+'/storage/surat_kesehatan_jiwa/'+driver1.surat_kesehatan_jiwa"></v-img>
             <v-btn color="success" @click="overlay3 = false">Close</v-btn>
          </v-overlay>
          <p> Surat kesehatan Jasmani </p>
          <v-img
                :src="$baseURL+'/storage/surat_kesehatan_jasmani/'+driver1.surat_kesehatan_jasmani"
                height="200px"
                width="200px"
                @click="overlay4=!overlay4"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay4">
                <v-img height="800px" width="600px"  :src="$baseURL+'/storage/surat_kesehatan_jasmani/'+driver1.surat_kesehatan_jasmani"></v-img>
             <v-btn color="success" @click="overlay4 = false">Close</v-btn>
          </v-overlay>
          <p> SKCK </p>
          <v-img
                :src="$baseURL+'/storage/skck/'+driver1.skck"
                height="200px"
                width="200px"
                @click="overlay5=!overlay5"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay5">
                <v-img height="800px" width="600px" :src="$baseURL+'/storage/skck/'+driver1.skck"></v-img>
             <v-btn color="success" @click="overlay5 = false">Close</v-btn>
          </v-overlay>
            </v-card-text>
               
            </v-card>
            </v-dialog>

        <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Driver </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
            <v-text-field v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.alamat_driver" label="Alamat Driver" required></v-text-field>
            <p v-if="cekStatusAktif(form.status_aktif)===false">Tanggal Lahir Driver</p>
            <v-date-picker v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.tgl_lahir_driver" label="Tanggal Lahir Driver" required></v-date-picker>
            <v-text-field v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.no_telepon_driver" label="Nomor Telepon" required></v-text-field>
            <v-radio-group v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.jenis_kelamin_driver" label="Jenis Kelamin Driver" required>
              <v-radio value="Laki-laki" label="Laki-laki"></v-radio>
              <v-radio  value="Perempuan" label="Perempuan"></v-radio>
            </v-radio-group>
            <v-text-field v-if="cekStatusAktif(form.status_aktif)===false" prefix="Rp " v-model="form.tarif_driver_harian" label="Tarif Driver Harian" required></v-text-field>
            <v-radio-group v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.kemampuan_bahasa_asing" label="Kemampuan Bahasa Asing" required>
              <v-radio v-bind:value="1" label="Bisa"></v-radio>
              <v-radio v-bind:value="0" label="Tidak Bisa"></v-radio>
            </v-radio-group>            
            <v-text-field v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.no_sim_driver" label="Nomor SIM" required></v-text-field>
            <v-text-field v-if="cekStatusAktif(form.status_aktif)===false" v-model="form.email_driver" label="Email Driver" required></v-text-field>
            <v-file-input
                v-show="cekStatusAktif(form.status_aktif)===false"
                id="foto_driver"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Foto Driver"
                prepend-icon="mdi-camera"
                label="Foto Driver"
              ></v-file-input>  
              <v-file-input
                v-show="cekStatusAktif(form.status_aktif)===false"
                id="sim"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload SIM Driver"
                prepend-icon="mdi-camera"
                label="SIM Driver"
              ></v-file-input>
              <v-file-input
                v-show="cekStatusAktif(form.status_aktif)===false"
                id="surat_bebas_napza"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Surat Bebas NAPZA"
                prepend-icon="mdi-camera"
                label="Surat Bebas NAPZA"
              ></v-file-input>
              <v-file-input
                v-show="cekStatusAktif(form.status_aktif)===false"
                id="surat_kesehatan_jiwa"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Surat Kesehatan Jiwa"
                prepend-icon="mdi-camera"
                label="Surat Kesehatan Jiwa"
              ></v-file-input>
              <v-file-input
                v-show="cekStatusAktif(form.status_aktif)===false"
                id="surat_kesehatan_jasmani"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Surat Kesehatan Jasmani"
                prepend-icon="mdi-camera"
                label="Surat Kesehatan Jasmani"
              ></v-file-input>
              <v-file-input
                v-show="cekStatusAktif(form.status_aktif)===false"
                id="skck"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload SKCK"
                prepend-icon="mdi-camera"
                label="SKCK"
              ></v-file-input>      
            <v-radio-group v-if="cekStatusAktif(form.status_aktif)" v-model="form.status_aktif" label="Status Aktif" required>
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
        <v-card-text>Anda yakin ingin menghapus driver ini?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">Hapus</v-btn>          
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
export default {
    name:"Driver",

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
                detail_driver: false,
                response_message: '',
                overlay: false,
                overlay1: false,
                overlay2: false,
                overlay3: false,
                overlay4: false,
                overlay5: false,
                headers: [
                    {text: "Foto", value:"foto_driver"},
                    {text: "ID Driver", value: "id_driver"},
                    {text: "Nama Driver", value: "nama_driver"},
                    // {text: "Alamat", value: "alamat_driver"},
                    // {text: "Tanggal Lahir", value: "tgl_lahir_driver"},
                    // {text: "Jenis Kelamin", value: "jenis_kelamin_driver"},
                    // {text: "No Telepon", value: "no_telepon_driver"},
                    // {text: "Email", value:"email_driver"},
                    // {text: "Tarif Harian", value: "tarif_driver_harian", align: "center"},
                    {text: "Rerata Rating", value:"rerata_rating",  align:"center"},
                    {text: "Status Aktif", value: "status_aktif", align: "center"},
                    {text: "Status Ketersediaan", value: "status_ketersediaan_driver", align: "center"},
                    {text: "Kemampuan Bahasa Asing", value: "kemampuan_bahasa_asing", align: "center"},
                    // {text: "No SIM", value: "no_sim_driver", align: "center"},
                    // {text: "SIM", value: "sim_driver", align: "center"},
                    // {text: "Surat Bebas NAPZA", value: "surat_bebas_napza", align: "center"},
                    // {text: "Surat Sehat Jiwa", value: "surat_kesehatan_jiwa", align: "center"},
                    // {text: "Surat Sehat Jasmani", value: "surat_kesehatan_jasmani", align: "center"},
                    // {text: "SKCK", value: "skck", align: "center"},
                    {text: "Actions", value:'actions'}
                ],
                driver: new FormData,
                driver1: [],
                drivers: [],
                driverRates: [],
                form: {
                    nama_driver: '',
                    alamat_driver: '',
                    tgl_lahir_driver: '',
                    no_telepon_driver: '',
                    jenis_kelamin_driver: '',
                    tarif_driver_harian: '',
                    kemampuan_bahasa_asing: '',
                    no_sim_driver: '',
                    sim_driver: null,
                    surat_bebas_napza: null,
                    surat_kesehatan_jiwa: null,
                    surat_kesehatan_jasmani: null,
                    skck: null,
                    email_driver: '',
                    foto_driver: null,
                    status_ketersediaan_driver: ''
                },
                editId: '',
                deleteId: '',
                getId: '',
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
            formatNumber(rerata_rating){
                return Number(rerata_rating).toFixed(2)
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
            setStatus(status_aktif){
                if(status_aktif===1){
                    return 'Aktif'
                }else{
                    return 'Tidak Aktif'
                }
            },
            setStatusKetersediaan(status_ketersediaan_driver){
                if(status_ketersediaan_driver===1){
                    return 'Tersedia'
                }else{
                    return 'Tidak Tersedia'
                }
            },
            setKemampuanBahasa(kemampuan_bahasa_asing){
                if(kemampuan_bahasa_asing===1){
                    return 'Bisa'
                }else{
                    return 'Tidak Bisa'
                }
            },
            setColorStatus(status_aktif){
                if(status_aktif===1){
                    return 'success'
                }else{
                    return 'warning'
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
            readDatabyId(){
                var url=this.$api+'/driver/'+this.getId
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.driver1=response.data.data
                    })
            },
            getRerataDriver(){
                var url=this.$api+'/average-ratingdriver'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.driverRates=response.data.data
                    })
            },
            save(){

                var foto_driver = document.getElementById('foto_driver');

                if(foto_driver.files[0]){
                    this.driver.append('foto_driver',foto_driver.files[0]);
                }

                var sim_driver = document.getElementById('sim');

                if(sim_driver.files[0]){
                    this.driver.append('sim_driver',sim_driver.files[0]);
                }

                var surat_bebas_napza = document.getElementById('surat_bebas_napza');

                if(surat_bebas_napza.files[0]){
                    this.driver.append('surat_bebas_napza',surat_bebas_napza.files[0]);
                }

                var surat_kesehatan_jiwa = document.getElementById('surat_kesehatan_jiwa');

                if(surat_kesehatan_jiwa.files[0]){
                    this.driver.append('surat_kesehatan_jiwa',surat_kesehatan_jiwa.files[0]);
                }

                var surat_kesehatan_jasmani = document.getElementById('surat_kesehatan_jasmani');

                if(surat_kesehatan_jasmani.files[0]){
                    this.driver.append('surat_kesehatan_jasmani',surat_kesehatan_jasmani.files[0]);
                }

                var skck = document.getElementById('skck');

                if(skck.files[0]){
                    this.driver.append('skck',skck.files[0]);
                }

                this.driver.append('nama_driver',this.form.nama_driver);
                this.driver.append('alamat_driver', this.form.alamat_driver);
                this.driver.append('no_telepon_driver',this.form.no_telepon_driver)
                this.driver.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
                this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                this.driver.append('tarif_driver_harian',this.form.tarif_driver_harian);
                this.driver.append('kemampuan_bahasa_asing',this.form.kemampuan_bahasa_asing);
                this.driver.append('no_sim_driver',this.form.no_sim_driver);
                // this.driver.append('sim_driver',this.form.sim_driver);
                // this.driver.append('surat_bebas_napza',this.form.surat_bebas_napza);
                // this.driver.append('surat_kesehatan_jiwa',this.form.surat_kesehatan_jiwa);
                // this.driver.append('surat_kesehatan_jasmani',this.form.surat_kesehatan_jasmani);
                // this.driver.append('skck',this.form.skck);
                // this.driver.append('foto_driver',this.form.foto_driver);
                this.driver.append('email', this.form.email_driver);

                var url = this.$api+'/driver/'
                this.load = true;
                this.$http.post(url, this.driver, {
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
                    location.reload();
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            update(){

                var temp_foto_driver = document.getElementById('foto_driver');

                if(temp_foto_driver.files[0]){
                    this.driver.append('foto_driver',temp_foto_driver.files[0]);
                }

                var temp_sim_driver = document.getElementById('sim');

                if(temp_sim_driver.files[0]){
                    this.driver.append('sim_driver',temp_sim_driver.files[0]);
                }

                var temp_surat_bebas_napza = document.getElementById('surat_bebas_napza');

                if(temp_surat_bebas_napza.files[0]){
                    this.driver.append('surat_bebas_napza',temp_surat_bebas_napza.files[0]);
                }

                var temp_surat_kesehatan_jiwa = document.getElementById('surat_kesehatan_jiwa');

                if(temp_surat_kesehatan_jiwa.files[0]){
                    this.driver.append('surat_kesehatan_jiwa',temp_surat_kesehatan_jiwa.files[0]);
                }

                var temp_surat_kesehatan_jasmani = document.getElementById('surat_kesehatan_jasmani');

                if(temp_surat_kesehatan_jasmani.files[0]){
                    this.driver.append('surat_kesehatan_jasmani',temp_surat_kesehatan_jasmani.files[0]);
                }

                var temp_skck = document.getElementById('skck');

                if(temp_skck.files[0]){
                    this.driver.append('skck',temp_skck.files[0]);
                }
                this.driver.append('nama_driver',this.form.nama_driver);
                this.driver.append('alamat_driver', this.form.alamat_driver);
                this.driver.append('tgl_lahir_driver', this.form.tgl_lahir_driver);
                this.driver.append('no_telepon_driver', this.form.no_telepon_driver);
                this.driver.append('jenis_kelamin_driver', this.form.jenis_kelamin_driver);
                this.driver.append('tarif_driver_harian',this.form.tarif_driver_harian);
                this.driver.append('kemampuan_bahasa_asing',this.form.kemampuan_bahasa_asing);
                this.driver.append('no_sim_driver',this.form.no_sim_driver);
                // this.driver.append('sim_driver',this.form.sim_driver);
                // this.driver.append('surat_bebas_napza',this.form.surat_bebas_napza);
                // this.driver.append('surat_kesehatan_jiwa',this.form.surat_kesehatan_jiwa);
                // this.driver.append('surat_kesehatan_jasmani',this.form.surat_kesehatan_jasmani);
                // this.driver.append('skck',this.form.skck);
                // this.driver.append('foto_driver',this.form.foto_driver);
                this.driver.append('email', this.form.email_driver);
                this.driver.append('password_driver', this.form.password_driver);
                this.driver.append('status_aktif',this.form.status_aktif);
    
            var url = this.$api+'/driver/'+this.editId;
                this.load = true;
                this.$http.post(url, this.driver, {
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
            deleteData(){
            var url = this.$api+'/driver/'+this.deleteId+'/delete';
            this.load = true;
            this.$http.get(url,{
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
                nama_driver: '',
                    alamat_driver: '',
                    tgl_lahir_driver: '',
                    no_telepon_driver: '',
                    jenis_kelamin_driver: '',
                    tarif_driver_harian: null,
                    kemampuan_bahasa_asing: '',
                    no_sim_driver: null,
                    // sim_driver: null,
                    // surat_bebas_napza: null,
                    // surat_kesehatan_jiwa: null,
                    // surat_kesehatan_jasmani: null,
                    // skck: null,
                    email_driver: '',
                    status_ketersediaan_driver: ''

                    // foto_driver: null,
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
                this.form.email_driver = item.email;
                this.form.no_telepon_driver = item.no_telepon_driver;
                this.form.status_aktif = item.status_aktif;
                this.form.status_ketersediaan_driver = item.status_ketersediaan_driver;
                this.dialog = true;
            },
            viewHandler(id_driver){
                this.getId = id_driver;
                this.readDatabyId();
                this.detail_driver = true;
            },
            deleteHandler(id){
                this.deleteId=id;
                this.dialogConfirm=true;
            },
            close(){
                this.dialog= false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.detail_driver = false;
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
            this.getRerataDriver();
        
        }
}
</script>
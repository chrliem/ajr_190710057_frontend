<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Mobil </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Mobil</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers" :items="mobils" :search="search">
                 <template v-slot:[`item.status_ketersediaan_mobil`]="{ item }">
                    <span v-if="item.status_ketersediaan_mobil===0"><v-chip color="orange">Tidak Tersedia</v-chip></span>
                    <span v-else-if="item.status_ketersediaan_mobil===1"><v-chip color="green" >Tersedia</v-chip></span>
                </template>
                <template v-slot:[`item.foto_mobil`]="{ item }">
                     <v-img
                        :src="$baseURL+'/storage/foto_mobil/'+item.foto_mobil"
                        height="50px"
                        width="50px"
                    ></v-img>
                </template>
                <template v-slot:[`item.no_plat`]="{ item }">
                   <v-chip label color="black" text-color="white"><strong>{{item.no_plat}}</strong></v-chip>
                </template>
                <template v-slot:[`item.id_mitra`]="{ item }">
                    <span v-for="mitra in mitras" :key="mitra.id_mitra">
                        <span v-if="item.id_mitra===mitra.id_mitra">{{mitra.nama_mitra}}</span>
                    </span>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip><v-icon color="green" @click="viewHandler(item.id_mobil)">mdi-eye-circle</v-icon></v-chip>
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip v-show="item.status_ketersediaan_mobil===1"><v-icon color="red" @click="deleteHandler(item.id_mobil)">mdi-delete</v-icon></v-chip>            
                </template>
            </v-data-table>
        </v-card>
        </v-container>
         
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Mobil Akan Habis Kontrak </h2>
        </v-container>

        <v-container>
        <v-card class="elevation-6">
            <v-card-title>
                <v-text-field v-model="search1" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card>
        </v-container>
         <v-container>
        <v-card class="elevation-6">
            <v-data-table :headers="headers1" :items="expiringMobils" :search="search1">
                <template v-slot:[`item.sisa_durasi_kontrak`]="{ item }">
                    <span v-if="item.sisa_durasi_kontrak<0">
                        <v-chip label color="red" text-color="white"><strong>EXPIRED</strong></v-chip>
                    </span>
                    <span v-else>{{item.sisa_durasi_kontrak}} hari</span>
                </template>
                 <template v-slot:[`item.no_plat`]="{ item }">
                   <v-chip label color="black" text-color="white"><strong>{{item.no_plat}}</strong></v-chip>
                </template>       
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="detail_mobil" persistent max-width="600px">
            <v-card max-width="600px">
              <v-card-title>
                  Detail Data Mobil
                  <v-spacer></v-spacer>
                   <v-btn color="success" @click="close">Close</v-btn>
            </v-card-title>
            <v-card-text align="left">
            <v-img
                :src="$baseURL+'/storage/foto_mobil/'+mobil1.foto_mobil"
                height="300px"
                width="500px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img :src="$baseURL+'/storage/foto_mobil/'+mobil1.foto_mobil"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            <div class="text-left"><strong>Plat Nomor </strong>   : {{mobil1.no_plat}}</div>
            <div class="text-left"><strong>Nama Mobil    </strong>   : {{mobil1.nama_mobil}}</div>
            <div class="text-left"><strong>Kategori Aset </strong>   : {{mobil1.kategori_aset}}</div>
            <div v-for="mitra in mitras" :key="mitra.id_mitra">
                <div v-if="mobil1.id_mitra===mitra.id_mitra"><strong>Nama Mitra: </strong>{{mitra.nama_mitra}}</div>
            </div>
            <div class="text-left"><strong>Tipe Mobil </strong>   : {{mobil1.tipe_mobil}}</div>
            <div class="text-left"><strong>Warna Mobil </strong>   : {{mobil1.warna_mobil}}</div>
            <div class="text-left"><strong>Jenis Transmisi </strong>   : {{mobil1.jenis_transmisi}}</div>
            <div class="text-left"><strong>Jenis Bahan Bakar </strong>   : {{mobil1.jenis_bahan_bakar}}</div>
            <div class="text-left"><strong>Volume Bahan Bakar </strong>   : {{mobil1.volume_bahan_bakar}} Liter</div>
            <div class="text-left"><strong>Kapasitas Penumpang </strong>   : {{mobil1.kapasitas_penumpang}} orang</div>
            <div class="text-left"><strong>Fasilitas Mobil </strong>   : {{mobil1.fasilitas_mobil}}</div>
            <div class="text-left"><strong>No STNK </strong>   : {{mobil1.no_stnk}}</div>
            <div class="text-left"><strong>Tarif Harian </strong>   : Rp {{mobil1.tarif_mobil_harian}}</div>
            <div class="text-left"><strong>Tanggal Servis Terakhir </strong>   : {{mobil1.tgl_servis_terakhir}}</div>
            <div class="text-left"><strong>Tanggal Mulai Kontrak </strong>   : {{mobil1.tgl_mulai_kontrak}}</div>
            <div class="text-left"><strong>Tanggal Habis Kontrak </strong>   : {{mobil1.tgl_habis_kontrak}}</div>
            <div class="text-left"><strong>Status Ketersediaan </strong> </div>
            <v-chip
                v-bind:class="setColorStatus(mobil1.status_ketersediaan_mobil)"
                class="rounded pa-1 text-center text-wrap"
            >{{setStatus(mobil1.status_ketersediaan_mobil)}}</v-chip>
                </v-card-text>
            </v-card>
        </v-dialog>

       

        <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Mobil </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-radio-group v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.kategori_aset">
                <v-radio value="Perusahaan" label="Perusahaan"></v-radio>
                <v-radio value="Mitra" label="Mitra"></v-radio>
            </v-radio-group>
            <v-radio-group  v-show="form.kategori_aset === 'Mitra' && cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.id_mitra" label="Mitra" required>
              <v-radio v-for="mitra in mitras" v-show="mitra.status_aktif===1" :label="mitra.nama_mitra" :key="mitra.id_mitra" :value="mitra.id_mitra">
              </v-radio>
            </v-radio-group>
            <div v-if="cekInputType===true">{{form.id_mitra}}</div>
            <v-file-input
                v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false"
                id="foto_mobil"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Foto Mobil"
                prepend-icon="mdi-camera"
                label="Foto Mobil"
              ></v-file-input> 
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.no_plat" label="Plat Nomor Mobil" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.no_stnk" label="No STNK" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.fasilitas_mobil" label="Fasilitias Mobil" required></v-text-field>
            <v-select
                v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false"
                v-model="form.tipe_mobil"
                :items="tipemobil"
                label="Tipe Mobil"
                dense
            ></v-select>
            <v-select
            v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false"
                v-model="form.jenis_transmisi"
                :items="jenistransmisi"
                label="Jenis Transmisi"
                dense
            ></v-select>
            <v-select
            v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false"
                v-model="form.jenis_bahan_bakar"
                :items="jenisbahanbakar"
                label="Jenis Bahan Bakar"
                dense
            ></v-select> 
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" suffix="Liter" type="number" min="1" v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" suffix="Orang" type="number" min="1" v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang" required></v-text-field>
            <v-text-field v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false" prefix="Rp " v-model="form.tarif_mobil_harian" label="Tarif Mobil Harian" required></v-text-field>                
            <p v-show="cekStatusAktif(form.status_ketersediaan_mobil)===false">Tanggal Servis Terakhir</p>
            <v-date-picker v-show=" cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.tgl_servis_terakhir" label="Tanggal Servis Terakhir" required></v-date-picker>
            <p v-show="form.kategori_aset === 'Mitra' && cekStatusAktif(form.status_ketersediaan_mobil)===false">Tanggal Mulai Kontrak</p>
            <v-date-picker v-show="form.kategori_aset === 'Mitra' && cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.tgl_mulai_kontrak" label="Tanggal Mulai Kontrak" required></v-date-picker>
            <p v-show="form.kategori_aset === 'Mitra' && cekStatusAktif(form.status_ketersediaan_mobil)===false">Tanggal Habis Kontrak</p>
            <v-date-picker v-show="form.kategori_aset === 'Mitra' && cekStatusAktif(form.status_ketersediaan_mobil)===false" v-model="form.tgl_habis_kontrak" label="Tanggal Habis Kontrak" required></v-date-picker>
            <v-radio-group v-if="cekStatusKetersediaan(form.status_ketersediaan_mobil)"  v-model="form.status_ketersediaan_mobil" label="Status Ketersediaan" required>
                <v-radio v-bind:value="1" label="Tersedia"></v-radio>
                <v-radio v-bind:value="0" label="Tidak Tersedia"></v-radio>
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
        <v-card-text>Anda yakin ingin menghapus mobil ini?</v-card-text>
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
    name: "Mobil",
    data(){
        return{
            tipemobil: ['SUV','MPV','LCGC','Crossover','Hatchback','Sedan','Sport','Convertible','Off Road','Pick-up Double Cabin','Listrik','Hibrid'],
            jenistransmisi: ['CVT','DCT','AMT','Manual'],
            jenisbahanbakar: ['Premium','Solar','Pertamax','Pertalite','Pertamina Dex','Dexlite','BBG'],
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            snackbar1: false,
            error_message: '',
            response_message: '',
            color: '',
            search: null,
            search1: null,
            dialog: false,
            dialogConfirm: false,
            detail_mobil: false,
            overlay: false,
            headers: [
                {text: "Foto Mobil", value:"foto_mobil"},
                {text: "Plat Nomor", value:"no_plat"},
                {text: "Nama Mobil", value:"nama_mobil"},
                {text: "Kategori Aset", value: "kategori_aset"},
                {text: "Mitra", value: "id_mitra"},
                {text: "Status Ketersediaan", value:"status_ketersediaan_mobil"},
                {text: "Actions", value:"actions"}
            ],
            headers1:[
                {text: "Plat Nomor", value:"no_plat"},
                {text: "Nama Mobil", value:"nama_mobil"},
                {text: "Nama Mitra", value:"nama_mitra"},
                {text: "Sisa Durasi Kontrak", value:"sisa_durasi_kontrak",align:"center"},
            ],
            mobil: new FormData,
            mobils: [],
            mobil1: [],
            expiringMobils: [],
            mitras: [],
            form: {
                id_mitra: '',
                no_plat: '',
                nama_mobil: '',
                foto_mobil: null,
                tipe_mobil: '',
                jenis_transmisi: '',
                jenis_bahan_bakar: '',
                volume_bahan_bakar: '',
                warna_mobil: '',
                kapasitas_penumpang: '',
                fasilitas_mobil: '',
                no_stnk: '',
                tgl_servis_terakhir: '',
                kategori_aset: '',
                tarif_mobil_harian: '',
                tgl_mulai_kontrak: '',
                tgl_habis_kontrak: '',
            },
            editId: '',
            deleteId: '',
            getId: ''
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
        setColorStatus(status_ketersediaan_mobil){
                if(status_ketersediaan_mobil===1){
                    return 'success'
                }else{
                    return 'warning'
                }
            },
        setStatus(status_ketersediaan_mobil){
                if(status_ketersediaan_mobil===1){
                    return 'Tersedia'
                }else{
                    return 'Tidak Tersedia'
                }
            },
            cekStatusAktif(status_ketersediaan_mobil){
                if(status_ketersediaan_mobil===0){
                    return true;
                }else{
                    return false;
                }
            },
        readData(){
                var url=this.$api+'/mobil/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.mobils=response.data.data
                    })
        },
        readDatabyId(){
                var url=this.$api+'/mobil/'+this.getId+'/id'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.mobil1=response.data.data
                    })
            },
        getMobilHabisKontrak(){
               var url=this.$api+'/mobil/habiskontrak'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.expiringMobils=response.data.data
                    })
        },
        cekStatusKetersediaan(status_ketersediaan){
                if(status_ketersediaan===0){
                    return true;
                }else{
                    return false;
                }
        },
        getMitra(){
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

            var foto_mobil = document.getElementById('foto_mobil');

            if(foto_mobil.files[0]){
                this.mobil.append('foto_mobil',foto_mobil.files[0]);
            }

            this.mobil.append('id_mitra',this.form.id_mitra);
            this.mobil.append('no_plat',this.form.no_plat);
            this.mobil.append('nama_mobil', this.form.nama_mobil);
            this.mobil.append('tipe_mobil', this.form.tipe_mobil);
            this.mobil.append('jenis_transmisi', this.form.jenis_transmisi);
            this.mobil.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
            this.mobil.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
            this.mobil.append('warna_mobil', this.form.warna_mobil);
            this.mobil.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
            this.mobil.append('fasilitas_mobil',this.form.fasilitas_mobil);
            this.mobil.append('no_stnk', this.form.no_stnk);
            this.mobil.append('tgl_servis_terakhir', this.form.tgl_servis_terakhir);
            this.mobil.append('tarif_mobil_harian', this.form.tarif_mobil_harian);
            this.mobil.append('tgl_mulai_kontrak', this.form.tgl_mulai_kontrak);
            this.mobil.append('tgl_habis_kontrak', this.form.tgl_habis_kontrak);

            var url = this.$api+'/mobil/'
                this.load = true;
                this.$http.post(url, this.mobil, {
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
                if(this.form.kategori_aset==='Perusahaan'){
                var foto_mobil = document.getElementById('foto_mobil');

                if(foto_mobil.files[0]){
                    this.mobil.append('foto_mobil',foto_mobil.files[0]);
                }
                this.mobil.append('id_mitra','');
                this.mobil.append('no_plat',this.form.no_plat);
                this.mobil.append('nama_mobil', this.form.nama_mobil);
                this.mobil.append('tipe_mobil', this.form.tipe_mobil);
                this.mobil.append('jenis_transmisi', this.form.jenis_transmisi);
                this.mobil.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                this.mobil.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                this.mobil.append('warna_mobil', this.form.warna_mobil);
                this.mobil.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                this.mobil.append('fasilitas_mobil',this.form.fasilitas_mobil);
                this.mobil.append('no_stnk', this.form.no_stnk);
                this.mobil.append('tgl_servis_terakhir', this.form.tgl_servis_terakhir);
                this.mobil.append('tarif_mobil_harian', this.form.tarif_mobil_harian);
                this.mobil.append('tgl_mulai_kontrak',  '');
                this.mobil.append('tgl_habis_kontrak', '');
                this.mobil.append('status_ketersediaan_mobil', this.form.status_ketersediaan_mobil);
            }else{
                var foto_mobil = document.getElementById('foto_mobil');

                if(foto_mobil.files[0]){
                    this.mobil.append('foto_mobil',foto_mobil.files[0]);
                }
                this.mobil.append('id_mitra',this.form.id_mitra);
                this.mobil.append('no_plat',this.form.no_plat);
                this.mobil.append('nama_mobil', this.form.nama_mobil);
                this.mobil.append('tipe_mobil', this.form.tipe_mobil);
                this.mobil.append('jenis_transmisi', this.form.jenis_transmisi);
                this.mobil.append('jenis_bahan_bakar', this.form.jenis_bahan_bakar);
                this.mobil.append('volume_bahan_bakar', this.form.volume_bahan_bakar);
                this.mobil.append('warna_mobil', this.form.warna_mobil);
                this.mobil.append('kapasitas_penumpang', this.form.kapasitas_penumpang);
                this.mobil.append('fasilitas_mobil',this.form.fasilitas_mobil);
                this.mobil.append('no_stnk', this.form.no_stnk);
                this.mobil.append('tgl_servis_terakhir', this.form.tgl_servis_terakhir);
                this.mobil.append('tarif_mobil_harian', this.form.tarif_mobil_harian);
                this.mobil.append('tgl_mulai_kontrak', this.form.tgl_mulai_kontrak);
                this.mobil.append('tgl_habis_kontrak', this.form.tgl_habis_kontrak);
                this.mobil.append('status_ketersediaan_mobil', this.form.status_ketersediaan_mobil);
            }
            
            var url = this.$api+'/mobil/'+this.editId;
                this.load = true;
                this.$http.post(url, this.mobil, {
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
            var url = this.$api+'/mobil/'+this.deleteId+'/delete';
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
        resetForm(){
            this.form ={
                id_mitra: '',
                no_plat: '',
                nama_mobil: '',
                foto_mobil: null,
                tipe_mobil: '',
                jenis_transmisi: '',
                jenis_bahan_bakar: '',
                volume_bahan_bakar: '',
                warna_mobil: '',
                kapasitas_penumpang: '',
                fasilitas_mobil: '',
                no_stnk: '',
                tgl_servis_terakhir: '',
                kategori_aset: '',
                tarif_mobil_harian: '',
                tgl_mulai_kontrak: '',
                tgl_habis_kontrak: '',
            }
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_mobil;
            this.form.id_mitra = item.id_mitra;
            this.form.no_plat = item.no_plat;
            this.form.nama_mobil = item.nama_mobil;
            this.form.tipe_mobil = item.tipe_mobil;
            this.form.jenis_transmisi = item.jenis_transmisi;
            this.form.jenis_bahan_bakar = item.jenis_bahan_bakar;
            this.form.volume_bahan_bakar = item.volume_bahan_bakar;
            this.form.warna_mobil = item.warna_mobil;
            this.form.kapasitas_penumpang = item.kapasitas_penumpang;
            this.form.fasilitas_mobil = item.fasilitas_mobil;
            this.form.no_stnk = item.no_stnk;
            this.form.tgl_servis_terakhir = item.tgl_servis_terakhir;
            this.form.kategori_aset = item.kategori_aset;
            this.form.status_ketersediaan_mobil = item.status_ketersediaan_mobil;
            this.form.tarif_mobil_harian = item.tarif_mobil_harian;
            this.form.tgl_mulai_kontrak = item.tgl_mulai_kontrak;
            this.form.tgl_habis_kontrak = item.tgl_habis_kontrak;
            this.dialog = true;
        },
        viewHandler(id_mobil){
                this.getId = id_mobil;
                this.readDatabyId();
                this.detail_mobil = true;
                
            },
        deleteHandler(id){
                this.deleteId=id;
                this.dialogConfirm=true;
        },
        close(){
            this.dialog= false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.detail_mobil = false;
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
            this.getMitra();
            this.getMobilHabisKontrak();
            this.readDatabyId();
        }
}
</script>
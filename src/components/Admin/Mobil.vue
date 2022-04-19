<template>
    <v-main class="list">
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Mobil </h2>
        </v-container>

        <v-container>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah Mobil</v-btn>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card>
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
                    <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                   <v-chip><v-icon color="red" @click="deleteHandler(item.id_mobil)">mdi-delete</v-icon></v-chip>            
                </template>
            </v-data-table>
        </v-card>
        </v-container>
         
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Mobil Akan Habis Kontrak </h2>
        </v-container>

        <v-container>
        <v-card>
            <v-card-title>
                <v-text-field v-model="search1" append-icon="mdi-magnify" label="Search" single-line hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card>
        </v-container>

        <v-container>
        <v-card>
            <v-data-table :headers="headers1" :items="expiringMobils" :search="search1">
                <template v-slot:[`item.sisa_durasi_kontrak`]="{ item }">
                    <span>{{item.sisa_durasi_kontrak}} hari</span>
                </template>
                 <template v-slot:[`item.no_plat`]="{ item }">
                   <v-chip label color="black" text-color="white"><strong>{{item.no_plat}}</strong></v-chip>
                </template>
            </v-data-table>
        </v-card>
        </v-container>

        <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> {{formTitle}} Mobil </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-radio-group v-model="form.kategori_aset">
                <v-radio value="Perusahaan" label="Perusahaan"></v-radio>
                <v-radio value="Mitra" label="Mitra"></v-radio>
            </v-radio-group>
            <v-radio-group v-show="form.kategori_aset === 'Mitra'" v-model="form.id_mitra" label="Mitra" required>
              <v-radio v-for="mitra in mitras" :label="mitra.nama_mitra" :key="mitra.id_mitra" :value="mitra.id_mitra"></v-radio>
            </v-radio-group>
            <v-file-input
                v-model="form.foto_mobil"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Foto Mobil"
                prepend-icon="mdi-camera"
                label="Foto Mobil"
              ></v-file-input> 
            <v-text-field v-model="form.no_plat" label="Plat Nomor Mobil" required></v-text-field>
            <v-text-field v-model="form.no_stnk" label="No STNK" required></v-text-field>
            <v-text-field v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
            <v-text-field v-model="form.warna_mobil" label="Warna Mobil" required></v-text-field>
            <v-text-field v-model="form.fasilitas_mobil" label="Fasilitias Mobil" required></v-text-field>
            <v-select
                v-model="form.tipe_mobil"
                :items="tipemobil"
                label="Tipe Mobil"
                dense
            ></v-select>
            <v-select
                v-model="form.jenis_transmisi"
                :items="jenistransmisi"
                label="Jenis Transmisi"
                dense
            ></v-select>
            <v-select
                v-model="form.jenis_bahan_bakar"
                :items="jenisbahanbakar"
                label="Jenis Bahan Bakar"
                dense
            ></v-select> 
            <v-text-field type="number" v-model="form.volume_bahan_bakar" label="Volume Bahan Bakar" required></v-text-field>
            <v-text-field type="number" v-model="form.kapasitas_penumpang" label="Kapasitas Penumpang" required></v-text-field>
            <v-text-field type="number" v-model="form.tarif_mobil_harian" label="Tarif Mobil Harian" required></v-text-field>                
            <p>Tanggal Servis Terakhir</p>
            <v-date-picker v-model="form.tgl_servis_terakhir" label="Tanggal Servis Terakhir" required></v-date-picker>
            <p>Tanggal Mulai Kontrak</p>
            <v-date-picker v-model="form.tgl_mulai_kontrak" label="Tanggal Mulai Kontrak" required></v-date-picker>
            <p>Tanggal Habis Kontrak</p>
            <v-date-picker v-model="form.tgl_habis_kontrak" label="Tanggal Habis Kontrak" required></v-date-picker>
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

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{error_message}}
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
            error_message: '',
            color: '',
            search: null,
            search1: null,
            dialog: false,
            dialogConfirm: false,
            headers: [
                {text: "Foto Mobil", value:"foto_mobil"},
                {text: "Plat Nomor", value:"no_plat"},
                {text: "Nama Mobil", value:"nama_mobil"},
                {text: "Kategori Aset", value: "kategori_aset"},
                {text: "Mitra", value: "id_mitra"},
                {text: "No STNK", value: "no_stnk"},
                {text: "Warna", value: "warna_mobil"},
                {text: "Tipe", value: "tipe_mobil"},
                {text: "Transmisi", value: "jenis_transmisi"},
                {text: "Bahan Bakar", value: "jenis_bahan_bakar"},
                {text: "Volume Bahan Bakar", value:"volume_bahan_bakar"},
                {text: "Fasilitas", value: "fasilitas_mobil"},
                {text: "Kapasitas Penumpang", value:"kapasitas_penumpang"},
                {text: "Tarif Harian", value: "tarif_mobil_harian"},
                {text: "Tanggal Servis Terakhir", value: "tgl_servis_terakhir"},
                {text: "Mulai Kontrak", value:"tgl_mulai_kontrak"},
                {text: "Habis Kontrak", value:"tgl_habis_kontrak"},
                {text: "Status Ketersediaan", value:"status_ketersediaan_mobil"},
                {text: "Actions", value:"actions"}
            ],
            headers1:[
                {text: "Plat Nomor", value:"no_plat"},
                {text: "Nama Mobil", value:"nama_mobil"},
                {text: "Nama Mitra", value:"nama_mitra"},
                {text: "Sisa Durasi Kontrak", value:"sisa_durasi_kontrak"},
            ],
            mobil: new FormData,
            mobils: [],
            expiringMobils: [],
            mitra: [],
            form: {
                id_mitra: null,
                no_plat: null,
                nama_mobil: null,
                foto_mobil: null,
                tipe_mobil: null,
                jenis_transmisi: null,
                jenis_bahan_bakar: null,
                volume_bahan_bakar: null,
                warna_mobil: null,
                kapasitas_penumpang: null,
                fasilitas_mobil: null,
                no_stnk: null,
                tgl_servis_terakhir: null,
                kategori_aset: null,
                tarif_mobil_harian: null,
                tgl_mulai_kontrak: null,
                tgl_habis_kontrak: null,
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
                var url=this.$api+'/mobil/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.mobils=response.data.data
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
            this.mobil.append('id_mitra',this.form.id_mitra);
            this.mobil.append('no_plat',this.form.no_plat);
            this.mobil.append('nama_mobil', this.form.nama_mobil);
            this.mobil.append('foto_mobil', this.form.foto_mobil);
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
            if(this.form.kategori_aset==='Perusahaan'){
                this.mobil.append('id_mitra','');
                this.mobil.append('no_plat',this.form.no_plat);
                this.mobil.append('nama_mobil', this.form.nama_mobil);
                this.mobil.append('foto_mobil', this.form.foto_mobil);
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
            }else{
                this.mobil.append('id_mitra',this.form.id_mitra);
                this.mobil.append('no_plat',this.form.no_plat);
                this.mobil.append('nama_mobil', this.form.nama_mobil);
                this.mobil.append('foto_mobil', this.form.foto_mobil);
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
            var url = this.$api+'/mobil/'+this.deleteId+'/delete';
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
            this.form ={
                id_mitra: null,
                no_plat: null,
                nama_mobil: null,
                foto_mobil: null,
                tipe_mobil: null,
                jenis_transmisi: null,
                jenis_bahan_bakar: null,
                volume_bahan_bakar: null,
                warna_mobil: null,
                kapasitas_penumpang: null,
                fasilitas_mobil: null,
                no_stnk: null,
                tgl_servis_terakhir: null,
                kategori_aset: null,
                tarif_mobil_harian: null,
                tgl_mulai_kontrak: null,
                tgl_habis_kontrak: null,
            }
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id_mobil;
            this.form.id_mitra = item.id_mitra;
            this.form.no_plat = item.no_plat;
            this.form.nama_mobil = item.nama_mobil;
            this.form.foto_mobil = item.foto_mobil;
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
            this.getMitra();
            this.getMobilHabisKontrak();
        }
}
</script>
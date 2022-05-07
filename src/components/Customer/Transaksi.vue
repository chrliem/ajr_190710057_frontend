<template>
    <v-main>
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Transaksi Penyewaan </h2>
        </v-container>

        <v-container>
            <v-card color="orange lighten-2+" class="elevation-6">
                <v-card-title>
                <v-btn :disabled="cekVerifikasiCustomer===true" color="success" dark @click="dialog=true"> Tambah Transaksi Penyewaan </v-btn>
                </v-card-title>
            </v-card>
        </v-container>

        <v-container>
            <v-row dense style="height:100px;">
                <v-col
                    md="3"
                    :items="transaksis"
                    v-for="transaksi in transaksis"
                    :key="transaksi.no_transaksi">
                    <v-hover v-slot="{ hover }">

                    <v-card
                        class="white elevation-4"
                        
                        outlined
                        tile
                        :elevation="hover ? 12 : 2"
                        :class="{ 'on-hover': hover }"
                    >
                    <v-img
                        :src="logoAJR"
                    ></v-img>
                    <v-card-title class="justify-center">
                        {{transaksi.no_transaksi}}
                    </v-card-title>
                     <v-card-text>
                        <div class="text-left"><strong>Tanggal Transaksi :</strong> {{transaksi.tgl_transaksi}}</div>
                        <div class="text-left"><strong>Status Pembayaran</strong></div>
                        <div 
                            v-bind:class="setColorStatusPembayaran(transaksi.status_pembayaran)"
                            class="rounded pa-1 text-center text-no-wrap"><strong>{{transaksi.status_pembayaran}}</strong></div>
                            <div class="text-left"><strong>Status Transaksi</strong></div>
                        <div 
                            v-bind:class="setColorStatusTransaksi(transaksi.status_transaksi)"
                            class="rounded pa-1 text-center text-no-wrap"><strong>{{transaksi.status_transaksi}}</strong></div>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card>
                    <v-card-text>
                    <v-card-actions class="justify-center">
                         <v-btn color="success" @click="viewHandler(transaksi.no_transaksi)"><v-icon>mdi-eye-circle</v-icon>View</v-btn>
                        <v-btn v-show="transaksi.status_transaksi==='Selesai'" color="warning" @click="ratingHandler(transaksi)"><v-icon>mdi-star</v-icon> Give Rating</v-btn>
                        <v-btn v-show="transaksi.status_transaksi==='Selesai'" color="primary" @click="print(transaksi.no_transaksi)"><v-icon></v-icon> Print </v-btn>
                    </v-card-actions>
                    </v-card-text>
                    </v-card>
                    
                    </v-card>
                    </v-hover>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card>
            <v-card-title>
            <span class="headline"> {{formTitle}} Transaksi </span>
            </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.no_customer" label="Nomor Customer" disabled> </v-text-field>
            <v-text-field v-model="form.nama_customer" label="Nama Customer"  disabled></v-text-field>
            <v-radio-group  v-model="form.jenis_transaksi" label="Jenis Transaksi" required>
              <v-radio value="1" label="Sewa Mobil dengan Driver"></v-radio>
              <v-radio v-show="cekTipeTransaksi===true" value="2" label="Sewa Mobil"></v-radio>
            </v-radio-group>
            <v-radio-group v-show="form.jenis_transaksi!==''" v-model="form.pilihan_mobil" label="Pilihan Mobil Tersedia" required>
          <v-radio v-for="mobil in mobils" v-show="mobil.status_ketersediaan_mobil===1" :label="mobil.nama_mobil" :key="mobil.id_mobil" :value="mobil.id_mobil">
                    <template v-slot:label>
                        <v-card width="300px" color="white">
                            <v-img max-width="300px" :src="$baseURL+'/storage/foto_mobil/'+mobil.foto_mobil"></v-img>
                            <v-divider></v-divider>
                            <v-card-text>
                            <div class="text-left"><strong>Nama Mobil</strong> : {{mobil.nama_mobil}}</div>
                            <div class="text-left"><strong>Tipe Mobil</strong> : {{mobil.tipe_mobil}}</div>
                            <div class="text-left"><strong>Warna Mobil</strong> : {{mobil.warna_mobil}}</div>
                            <div class="text-left"><strong>Jenis Transmisi </strong>   : {{mobil.jenis_transmisi}}</div>
                            <div class="text-left"><strong>Jenis Bahan Bakar </strong>   : {{mobil.jenis_bahan_bakar}}</div>
                            <div class="text-left"><strong>Volume Bahan Bakar </strong>   : {{mobil.volume_bahan_bakar}} Liter</div>
                            <div class="text-left"><strong>Kapasitas Penumpang </strong>   : {{mobil.kapasitas_penumpang}} orang</div>
                            <div class="text-left"><strong>Fasilitas Mobil </strong>   : {{mobil.fasilitas_mobil}}</div>
                            <div class="text-left"><strong>Tarif Harian </strong>   : Rp {{mobil.tarif_mobil_harian}}</div>
                            </v-card-text>
                        </v-card>
                    </template>
                </v-radio>    
            </v-radio-group>
             <v-radio-group  v-show="form.jenis_transaksi==='1'" v-model="form.pilihan_driver" label="Pilihan Driver Tersedia" required>
                <v-radio v-for="driver in drivers" v-show="driver.status_ketersediaan_driver===1" :label="driver.nama_driver " :key="driver.id_driver" :value="driver.id_driver">
                    <template v-slot:label>
                        <v-card width="300px" color="white">
                            <v-img class="mx-auto" max-width="100px" :src="$baseURL+'/storage/foto_driver/'+driver.foto_driver"></v-img>
                            <v-divider></v-divider>
                            <v-card-text>
                            <div class="text-left"><strong>Nama Driver </strong>   : {{driver.nama_driver}}</div>
                            <div class="text-left"><strong>Jenis Kelamin </strong>   : {{driver.jenis_kelamin_driver}}</div>
                            <div class="text-left"><strong>Tarif harian </strong>   : Rp {{driver.tarif_driver_harian}}</div>
                            <div class="text-left"><strong>Kemampuan Bahasa Asing </strong>   : {{setKemampuanBahasa(driver.kemampuan_bahasa_asing)}}</div>
                            </v-card-text>
                        </v-card>
                    </template>
                </v-radio>
            </v-radio-group>
            <div>Mulai Sewa</div>   
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field  :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)" type="date" v-model="form.tanggal_mulai_sewa" label="Tanggal Mulai Sewa" required></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field type="time" v-model="form.jam_mulai_sewa" label="Jam Mulai Sewa" required></v-text-field>
                </v-col>
            </v-row>
            <div>Selesai Sewa</div>   
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field  :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)" type="date" v-model="form.tanggal_selesai_sewa" label="Tanggal Selesai Sewa" required></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field  type="time" v-model="form.jam_selesai_sewa" label="Jam Selesai Sewa" required></v-text-field>
                </v-col>
            </v-row>
            <v-radio-group  v-model="form.pilihan_promo" label="Pilihan Promo" required>
                <v-radio v-for="promo in promos" v-show="promo.status_aktif===1" :label="promo.kode_promo" :key="promo.id_promo" :value="promo.id_promo">{{promo.keterangan}}
                <template v-slot:label>
                        <v-card width="300px" color="white">
                            <v-divider></v-divider>
                            <v-card-text>
                            <div class="text-left"><strong>Keterangan </strong>   : {{promo.keterangan}}</div>
                            <div class="text-left"><strong>Potongan Promo </strong>   : {{promo.potongan_promo*100}} %</div>
                            </v-card-text>
                        </v-card>
                    </template>
                </v-radio>
            </v-radio-group>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="setForm">Simpan</v-btn>          
        </v-card-actions>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
        
      </v-card>
    </v-dialog>

     <v-dialog v-model="detail_transaksi" persistent max-width="800px">
            <v-card max-width="800px">
              <v-card-title>
                  Detail Transaksi
                  <v-spacer></v-spacer>
                   <v-btn color="success" @click="close">Close</v-btn>
            </v-card-title>
            <v-card-text align="left">
            
            <div class="text-left"><strong>No Transaksi </strong>   : {{transaksi1.no_transaksi}}</div>
            <div class="text-left"><strong>Tanggal Transaksi </strong>   : {{transaksi1.tgl_transaksi}}</div>
            <div class="text-left"><strong>Customer </strong>   : {{transaksi1.nama_customer}}</div>
            <div class="text-left"><strong>Customer Service </strong>   : {{transaksi1.nama_pegawai}}</div>
            <div class="text-left"><strong>Tipe Transaksi  </strong>   : {{setTipe(transaksi1.id_driver)}}</div>
            <v-row>
                <v-col cols="12" lg="6">
                    <div class="text-left"><strong>Mobil yang Disewa  </strong>   : </div>
                    <v-card width="300px" color="white">
                        <v-img max-width="300px" :src="$baseURL+'/storage/foto_mobil/'+transaksi1.foto_mobil"></v-img>
                        <v-divider></v-divider>
                        <v-card-text>
                        <div class="text-left"><strong>Nama Mobil</strong> : {{transaksi1.nama_mobil}}</div>
                        <div class="text-left"><strong>Tipe Mobil</strong> : {{transaksi1.tipe_mobil}}</div>
                        <div class="text-left"><strong>Warna Mobil</strong> : {{transaksi1.warna_mobil}}</div>
                        <div class="text-left"><strong>Jenis Transmisi </strong>   : {{transaksi1.jenis_transmisi}}</div>
                        <div class="text-left"><strong>Jenis Bahan Bakar </strong>   : {{transaksi1.jenis_bahan_bakar}}</div>
                        <div class="text-left"><strong>Volume Bahan Bakar </strong>   : {{transaksi1.volume_bahan_bakar}} Liter</div>
                        <div class="text-left"><strong>Kapasitas Penumpang </strong>   : {{transaksi1.kapasitas_penumpang}} orang</div>
                        <div class="text-left"><strong>Fasilitas Mobil </strong>   : {{transaksi1.fasilitas_mobil}}</div>
                        <div class="text-left"><strong>Tarif Harian </strong>   : Rp {{transaksi1.tarif_mobil_harian}}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                    <div v-show="transaksi1.nama_driver!==null" class="text-left"><strong>Driver yang Disewa </strong>   :</div>
                   <v-card v-show="transaksi1.nama_driver!==null" width="300px" color="white">
                        <v-img class="mx-auto" max-width="100px" :src="$baseURL+'/storage/foto_driver/'+transaksi1.foto_driver"></v-img>
                        <v-divider></v-divider>
                        <v-card-text>
                        <div class="text-left"><strong>Nama Driver </strong>   : {{transaksi1.nama_driver}}</div>
                        <div class="text-left"><strong>Jenis Kelamin </strong>   : {{transaksi1.jenis_kelamin_driver}}</div>
                        <div class="text-left"><strong>Tarif harian </strong>   : Rp {{transaksi1.tarif_driver_harian}}</div>
                        <div class="text-left"><strong>Kemampuan Bahasa Asing </strong>   : {{setKemampuanBahasa(transaksi1.kemampuan_bahasa_asing)}}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            
        <br>
          <div class="text-left"><strong>Tanggal Mulai Sewa </strong>           : {{transaksi1.tgl_mulai_sewa}}</div>
          <div class="text-left"><strong>Tanggal Selesai Sewa  </strong>        : {{transaksi1.tgl_selesai_sewa}}</div>
            <div class="text-left"><strong>Tanggal Pengembalian  </strong>      : {{transaksi1.tgl_pengembalian}}</div>
            <br><v-divider></v-divider><br>
            <div><strong>RINCIAN BIAYA</strong></div><br>
            <div class="text-left"><strong>Total Biaya Mobil </strong>   : Rp {{transaksi1.total_biaya_mobil}}</div>
            <div class="text-left"><strong>Total Biaya Driver  </strong>   : Rp {{transaksi1.total_biaya_driver}}</div>
            <div class="text-left"><strong>Total Biaya Ekstensi  </strong>   : Rp {{transaksi1.total_biaya_ekstensi}}</div>
            <div v-show="transaksi1.kode_promo!==null" class="text-left"><strong>Promo  </strong>   : {{transaksi1.kode_promo}}</div>
            <div v-show="transaksi1.kode_promo!==null" class="text-left"><strong>Potongan Promo  </strong>   : {{transaksi1.potongan_promo}}</div>
            <v-divider></v-divider>
            <div class="text-left"><strong>Grand Total  </strong>   : Rp {{transaksi1.grand_total_pembayaran}}</div>
            <v-divider></v-divider><br>
            <div class="text-left"><strong>Metode Pembayaran  </strong>   : {{transaksi1.metode_pembayaran}}</div>
            <div class="text-left"><strong>Status Pembayaran  </strong>   :</div>
            <div 
                v-bind:class="setColorStatusPembayaran(transaksi1.status_pembayaran)"
                class="rounded pa-1 text-center text-no-wrap"><strong>{{transaksi1.status_pembayaran}}</strong></div>
             <div class="text-left"><strong>Status Transaksi</strong></div>
            <div 
                v-bind:class="setColorStatusTransaksi(transaksi1.status_transaksi)"
                class="rounded pa-1 text-center text-no-wrap"><strong>{{transaksi1.status_transaksi}}</strong></div>
            <div v-show="transaksi1.bukti_pembayaran!==null" class="text-left"><strong>Bukti Pembayaran  </strong>   :</div>
            <v-img
                v-show="transaksi1.bukti_pembayaran!==null"
                :src="$baseURL+'/storage/bukti_pembayaran/'+transaksi1.bukti_pembayaran"
                height="200px"
                width="200px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img max-height="1000px" :src="$baseURL+'/storage/bukti_pembayaran/'+transaksi1.bukti_pembayaran"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
            </v-card-text>
            <v-card-text>
          <v-card-actions class="justify-center">
              <v-btn :disabled="transaksi1.status_transaksi==='Selesai'||transaksi1.status_transaksi==='Batal'" color="success" @click="bayar(transaksi1.no_transaksi)">Pembayaran</v-btn>
              <v-btn :disabled="transaksi1.status_transaksi!=='Menunggu Verifikasi'" color="error" @click="deleteHandler(transaksi1.no_transaksi)">Pembatalan</v-btn> 
          </v-card-actions>
          </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBayar" persistent max-width="400px">
        <v-card>
            <v-card-title>
            <span class="headline"> Pembayaran Transaksi </span>
            </v-card-title>
        <v-card-text>
          <v-container>
            <v-radio-group v-model="form.metode_pembayaran" label="Metode Pembayaran" required>
              <v-radio value="Tunai" label="Tunai"></v-radio>
              <v-radio value="Transfer" label="Transfer"></v-radio>
            </v-radio-group>
            <v-file-input
                id = 'bukti_pembayaran'
                v-model="form.bukti_pembayaran"
                enctype="multipart/form-data"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Upload Bukti Pembayaran"
                prepend-icon="mdi-camera"
                label="Bukti Pembayaran"
              ></v-file-input>          
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel1">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="update">Simpan</v-btn>          
        </v-card-actions>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
        
      </v-card>
    </v-dialog>

     <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Anda yakin ingin membatalkan transaksi?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel1">Tidak</v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">Ya</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRating1" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Rating</span>
        </v-card-title>
        <v-card-text>
            <div class="align-left"><strong>Rating Driver</strong></div>
            <v-rating v-model="form.rating_driver" color="warning"></v-rating>
            <div class="align-left"><strong>Rating AJR</strong></div>
            <v-rating v-model="form.rating_ajr" color="warning"></v-rating>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel2">Tidak</v-btn>
          <v-btn color="blue darken-1" text @click="rate">Ya</v-btn>          
        </v-card-actions>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRating2" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Rating</span>
        </v-card-title>
        <v-card-text>
            <div class="align-left"><strong>Rating AJR</strong></div>
            <v-rating v-model="form.rating_ajr" color="warning"></v-rating>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel3">Tidak</v-btn>
          <v-btn color="blue darken-1" text @click="rate">Ya</v-btn>          
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
import moment from 'moment'
    export default{
        name: "Transaksi Penyewaan",
        
        data(){
            return{
                logoAJR: require('@/assets/logoAJR.png'),
                hover:false,
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                snackbar1: false,
                error_message: '',
                response_message:'',
                color: '',
                dialog: false,
                detail_transaksi: false,
                dialogConfirm: false,
                dialogRating1: false,
                dialogRating2: false,
                overlay: false,
                 transaksi1:[],
                 dialogBayar: false,
                transaksi: new FormData,
                transaksis: [],
                mobils: [],
                drivers: [],
                promos: [],
                menu1: false,
                absolute:false,
                pdf:'',
                form:{
                    no_transaksi: '',
                    no_customer: localStorage.getItem('id'),
                    nama_customer: localStorage.getItem('nama'),
                    pilihan_promo: '',
                    jenis_transaksi: '',
                    pilihan_mobil: '',
                    pilihan_driver: '',
                    id_pegawai:'',
                    tgl_transaksi: '',
                    tgl_mulai_sewa: '',
                    tgl_pengembalian: '',
                    total_biaya_ekstensi: '',
                    total_biaya_driver: '',
                    total_biaya_mobil: '',
                    metode_pembayaran: '',
                    bukti_pembayaran:'',
                    rating_driver: '',
                    rating_ajr: ''

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
            setColorStatusPembayaran(status_pembayaran){
                if(status_pembayaran==='Belum Lunas'){
                    return 'orange'
                }else if(status_pembayaran==='Lunas'){
                    return 'green'
                }
            },
            setColorStatusTransaksi(status_transaksi){
                if(status_transaksi==='Menunggu Verifikasi'){
                    return 'orange'
                }else if(status_transaksi==='Sedang Berjalan'){
                    return 'blue'
                }else if(status_transaksi==='Selesai'){
                    return 'green'
                }else if(status_transaksi==='Batal'){
                    return 'red'
                }
            },
            setTipe(id_driver){
                if(id_driver!==null){
                    return 'Sewa Mobil'
                }else{
                    return 'Sewa Mobil dengan Driver'
                }
            },
            getNamaUser(){
                var nama = localStorage.getItem('nama')
                return nama
            },
            getIdUser(){
                var id = localStorage.getItem('id')
                return id
            },
            cekInputType(){
                if(this.inputType === 'Bayar'){
                    return true
                }else{
                    return false
                }
            },
            setKemampuanBahasa(kemampuan_bahasa_asing){
                if(kemampuan_bahasa_asing===1){
                    return 'Bisa'
                }else{
                    return 'Tidak Bisa'
                }
            },
            cekTipeTransaksi(){
                var url = this.$api+'/customer/'+localStorage.getItem('id');
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.customers=response.data.data
                })

                if(customers.tipe_transaksi===1){
                    return true
                }else if(customers.tipe_transaksi===0){
                    return false
                }
            },
            cekVerifikasiCustomer(){
                var url=this.$api+'/customer/'+ localStorage.getItem('id');
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.customers=response.data.data
                })

                if(customers.tipe_transaksi===null){
                    return true
                }else{
                    return false
                }
            },
            print(no_transaksi){
                 var url=this.$api+'/transaksipenyewaan/'+no_transaksi+'cetak-nota';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                        type: 'application/pdf'
                    }
                }).then(response=>{
                    const file = new Blob(
                    [response.data.data], 
                    {type: 'application/pdf'});
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    //Open the URL on new Window
                    window.open(fileURL);
                    this.response_message = response.data.message;
                })
            },
            getMobil(){
                var url=this.$api+'/mobil-list/';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.mobils=response.data.data
                })
            },
            getDriver(){
                var url=this.$api+'/driver-list/';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.drivers=response.data.data
                })
            },
            getPromo(){
                var url=this.$api+'/promo-list/';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.promos=response.data.data
                })
            },
            readData(){
                var url =  this.$api+'/transaksipenyewaan-customer/'+localStorage.getItem('id')
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.transaksis = response.data.data;
                    })

            },
            readDatabyId(){
                var url=this.$api+'/transaksipenyewaan/'+this.getId
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.transaksi1=response.data.data[0]
                        console.log(this.transaksi1)
                        this.response_message = response.data.message;
                        this.color = "green";
                        this.snackbar1 = true;
                    })
            },
            save(){

                var bukti_pembayaran = document.getElementById('bukti_pembayaran');

                if(bukti_pembayaran.files[0]){
                    this.transaksi.append('bukti_pembayaran',bukti_pembayaran.files[0]);
                }
                var formatted_tgl_mulai_sewa = moment(this.form.tanggal_mulai_sewa).format( "YYYY-MM-DD")
                var formatted_jam_mulai_sewa = moment(this.form.jam_mulai_sewa,"hh:mm").format("HH:mm:ss")
                var formatted_datetime_mulai_sewa = formatted_tgl_mulai_sewa+' '+formatted_jam_mulai_sewa
                console.log(formatted_datetime_mulai_sewa)

                var formatted_tgl_selesai_sewa = moment(this.form.tanggal_selesai_sewa).format( "YYYY-MM-DD")
                var formatted_jam_selesai_sewa = moment(this.form.jam_selesai_sewa,"hh:mm").format("HH:mm:ss")
                var formatted_datetime_selesai_sewa = formatted_tgl_selesai_sewa+' '+formatted_jam_selesai_sewa

                
                this.transaksi.append('id_customer',localStorage.getItem('id'));
                this.transaksi.append('id_promo', this.form.pilihan_promo);
                this.transaksi.append('id_mobil', this.form.pilihan_mobil);
                this.transaksi.append('id_driver', this.form.pilihan_driver);
                this.transaksi.append('tgl_mulai_sewa', formatted_datetime_mulai_sewa);
                this.transaksi.append('tgl_selesai_sewa', formatted_datetime_selesai_sewa);
                this.transaksi.append('metode_pembayaran', this.form.metode_pembayaran);
                this.transaksi.append('rating_driver', this.form.rating_driver);
                this.transaksi.append('rating_ajr', this.form.rating_ajr);

                var url = this.$api+'/transaksipenyewaan/'
                this.load = true;
                this.$http.post(url, this.transaksi, {
                    headers: {
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
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
                    console.log(error.response.data.message)
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        bayar(no_transaksi){
            this.editId = no_transaksi;
            this.dialogBayar = true;
        },
        update(){

            var bukti_pembayaran = document.getElementById('bukti_pembayaran');

                if(bukti_pembayaran.files[0]){
                    this.transaksi.append('bukti_pembayaran',bukti_pembayaran.files[0]);
                }

                this.transaksi.append('metode_pembayaran', this.form.metode_pembayaran);

                var url = this.$api+'/transaksipenyewaan/'+this.editId+'/pembayaran'
                this.load = true;
                this.$http.post(url, this.transaksi, {
                    headers: {
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
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
        deleteData(){
            var url = this.$api+'/transaksipenyewaan/'+this.deleteId+'/pembatalan';
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
            location.reload();
        },
        cancel1(){
            this.resetForm();
            this.readData();
            this.dialogConfirm = false;
            this.dialogBayar = false;
        },
        cancel2(){
            this.resetForm();
            this.readData();
            this.dialogRating1 = false;
        },
        cancel3(){
            this.resetForm();
            this.readData();
                        this.dialogRating2 = false;

        },
        resetForm(){
            this.form = {
                no_transaksi: '',
                no_customer: localStorage.getItem('id'),
                nama_customer: localStorage.getItem('nama'),
                jenis_transaksi: '',
                id_promo: '',
                id_mobil: '',
                id_driver: '',
                id_pegawai:'',
                tgl_transaksi: '',
                tgl_mulai_sewa: '',
                tgl_pengembalian: '',
                total_biaya_ekstensi: '',
                total_biaya_driver: '',
                total_biaya_mobil: '',
                metode_pembayaran: '',
                bukti_pembayaran:'',
                rating_driver: '',
                rating_ajr: ''
            }
        },
        editHandler(transaksi){
            this.inputType = 'Bayar';
            this.editId = transaksi.no_transaksi;
            this.form.id_customer = transaksi.id_customer;
            this.form.id_promo = transaksi.id_promo;
            this.form.pilihan_mobil = transaksi.id_mobil;
            this.form.pilihan_driver = transaksi.id_driver;
            this.form.id_pegawai = transaksi.id_pegawai;
            this.form.tgl_transaksi = transaksi.tgl_transaksi;
            this.form.tgl_mulai_sewa = transaksi.tgl_mulai_sewa;
            this.form.tgl_selesai_sewa = transaksi.tgl_selesai_sewa;
            this.form.metode_pembayaran = transaksi.metode_pembayaran;
            this.form.bukti_pembayaran = transaksi.bukti_pembayaran;
            this.form.rating_driver = transaksi.rating_driver;
            this.form.rating_ajr = transaksi.rating_ajr;
            this.dialog = true
        },
        rate(){
            this.transaksi.append('rating_driver', this.form.rating_driver)
            this.transaksi.append('rating_ajr', this.form.rating_ajr)

            var url = this.$api+'/transaksipenyewaan/'+this.rateId+'/rating'
                this.load = true;
                this.$http.post(url, this.transaksi, {
                    headers: {
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.dialogRating1 = false;
                    this.dialogRating2 = false;
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        viewHandler(no_transaksi){
            this.getId = no_transaksi;
            this.readDatabyId();
            this.detail_transaksi = true;
        },
        deleteHandler(no_transaksi){
            this.deleteId = no_transaksi;
            this.dialogConfirm = true;
        },
        ratingHandler(transaksi){
            this.rateId = transaksi.no_transaksi;
            if(transaksi.id_driver===null){
                this.dialogRating2 = true;
            }else{
                this.dialogRating1 = true;
            }
        },
        close(){
            this.dialog = false;
            this.inputType = 'Tambah'
            this.dialogConfirm = false;
            this.detail_transaksi = false;
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
        this.getMobil();
        this.getDriver();
        this.getPromo();
    }
}
</script>
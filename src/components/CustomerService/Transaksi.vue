<template>
    <v-main>
        <v-container>
            <h2 class="text-h3" font-weight-medium mb-5> Transaksi Penyewaan </h2>
        </v-container>

        <v-container>
            <v-card class="elevation-6">
                <v-data-table :headers="headers" :items="transaksis">
                    <template v-slot:[`item.actions`] ="{item}">
                        <v-chip><v-icon color="green" @click="viewHandler(item.no_transaksi)">mdi-eye-circle</v-icon></v-chip>
                        <span v-if="item.status_transaksi==='Menunggu Verifikasi'">
                            <v-chip><v-icon color="blue" @click="editHandler(item)">mdi-pencil</v-icon></v-chip>
                        </span>
                    </template>
                    <template v-slot:[`item.tipe_transaksi`]="{item}">
                        <span v-if="item.id_driver===null"><div>Sewa Mobil</div></span>
                        <span v-else-if="item.id_driver!==null"><div>Sewa Mobil dan Driver</div></span>
                    </template>
                    <template v-slot:[`item.status_transaksi`] ="{item}">
                        <span v-if="item.status_transaksi==='Menunggu Verifikasi'"><v-chip color="warning">Menunggu Verifikasi</v-chip></span>
                        <span v-else-if="item.status_transaksi==='Sedang Berjalan'"><v-chip color="primary" >Sedang Berjalan</v-chip></span>
                        <span v-else-if="item.status_transaksi==='Selesai'"><v-chip color="success" >Selesai</v-chip></span>
                        <span v-else-if="item.status_transaksi==='Batal Transaksi'"><v-chip color="error" >Batal Transaksi</v-chip></span>
                        <span v-else-if="item.status_transaksi==='Verifikasi Ditolak'"><v-chip color="error" >Verifikasi Ditolak</v-chip></span>
                    </template>
                    <template v-slot:[`item.status_pembayaran`] ="{item}">
                        <span v-if="item.status_pembayaran==='Belum Lunas'"><v-chip color="warning">Belum Lunas</v-chip></span>
                        <span v-else-if="item.status_pembayaran==='Lunas'"><v-chip color="success" >Lunas</v-chip></span>
                    </template>
                </v-data-table >
            </v-card>
        </v-container>

        <v-dialog v-model="dialog" persistent max-width="800px">
            <v-card>
                <v-card-title>
                <span class="headline"> Ubah Transaksi </span>
                </v-card-title>
            <v-card-text>
            <v-container>
                <v-text-field v-model="form.no_customer" label="Nomor Customer" disabled> </v-text-field>
                <v-radio-group disabled v-model="form.jenis_transaksi" label="Jenis Transaksi" required>
                <v-radio value="1" label="Sewa Mobil dengan Driver"></v-radio>
                <v-radio value="2" label="Sewa Mobil"></v-radio>
                </v-radio-group>
                <v-radio-group v-show="form.jenis_transaksi!==''" v-model="form.pilihan_mobil" label="Pilihan Mobil" required>
                <v-radio v-for="mobil in mobils"  :label="mobil.nama_mobil" :key="mobil.id_mobil" :value="mobil.id_mobil">
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
                                <span v-if="mobil.status_ketersediaan_mobil===1">
                                    <div class="text-left"><strong>Status Ketersediaan </strong>   : Tersedia</div>
                                </span>
                                <span v-else-if="mobil.status_ketersediaan_mobil===0">
                                    <div class="text-left"><strong>Status Ketersediaan </strong>   : Tidak Tersedia</div>
                                </span>
                                </v-card-text>
                            </v-card>
                        </template>
                    </v-radio>    
                    </v-radio-group>
                    <v-radio-group  v-show="form.jenis_transaksi==='1'" v-model="form.pilihan_driver" label="Pilihan Driver " required>
                    <v-radio v-for="driver in drivers"  :label="driver.nama_driver " :key="driver.id_driver" :value="driver.id_driver">
                        <template v-slot:label>
                            <v-card width="300px" color="white">
                                <v-img class="mx-auto" max-width="100px" :src="$baseURL+'/storage/foto_driver/'+driver.foto_driver"></v-img>
                                <v-divider></v-divider>
                                <v-card-text>
                                <div class="text-left"><strong>Nama Driver </strong>   : {{driver.nama_driver}}</div>
                                <div class="text-left"><strong>Jenis Kelamin </strong>   : {{driver.jenis_kelamin_driver}}</div>
                                <div class="text-left"><strong>Tarif harian </strong>   : Rp {{driver.tarif_driver_harian}}</div>
                                <div class="text-left"><strong>Kemampuan Bahasa Asing </strong>   : {{setKemampuanBahasa(driver.kemampuan_bahasa_asing)}}</div>
                                <span v-if="driver.status_ketersediaan_driver===1">
                                    <div class="text-left"><strong>Status Ketersediaan </strong>   : Tersedia</div>
                                </span>
                                <span v-else-if="driver.status_ketersediaan_driver===0">
                                    <div class="text-left"><strong>Status Ketersediaan </strong>   : Tidak Tersedia</div>
                                </span>
                                
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
                        <v-radio :checked="isChecked" v-for="promo in promos" v-show="promo.status_promo===1" :label="promo.kode_promo" :key="promo.id_promo" :value="promo.id_promo">
                        <template v-slot:label>
                                <v-card width="300px" color="white">
                                    <v-divider></v-divider>
                                    <v-card-text>
                                    <div class="text-left"><strong>Kode Promo </strong>   : {{promo.kode_promo}}</div>
                                    <div class="text-left"><strong>Keterangan </strong>   : {{promo.keterangan}}</div>
                                    <div class="text-left"><strong>Potongan Promo </strong>   : {{promo.potongan_promo*100}} %</div> 
                                    </v-card-text>
                                </v-card>
                            </template> 
                        </v-radio>
                        <v-btn small text @click="uncheck">Batal Pilihan Promo</v-btn>
                    </v-radio-group>
                </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancel">Batal</v-btn>
                <v-btn color="blue darken-1" text @click="dialogConfirm=true">Simpan</v-btn>          
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
          <div class="text-left"><strong>Durasi Sewa  </strong>        : {{transaksi1.durasi_penyewaan}} Hari</div>
            <div class="text-left"><strong>Tanggal Pengembalian  </strong>      : {{transaksi1.tgl_pengembalian}}</div>
            <br><v-divider></v-divider><br>
            <div><strong>RINCIAN BIAYA</strong></div><br>
            <div class="text-left"><strong>Total Biaya Mobil </strong>   : Rp {{transaksi1.total_biaya_mobil}}</div>
            <div class="text-left"><strong>Total Biaya Driver  </strong>   : Rp {{transaksi1.total_biaya_driver}}</div>
            <div class="text-left"><strong>Total Biaya Ekstensi  </strong>   : Rp {{transaksi1.total_biaya_ekstensi}}</div>
            <div v-show="transaksi1.kode_promo!==null" class="text-left"><strong>Promo  </strong>   : {{transaksi1.kode_promo}}</div>
            <div v-show="transaksi1.kode_promo!==null" class="text-left"><strong>Potongan Promo  </strong>   : {{transaksi1.potongan_promo*100}}%</div>
            <v-divider></v-divider>
            <span v-if="transaksi1.tgl_pengembalian===null">
                <div class="text-left"><strong>Grand Total  </strong>   : Rp {{transaksi1.grand_total_pembayaran-transaksi1.grand_total_pembayaran*transaksi1.potongan_promo}}</div>
            </span>
            <span v-else>
                <div class="text-left"><strong>Grand Total  </strong>   : Rp {{transaksi1.grand_total_pembayaran}}</div>
            </span>
            
            <v-divider></v-divider><br>
            <span v-if="transaksi1.metode_pembayaran==='null'">
                <div class="text-left"><strong>Metode Pembayaran  </strong>   : Belum melakukan pembayaran</div>
            </span>
            <span v-else>
                <div class="text-left"><strong>Metode Pembayaran  </strong>   : {{transaksi1.metode_pembayaran}}</div>
            </span>
            <div class="text-left"><strong>Status Pembayaran  </strong>   :</div>
            <div 
                v-bind:class="setColorStatusPembayaran(transaksi1.status_pembayaran)"
                class="rounded pa-1 text-center text-no-wrap">{{transaksi1.status_pembayaran}}</div>
             <div class="text-left"><strong>Status Transaksi</strong></div>
            <div 
                v-bind:class="setColorStatusTransaksi(transaksi1.status_transaksi)"
                class="rounded pa-1 text-center text-no-wrap">{{transaksi1.status_transaksi}}</div>
            <div v-show="transaksi1.bukti_pembayaran!==null" class="text-left"><strong>Bukti Pembayaran  </strong>   :</div>
            <v-img
                v-show="transaksi1.bukti_pembayaran!==null"
                :src="$baseURL+'/storage/bukti_pembayaran/'+transaksi1.bukti_pembayaran"
                height="200px"
                width="200px"
                @click="overlay=!overlay"
            ></v-img>
            <v-overlay :absolute="absolute" :value="overlay">
                <v-img max-height="800px" max-width="600px" :src="$baseURL+'/storage/bukti_pembayaran/'+transaksi1.bukti_pembayaran"></v-img>
             <v-btn color="success" @click="overlay = false">Close</v-btn>
          </v-overlay>
        </v-card-text>
          <br><v-divider></v-divider><br>
          <v-card-text>
              <v-card-actions class="justify-center">
              <v-btn :disabled="transaksi1.status_transaksi==='Batal Transaksi'" color="success" @click="verifyHandler(transaksi1)">Verifikasi</v-btn>
              <v-btn :disabled="transaksi1.tgl_pengembalian!==null || transaksi1.status_transaksi==='Menunggu Verifikasi' ||transaksi1.status_transaksi==='Batal Transaksi' ||transaksi1.status_transaksi==='Verifikasi Ditolak'" color="primary" @click="pengembalianHandler(transaksi1)">Pengembalian</v-btn>
                <v-btn :disabled="transaksi1.status_transaksi!=='Menunggu Verifikasi'" color="error" @click="deleteHandler(transaksi1.no_transaksi)">Pembatalan</v-btn>
          </v-card-actions>
          </v-card-text>
        </v-card>
        </v-dialog>

        <v-dialog v-model="dialogVerifikasi" persistent max-width="600px">
      <v-card max-width="600px">
          <v-card-title>
                  Verifikasi Transaksi
                  <v-spacer></v-spacer>
            </v-card-title>
        <v-card-text>
            <v-container>
            <v-radio-group v-model="form.status_transaksi" label="Status Transaksi" required>
              <v-radio value="Menunggu Verifikasi" label="Menunggu Verifikasi"></v-radio>
              <v-radio value="Verifikasi Ditolak" label="Verifikasi Ditolak"></v-radio>
              <v-radio value="Sedang Berjalan" label="Sedang Berjalan"></v-radio>
              <v-radio value="Selesai" label="Selesai"></v-radio>
        </v-radio-group>
        <v-radio-group v-model="form.status_pembayaran" label="Status Pembayaran" required>
              <v-radio value="Belum Lunas" label="Belum Lunas"></v-radio>
              <v-radio value="Lunas" label="Lunas"></v-radio>
        </v-radio-group>
        </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel1">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="dialogConfirm1=true">Verifikasi</v-btn>          
        </v-card-actions>
       
      </v-card>
    </v-dialog>

     <v-dialog v-model="dialogPengembalian" persistent max-width="400px">
        <v-card>
            <v-card-title>
            <span class="headline"> Pengembalian </span>
            </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-text-field  :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)" type="date" v-model="form.tgl_pengembalian" label="Tanggal Pengembalian" required></v-text-field>
                </v-col>
                <v-col cols="12" lg="6">
                    <v-text-field type="time" v-model="form.jam_pengembalian" label="Jam Pengenmbalian" required></v-text-field>
                </v-col>
            </v-row>         
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel2">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="dialogConfirm2=true">Simpan</v-btn>          
        </v-card-actions>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
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
        <v-card-text>Apakah anda ingin mengubah data transaksi penyewaan?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel3">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="setForm">Lanjut</v-btn>          
        </v-card-actions>
         <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
      </v-card>
    </v-dialog>

     <v-dialog v-model="dialogConfirm1" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Apakah anda ingin melakukan verifikasi data transaksi penyewaan?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel4">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="verify">Lanjut</v-btn>          
        </v-card-actions>
         <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{error_message}}
        </v-snackbar>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm2" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Apakah anda ingin memproses pengembalian mobil dan/atau driver?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel5">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="pengembalian">Lanjut</v-btn>          
        </v-card-actions>
         <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
           <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
            </div>
        </v-snackbar>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm3" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>
        <v-card-text>Apakah anda ingin membatalkan transaksi?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel6">Batal</v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">Lanjut</v-btn>          
        </v-card-actions>
         <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
           <div v-for="(errorArray, index) in error_message" :key="index">
                <div v-for="(error_message,  index) in errorArray" :key="index">
                    {{error_message}}
                </div>
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
import moment from 'moment'
export default{
    name: "Transaksi Penyewaan",

    data(){
        return{
            load: false,
            snackbar: false,
            snackbar1: false,
            error_message:'',
            response_message: '',
            color: '',
            dialog: false,
            dialogConfirm: false,
            dialogConfirm1: false,
            dialogConfirm2: false,
            dialogConfirm3: false,
            detail_transaksi: false,
            dialogVerifikasi: false,
            dialogPengembalian: false,
            overlay: false,
            transaksi1: [],
            transaksi: new FormData,
            transaksis: [],
            mobils: [],
            drivers: [],
            promos: [],
            customer1: [],
            customers:[],
            absolute: false,
            headers:[
                {text: 'No Transaksi', value:'no_transaksi', align:'center'},
                {text: 'Tanggal Transaksi', value: 'tgl_transaksi', align:'center'},
                {text: 'Customer', value:'id_customer', align:'center'},
                {text: 'Tipe Transaksi', value: 'tipe_transaksi', align:'center'},
                {text: 'Status Transaksi', value: 'status_transaksi', align:'center'},
                {text: 'Status Pembayaran', value: 'status_pembayaran', align:'center'},
                {text: 'Actions', value: 'actions', align: 'center'}
            ],
            form:{
                    no_transaksi: '',
                    no_customer: '',
                    nama_customer: '',
                    pilihan_promo: '',
                    jenis_transaksi: '',
                    pilihan_mobil: '',
                    pilihan_driver: '',
                    id_pegawai:'',
                    tgl_transaksi: '',
                    jam_mulai_sewa: '',
                    jam_selesai_sewa: '',
                    tgl_mulai_sewa: '',
                    tgl_pengembalian: '',
                    jam_pengembalian: '',
                    total_biaya_ekstensi: '',
                    total_biaya_driver: '',
                    total_biaya_mobil: '',
                    metode_pembayaran: '',
                    bukti_pembayaran:'',
                    rating_driver: '',
                    rating_ajr: '',
                    status_pembayaran: '',
                    status_transaksi: '',

                },
                editId: '',
                deleteId: '',
                getId: '',
                verifyId: '',

        };
    },
    methods:{
        setForm(){
            this.update();
            this.dialogConfirm= false;
        },
        uncheck(){
                this.form.pilihan_promo = '';
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
                }else if(status_transaksi==='Batal Transaksi'){
                    return 'red'
                }
                else if(status_transaksi==='Verifikasi Ditolak'){
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
            setKemampuanBahasa(kemampuan_bahasa_asing){
                if(kemampuan_bahasa_asing===1){
                    return 'Bisa'
                }else{
                    return 'Tidak Bisa'
                }
            },
            getMobil(){
                var url=this.$api+'/mobil/';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.mobils=response.data.data
                })
            },
            getDriver(){
                var url=this.$api+'/driver/';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.drivers=response.data.data
                })
            },
            getPromo(){
                var url=this.$api+'/promo/';
                this.$http.get(url,{
                    headers:{
                        'Authorization':'Bearer '+localStorage.getItem('token')
                    }
                }).then(response=>{
                    this.promos=response.data.data
                })
            },
            readData(){
                var url =  this.$api+'/transaksipenyewaan/'
                    this.$http.get(url,{
                        headers:{
                            'Authorization':'Bearer '+localStorage.getItem('token'),
                        }
                    }).then(response=>{
                        this.transaksis = response.data.data;
                    })

            },
            readDatabyId(no_transaksi){
                var url=this.$api+'/transaksipenyewaan/'+no_transaksi+'/transaksi'
                console.log(url)
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
            update(){
                var formatted_tgl_mulai_sewa = moment(this.form.tanggal_mulai_sewa).format( "YYYY-MM-DD")
                var formatted_jam_mulai_sewa = moment(this.form.jam_mulai_sewa,"hh:mm").format("HH:mm:ss")
                var formatted_datetime_mulai_sewa = formatted_tgl_mulai_sewa+' '+formatted_jam_mulai_sewa
                console.log(formatted_datetime_mulai_sewa)

                var formatted_tgl_selesai_sewa = moment(this.form.tanggal_selesai_sewa).format( "YYYY-MM-DD")
                var formatted_jam_selesai_sewa = moment(this.form.jam_selesai_sewa,"hh:mm").format("HH:mm:ss")
                var formatted_datetime_selesai_sewa = formatted_tgl_selesai_sewa+' '+formatted_jam_selesai_sewa

                if(this.form.pilihan_promo===null){
                    this.form.pilihan_promo='';
                }
                this.transaksi.append('id_mobil', this.form. pilihan_mobil);
                this.transaksi.append('id_driver', this.form.pilihan_driver);
                this.transaksi.append('id_promo', this.form.pilihan_promo);
                this.transaksi.append('metode_pembayaran', this.form.metode_pembayaran);
                this.transaksi.append('tgl_mulai_sewa', formatted_datetime_mulai_sewa);
                this.transaksi.append('tgl_selesai_sewa', formatted_datetime_selesai_sewa);
                
                
                

                var url = this.$api+'/transaksipenyewaan/'+this.editId+'/update'
                this.load = true;
                this.$http.post(url, this.transaksi, {
                    headers: {
                        'Authorization':'Bearer '+localStorage.getItem('token'),
                    }
                }).then(response=>{
                    this.response_message = response.data.message;
                    this.color ="green";
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
        verify(){
            var url = this.$api+'/transaksipenyewaan/'+this.verifyId+'/verifikasi'
            this.load= true
            this.transaksi.append('id_pegawai',localStorage.getItem('id'));
            this.transaksi.append('status_transaksi',this.form.status_transaksi)
            this.transaksi.append('status_pembayaran', this.form.status_pembayaran)

            this.$http.post(url,this.transaksi, {
                headers: {
                    'Authorization':'Bearer '+localStorage.getItem('token')
                }
            }).then(response=>{
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.dialogVerifikasi = false;
                    this.dialogConfirm1 = false;
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
            this.dialogVerifikasi = false;
            location.reload();
        },
        resetForm(){
            this.form = {
                no_transaksi: '',
                no_customer: '',
                nama_customer: '',
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
        cancel1(){
            this.resetForm();
            this.readData();
            this.dialogVerifikasi = false;
        },
        cancel2(){
            this.resetForm();
            this.readData();
            this.dialogPengembalian = false;
        },
        cancel3(){
            this.resetForm();
            this.readData();
            this.dialogConfirm = false;
        },
        cancel4(){
            // this.resetForm();
            this.readData();
            this.dialogConfirm1 = false;
        },
        cancel5(){
            this.resetForm();
            this.readData();
            this.dialogConfirm2 = false;
        },
        cancel6(){
            this.resetForm();
            this.readData();
            this.dialogConfirm3 = false;
        },
        editHandler(transaksi){
            this.editId = transaksi.no_transaksi;
            
            this.form.no_customer = transaksi.id_customer;
            if(transaksi.id_driver===null){
                this.form.jenis_transaksi = '2'
            }else if(transaksi.id_driver!==null){
                this.form.jenis_transaksi = '1'
            }

            this.form.pilihan_promo = transaksi.id_promo;
            this.form.pilihan_mobil = transaksi.id_mobil;
            this.form.pilihan_driver = transaksi.id_driver;
            this.form.id_pegawai = transaksi.id_pegawai;
            this.form.tgl_transaksi = transaksi.tgl_transaksi;
            this.form.tanggal_mulai_sewa = transaksi.tgl_mulai_sewa.substring(0,10);
            this.form.jam_mulai_sewa = transaksi.tgl_mulai_sewa.substring(11,16);
            this.form.tanggal_selesai_sewa = transaksi.tgl_selesai_sewa.substring(0,10);
            this.form.jam_selesai_sewa = transaksi.tgl_selesai_sewa.substring(11,16);
            this.form.metode_pembayaran = transaksi.metode_pembayaran;
            this.form.bukti_pembayaran = transaksi.bukti_pembayaran;
            this.form.rating_driver = transaksi.rating_driver;
            this.form.rating_ajr = transaksi.rating_ajr;
            this.dialog = true
        },
        viewHandler(no_transaksi){
            this.getId = no_transaksi;
            console.log(this.getId)
            this.readDatabyId(this.getId);
            this.detail_transaksi = true;
        },
        verifyHandler(transaksi){
            this.verifyId = transaksi.no_transaksi;
            this.form.status_transaksi = transaksi.status_transaksi;
            this.form.status_pembayaran = transaksi.status_pembayaran;
            this.dialogVerifikasi = true;
            
        },
        pengembalian(){
            var formatted_tgl_pengembalian = moment(this.form.tgl_pengembalian).format( "YYYY-MM-DD")
            var formatted_jam_pengembalian = moment(this.form.jam_pengembalian,"hh:mm").format("HH:mm:ss")
            var formatted_datetime_pengembalian = formatted_tgl_pengembalian+' '+formatted_jam_pengembalian
            
            if(formatted_datetime_pengembalian==='Invalid date Invalid date'){
                formatted_datetime_pengembalian = ''
            }
            
            this.transaksi.append('id_pegawai', localStorage.getItem('id'))
            this.transaksi.append('tgl_pengembalian', formatted_datetime_pengembalian)
            console.log(formatted_datetime_pengembalian)
            
            var url = this.$api+'/transaksipenyewaan/'+this.kembaliId+'/pengembalian'
                this.load = true;
            this.$http.post(url, this.transaksi, {
                headers: {
                    'Authorization':'Bearer '+localStorage.getItem('token')
                }
            }).then(response=>{
                    this.response_message = response.data.message;
                    this.color = "green";
                    this.snackbar1 = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.dialogPengembalian = false
                    this.dialogConfirm2 = false
            }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        pengembalianHandler(transaksi){
            this.kembaliId = transaksi.no_transaksi;
            this.dialogPengembalian = true;

           
        },
        close(){
            this.dialog = false;
            this.inputType = 'Tambah'
            this.dialogConfirm = false;
            this.detail_transaksi = false;
            this.readData();
        },
         deleteHandler(no_transaksi){
            this.deleteId = no_transaksi;
            this.dialogConfirm3 = true;
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
                    this.dialogConfirm3 = false;
                    this.inputType='Tambah';
                }).catch(error=>{
                    this.error_message = error.response.data.message;
                    this.color = "blue";
                    this.snackbar = true;
                    this.load = false;
                });
        },
    },
    computed:{
        formTitle(){
            return this.inputType;
        },
        
    },
    mounted(){
        this.readData();
        // this.readDatabyId();
        this.getMobil();
        this.getDriver();
        this.getPromo();
    }
}
</script>

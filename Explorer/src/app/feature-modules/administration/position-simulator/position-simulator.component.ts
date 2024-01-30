import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Location } from '../model/postion-simulator';
import * as L from 'leaflet';
import { ActivatedRoute, Route } from '@angular/router';
import { LongLatModel } from '../../company/model/longLatModel';
import { DatePipe } from '@angular/common';
import { AdministrationService } from '../administration.service';


@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css'],
})
export class PositionSimulatorComponent implements OnInit {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;
  isLoaded: boolean = false;
  locations: Location[] = [];
  private map: any;
  private marker: any;
  private hospitalMarker: any;
  private hospitalLocation: LongLatModel;
  private companyLocation: LongLatModel;
  day: number[]; 

  list: LongLatModel[] = [];

  constructor(private authService: AuthService, private route: ActivatedRoute, private datePipe: DatePipe, private adminService: AdministrationService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.hospitalLocation = JSON.parse(params['hospitalLocation']);
      this.companyLocation = JSON.parse(params['companyLocation']);
      this.day = JSON.parse(params['day'])
      this.list.push(this.companyLocation);
      this.list.push(this.hospitalLocation);
    });

    this.initializeMap();
    if(this.isSameDay()){
      this.sendStartResponse();
      this.initializeWebSocketConnection();
      this.adminService.getLocations(this.list).subscribe({
        next : () => {
            this.sendEndResponse();
        }   
      })
    }
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket();
    });
  }

  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe(
        '/socket-publisher',
        (message: { body: string }) => {
          this.handleResult(message);
        }
      );
    }
  }

  handleResult(message: { body: string }) {
    if (message.body) {
      let location: Location = JSON.parse(message.body);
      this.locations.push(location);
      this.updateMarker(location.latitude, location.longitude);

      if (!this.map) {
        this.initializeMapWithFirstLocation();
      }
    }
    console.log("Locations:", this.locations);
  }

  initializeMap(): void {
    console.log('Initializing map...');
    this.map = L.map('map').setView([45.245018, 19.837681], 13);

    const customIcon = L.icon({
      iconUrl: 'assets/car.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const hospitalIcon= L.icon({
      iconUrl: 'assets/hospital.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.marker = L.marker([this.companyLocation.latitude, this.companyLocation.longitude], { icon: customIcon }).addTo(this.map);
    
    this.hospitalMarker = L.marker([this.hospitalLocation.latitude, this.hospitalLocation.longitude],{ icon: hospitalIcon }).addTo(this.map);

  }

  updateMarker(lat: number, lng: number): void {
    // Replace 'path/to/custom-marker.png' with the path to your custom image
    const customIcon = L.icon({
      iconUrl: 'assets/car.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  
    this.marker.setIcon(customIcon);
    this.marker.setLatLng([lat, lng]);
  }
  

  initializeMapWithFirstLocation(): void {
    console.log('Initializing map...');
  
    if (this.locations.length > 0) {
      const firstLocation = this.locations[0];
      const customIcon = L.icon({
        iconUrl: 'assets/car.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
  
      this.map = L.map('map').setView([firstLocation.latitude, firstLocation.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      this.marker = L.marker([firstLocation.latitude, firstLocation.longitude], { icon: customIcon }).addTo(this.map);
    } else {
      console.error('No locations available to initialize the map.');
    }
  }

  formatExactDeliveryTime(exactDeliveryTime: number[]): string {
    const date = new Date(exactDeliveryTime[0], exactDeliveryTime[1] - 1, exactDeliveryTime[2]);
    const time = `${exactDeliveryTime[3]}:${exactDeliveryTime[4]}`;
    return this.datePipe.transform(date, 'mediumDate') + ', ' + time;
  }
  isSameDay(): boolean {
    const currentDate = new Date(); 
    const deliveryDate = new Date(this.day[0], this.day[1] - 1, this.day[2], this.day[3], this.day[4]);

    console.log("DELIVERY DATE" + deliveryDate)
    if( currentDate.getFullYear() === deliveryDate.getFullYear() &&
    currentDate.getMonth() === deliveryDate.getMonth() &&
    currentDate.getDate() === deliveryDate.getDate()){
      if (currentDate >= deliveryDate){
        console.log('ZELIM SIMULACIJU')
        return true;
      }
      else{
        console.log('NE NE I NE');
        return false;
      }
    }
    else{
      console.log('NE NE I NE');
      return false;
    }
}
sendStartResponse():void{
  const response  = "Dostava je zapocela,vasa narudzbina ce biti na vasoj adresi uskoro!"
  this.adminService.sendResponse(response).subscribe({next : ()=> {
    console.log("Poslato bato")
  }
})

}
sendEndResponse():void{
  const response  = "Dostava stigla!"
  this.adminService.sendResponse(response).subscribe({next : ()=> {
      console.log("Stiglo bato")
    }
  })
}



  
  
}
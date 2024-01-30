import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Location } from '../model/postion-simulator';
import * as L from 'leaflet';


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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.initializeWebSocketConnection();
    this.initializeMap();
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.marker = L.marker([45.245018, 19.837681], { icon: customIcon }).addTo(this.map);
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
  
}
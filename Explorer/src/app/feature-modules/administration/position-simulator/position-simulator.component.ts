import { Component, OnInit } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-position-simulator',
  templateUrl: './position-simulator.component.html',
  styleUrls: ['./position-simulator.component.css'],
})
export class PositionSimulatorComponent implements OnInit {
  private serverUrl = 'http://localhost:8080/socket';
  private stompClient: any;
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  private adminId: number;
  locations: Location[] = [];
  singlePoint: Location;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //this.authService.user$.subscribe((user) => {
    //if (user) {
    //this.adminId = user.id;
    //}
    //});

    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    // serverUrl je vrednost koju smo definisali u registerStompEndpoints() metodi na serveru
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
      // Pretplata na /socket-publisher putanju
      this.stompClient.subscribe(
        '/socket-publisher',
        (message: { body: string }) => {
          this.handleResult(message);
        }
      );
    }
  }
  /*
  openSimulationSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/" + this.adminId, (message: { body: string; }) => {
        this.handleResult(message);
      });
    }
  }
*/
  handleResult(message: { body: string }) {
    console.log(message);
    if (message.body) {
      let location: Location = JSON.parse(message.body);
      console.log(location);
      this.locations.push(location);
    }
  }
}

/**
 * Created by thanhnt on 11/28/2017.
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {WebSocketService} from './websocket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

const WS_URL = 'ws://13.124.33.173:8080/';

export interface Message {
  exchange: string,
  name: string,
  point_interval: string,
  point_start_time: string,
  point_status: string,
  point_data: string
}

@Injectable()
export class ChartService {
  public messages: Subject<Message>  = new Subject<Message>();
  public data: Subject<string> = new Subject<string>();

  constructor(private wsService: WebSocketService) {

    // 1. subscribe to chatbox
    this.messages   = <Subject<Message>>this.wsService
      .connect(WS_URL)
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return <Message>{
          exchange: data.exchange,
          name: data.name,
          point_interval: data.point_interval,
          point_start_time: data.point_start_time,
          point_status: data.point_status,
          point_data: data.point_data
        }
      });

    // 1. subscribe to chatbox
    this.data = <Subject<string>>this.wsService
      .connect(WS_URL)
      .map((response: MessageEvent) => {
        let data = JSON.parse(response.data);
        return data;
      });
  }
} // end class ChatService

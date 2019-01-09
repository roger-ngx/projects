/**
 * Created by thanhnt on 11/26/2017.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Observer} from "rxjs/Observer";

@Injectable()
export class WebSocketService {
  private subject: Subject<MessageEvent>;
  private subjectData: Subject<string>;

  public connect(url): Subject<MessageEvent> {
    if(this.subject == null){
      this.subject = this.create(url);
    }

    return this.subject;
  }

  private create(url): Subject<MessageEvent>{
      let ws = new WebSocket(url);

      let observable = Observable.create(
        (obs: Observer<MessageEvent>) => {
          ws.onopen = obs.next.bind(obs);
          ws.onmessage = obs.next.bind(obs);
          ws.onerror = obs.error.bind(obs);
          ws.onclose = obs.complete.bind(obs);

          return ws.close.bind(ws);
        }
      )

      let observer = {
        next: (data: Object) => {
          console.log("sending");
            if(ws.readyState == WebSocket.OPEN) {
              ws.send(JSON.stringify(data));
              console.log('sent');
            }
        },
        error: (data: Object) => {
          console.log('error', data);
        },
        complete: (data: Object) => {
          console.log('close', data);
        },
      }

      return Subject.create(observer, observable);
  }

  // For random numbers
  public connectData(url: string): Subject<string> {
    if (!this.subjectData) {
      this.subjectData = this.createData(url);
    }
    return this.subjectData;
  }

  private createData(url: string): Subject<string> {
    let ws = new WebSocket(url);

    let observable = Observable.create(
      (obs: Observer<string>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror   = obs.error.bind(obs);
        ws.onclose   = obs.complete.bind(obs);

        return ws.close.bind(ws);
      });

    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
}

//
//  // Smart Fan Website.
//

// SMART FAN TEMPLATE

import React from 'react';

// USE THIS FOR API
import axios from 'axios';

// import fanSubscriber from '../../subcriptions/fanSubscription';

class SMPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      onCommand: '',
      enter: [],
      exit: [],
      count: '0',
      enterP: false,
      exitP: false,
      led: false
    }


    this.socket = io();

    // Subscription to Temp
    this.socket.on('exampleDataRecieved', (temp) => {
      console.log(temp);
      if (parseFloat(temp) >= parseFloat(this.state.setTemp)){
        this.setState({
          currentTemp: temp,
          status: 'on'
        })
      } else {
        this.setState({
          currentTemp: temp,
          status: 'off'
        })
      }
    });

    this.socket.on('count', (data) => {
      console.log('website sent me data', data)
      this.setState(() => ({
        count: data.count
      }));
    });

    this.socket.on('enter', (data) => {
      console.log('website sent me data', data)
      this.setState(() => ({
        enterP: data.enter
      }));
    });

    this.socket.on('exit', (data) => {
      console.log('website sent me data', data)
      this.setState(() => ({
        exitP: data.exit
      }));
    });

    this.socket.on('led', (data) => {
      console.log('website sent me data', data)
      this.setState(() => ({
        led: data.led
      }));
    });

    // this.socket.emit()
    this.socket.emit('testExample');

    // Fetch all fan data from database
    axios.get('/enter')
    .then((data) => {
       console.log('response ', data);
          this.setState(() => ({
            enter: data.data
          }));
    })


    axios.get('/exit')
    .then((data) => {
       console.log('response ', data);
          this.setState(() => ({
            exit: data.data
          }));
    })
  }

  // Update Database, Post new fan data
  onDBpush = (e) => {
    e.preventDefault();
    this.socket.emit('on', {my: 'data'});
    console.log('html toggle firing');

    // Example of pushing data to the database
    axios.post('/fan', {
      temp: this.state.onCommand,
      status: this.state.onCommand
    });

    // Example of fetching data from database
    axios.get('/fan')
    .then((response) => {
       console.log('response ', response.data);  // This is the data we receive !!
          // Within this example we are actually save the data we recieve to the current state
          this.setState(({
            temps: response.data
          }));
    })
  }

  onTextInput = (e) => {
    const input = e.target.value;
    this.setState(() => ({
        onCommand: input
      }));
  }

  sendCmdToServer = (e) => {
    e.preventDefault();

    this.socket.emit('command', {command: this.state.onCommand});
  }

  // Send Command to begin taking temprature data
  onCommand = (e) => {
    e.preventDefault();
    this.socket.emit('command', {command: this.state.onCommand});
  }

  // Render HTML
  render() {
    return (
      <div>
              <h1>Smart House System</h1>


              <p>count: {this.state.count}</p>
              <p>person entered? : {this.state.enterP === true ? 'true': 'false'} </p>
              <p>person exit? : {this.state.exitP === true ? 'true': 'false'} </p>
              <p>Led on? : { this.state.led === true ? 'true' : 'false' }</p>

              <div>

              <p>Database - Enters</p>

              {
                this.state.enter.map((data) =>
                    <div key={data._id}>
                      <p>_id: {data._id}</p>
                      <p>date: {data.date}</p>
                      <p>count: {data.count}</p>
                      <p>status: {data.status}</p>
                    </div>
                )
              }
              </div>

              <div>
              <p>Database - Exits</p>
              {
                this.state.exit.map((data) =>
                    <div key={data._id}>
                      <p>_id: {data._id}</p>
                      <p>date: {data.date}</p>
                      <p>count: {data.count}</p>
                      <p>status: {data.status}</p>
                    </div>
                )
              }
              </div>
        </div>
    )
  }
}

export default SMPage;
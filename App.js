import base64Convert from './base64';
import React, { Component } from 'react';
import { 
  Platform, 
  View, 
  Text, 
  StyleSheet, 
  TouchableWithoutFeedback 
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default class SensorsComponent extends Component {

  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {
      info: "", 
      values: {},
      service: '0000dfb0-0000-1000-8000-00805f9b34fb',
      characteristic: '0000dfb1-0000-1000-8000-00805f9b34fb',
      device: {},
    };
    this.sensors =  "Bluno";
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info("Scanning...")
      
      if (error) {
        this.error(error.message)
        return
      }

      if (device.name === 'Bluno') {
        this.info("Connecting to TI Sensor")
        this.manager.stopDeviceScan()
        setTimeout(() => {
          device.connect()
          .then((device) => {
            this.setState({device});
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info("Setting notifications")
            return true;
          })
          .then(() => {
            this.info("Listening...")
          }, (error) => {            
            this.error(error.message)
          })
        }, 2000)
      }
    });
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }
  }

  serviceUUID() {
    return '0000dfb0-0000-1000-8000-00805f9b34fb';
  }

  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "ERROR: " + message})
  }

  move = (char) => {
    const {service, characteristic, device} = this.state;
    device.writeCharacteristicWithResponseForService(
        service, characteristic,  base64Convert(char)
      )
  }

  render() {
    const {characteristic} = this.state;
    return (
      <View>
        <Text style={styles.deviceName}>Device name: {this.sensors}</Text>
        <Text style={styles.headreText}>{this.state.info}</Text>
        <View style={styles.container}>
          <View style={styles.moveButtons}>
            <TouchableWithoutFeedback 
              onPressIn={() => this.move('w')}
              onPressOut={() => this.move('x')}
            >
              <View style={styles.button}>
                <Text>Move Forward</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback 
              onPressIn={() => this.move('s')}
              onPressOut={() => this.move('x')}
            >
              <View style={styles.button}>
                <Text>Move Back</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.turnButtons}>
          <TouchableWithoutFeedback 
              onPressIn={() => this.move('a')}
              onPressOut={() => this.move('x')}
            >
              <View style={styles.button}>
                <Text>Move Left</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback 
              onPressIn={() => this.move('d')}
              onPressOut={() => this.move('x')}
            >
              <View style={styles.button}>
                <Text>Move Right</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
  },
  moveButtons: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  turnButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around",
  },
  button: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation:1,
    margin: 10,
  },
  headreText: {
    textAlign: 'center',
    backgroundColor: '#19A37D',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '400',
    padding: 20,
  },
  deviceName: {
    textAlign: 'center',
    backgroundColor: '#dc3545',
    color: '#ffffff',
    padding: 20,
    fontSize: 15,
    fontWeight: '600',
    padding: 20,
  }
});

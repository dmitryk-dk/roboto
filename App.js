import React from 'react';
import { BleManager } from 'react-native-ble-plx';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {

  constructor() {
    super();
    this.manager = new BleManager();
    this.state={
      connected: false,
      device: null,
    }
  }

  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            this.scanAndConnect();
            subscription.remove();
        }
    }, true);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }
        this.setState({device})
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'Bluno') {
            this.setState({connected: true});
            // Stop scanning as it's not necessary if you are scanning for one device.
            this.manager.stopDeviceScan();

            // Proceed with connection.
        }
    });
  }

  render() {
    const { connected } = this.state;
    return (
      <View style={styles.container}>
        {
          connected ? 
          <Text>Connected</Text>:
          <Text>Not connected</Text>
        }
         
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
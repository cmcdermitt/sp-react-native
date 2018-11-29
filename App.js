import React from 'react';
import { Text, View, WebView, StyleSheet } from 'react-native';
import { Location, Permissions, Calendar } from 'expo';
import { Button } from 'react-native-material-ui';

//the code stuff

var currentLocation = getLocationAsync().then(locationSuccessCallback, locationFailureCallback);
var events = getEventsAsync().then(eventSuccessCallback, eventFailureCallback);


function locationSuccessCallback(result) {
  currentLocation = [result.coords.latitude, result.coords.longitude]
  console.log("The location is " + currentLocation);

}

function locationFailureCallback(error) {
  console.log("you done broke location: " + error);
}

function eventSuccessCallback(result) {
  events=result;
  // console.log("The events are " + JSON.stringify(events));
}

function eventFailureCallback(error) {
  console.log("you done broke the events: " + error);
}

async function getLocationAsync() {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    return Location.getCurrentPositionAsync({enableHighAccuracy: true});
  } else {
    throw new Error('Location permission not granted');
  }
}

async function getEventsAsync() {
  const { status } = await Permissions.askAsync(Permissions.CALENDAR);
  if (status === 'granted') {
    var calendars;
    calendars = await(Calendar.getCalendarsAsync());
    var ids = [];
    for (cal in calendars) {
      ids.push(calendars[cal].id)
    }
    //from one hour ago to one day in the future
    time = Date.now();
    return Calendar.getEventsAsync(ids, time - 3.6e6, time + 8.64e+7);
  } else {
    throw new Error('Location permission not granted');
  }
}

//the layout stuff


class Header extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props.event);
    this.state = {
      upcoming: {
        startTime: new Date(1543489200000),
        room: "J152",
        name: "CS 4850"
        // startTime: new Date(props.event.startTime),
        // room: props.event.location,
        // name: props.event.title
      }, 
      dismissed: false
    };
  }

  toggleDismissed() {
    this.setState({dismissed: !this.state.dismissed})};

  render() {
    if (!this.state.dismissed) {
      return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {this.state.upcoming.name} in {this.state.upcoming.room} in {Math.round(Math.abs(this.state.upcoming.startTime - new Date())/1000/60)} minutes
        </Text>
        <Button
          raised
          text="Dismiss"
          onPress={this.toggleDismissed.bind(this)}
        />
      </View>
      );
    } else {
      return null;
    }
  }
}

export default class OwlPathNative extends React.Component {
  render() {
    // console.log("events is: "+ JSON.stringify(events) + "\n\n");
    // console.log("events[0] is: " + JSON.stringify(events[0]));
    return (
      <View style={{flex: 1}}>
        <Header />
        {/* <Header event={events[0]}/>first event in the list for now */}
        <WebView
          source={{uri: 'http://10.128.54.124:3000/'}}
          style={{flex: 1}}
          javaScriptEnabled={true}
          geolocationEnabled={true}       
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: '#ffc425',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: 'black',
    fontSize: 24,
    margin: 10
  },
})


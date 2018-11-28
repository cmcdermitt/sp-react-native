import React from 'react';
import { Text, View, WebView, StyleSheet, Button } from 'react-native';
import { Location, Permissions, Calendar } from 'expo';

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
  console.log("The events are " + JSON.stringify(events));
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
    console.log(props.event);
    this.state = {
      upcoming: {
        startTime: new Date(props.event.startTime),
        room: props.event.location,
        name: props.event.title
      }, 
      dismissed: false
    };
  }

  render() {
    if (new Date(upcoming.startTime) && !dismissed) {
      return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {upcoming.name} in {upcoming.room} in {Math.round(Math.abs(startTime - new Date())/1000/60)}
        </Text>
      </View>
      );
    } else {
      return null;
    }
  }
}

export default class OwlPathNative extends React.Component {
  render() {
    console.log("events is: "+ JSON.stringify(events) + "\n\n");
    console.log("events[0] is: " + JSON.stringify(events[0]));
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
    height: 60,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: 'white',
    fontSize: 25
  }
})


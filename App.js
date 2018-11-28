import React from 'react';
import { Text, View, WebView, StyleSheet } from 'react-native';
import { Location, Permissions, Calendar } from 'expo';

//the code stuff



var currentLocation;

getLocationAsync().then(locationSuccessCallback, locationFailureCallback);

getEventsAsync().then(eventSuccessCallback, eventFailureCallback);

var isUpcoming = true;


function locationSuccessCallback(result) {
  currentLocation = [result.coords.latitude, result.coords.longitude]
  console.log("The location is " + currentLocation);

}

function locationFailureCallback(error) {
  console.log("you done broke location: " + error);
}

function eventSuccessCallback(result) {
  console.log(result)
  console.log("The events are " + JSON.stringify(result));

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
    console.log("ids is " + ids);
    //from one hour ago to one day in the future
    time = Date.now();
    console.log("time is " + time);
    return Calendar.getEventsAsync(ids, time - 3.6e6, time + 8.64e+7);
  } else {
    throw new Error('Location permission not granted');
  }
}

//the layout stuff



function Header(props) {
  if (isUpcoming) {
    return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        Class in J156 in 5 minutes
      </Text>
    </View>
    );
  } else {
    return null;
  }
}

export default class PhoneAppForMobile extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header/>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>
            Class in J201 in 10 minutes
          </Text>
        </View> */}
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


import React from 'react';
import { Text, View, WebView } from 'react-native';

//the code stuff

import { Location, Permissions, Calendar } from 'expo';

var currentLocation;

getLocationAsync().then(locationSuccessCallback, locationFailureCallback);

getEventsAsync().then(eventSuccessCallback, eventFailureCallback);



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
export default class PhoneAppForMobile extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{height: 100, backgroundColor: 'red' }}>
          <Text>
            hi this is an owlpath
          </Text>
        </View>
        <WebView
          source={{uri: 'http://10.128.54.124:3000/'}}
          style={{marginTop: 20, flex: 1}}
          javaScriptEnabled={true}
          geolocationEnabled={true}       />
      </View>
    );
  }
}


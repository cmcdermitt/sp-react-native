import React from 'react';
import { Text, View, WebView, StyleSheet, SectionList } from 'react-native';
import { Location, Permissions, Calendar } from 'expo';
import { Button, Drawer, ListItem } from 'react-native-material-ui';

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

function eventListObj(props) {
  this.props.events.map((item) => {
  return (
    <ListItem
    divider
    leftElement = {item.title}
    centerElement = {item.location}
    rightElement = {new Date(item.startDate).toLocaleTimeString()}
    numberOfLines = {'dynamic'}
    key = {key}
  />);
  });
}

class Schedule extends React.Component {
  constructor (props) {
    super(props);
  }
  
  render () {
    return (
      <View>
        <Text> My Classes </Text>
        <SectionList>
          <eventListObj events={this.props.events} />
        </SectionList>
      </View>
    );
  }
}


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
    this.setState({dismissed: !this.state.dismissed})
  }

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
  
  toggleIsOpened() {
    this.setState({isOpened: !this.state.isOpened});
  }

  render() {
    // console.log("events is: "+ JSON.stringify(events) + "\n\n");
    // console.log("events[0] is: " + JSON.stringify(events[0]));
    if (scheduleOpen) {return (
      <View style={{flex: 1}}>
        <Header />
        <Schedule
          events = {
            {
              title: "CS 2408",
              location: "J201",
              startDate: new Date()
            },
            {
              title: "CS 4102",
              location: "J212",
              startDate: new Date()
            },
            {
              title: "CS 2132",
              location: "J129",
              startDate: new Date()
            }
          }
          style={styles.schedule}
        />
      </View>
    );} else { return (
      <View style={{flex: 1}}>
        <Header />
        <WebView
          source={{uri: 'http://10.128.54.124:3000/'}}
          style={{flex: 1}}
          javaScriptEnabled={true}
          geolocationEnabled={true}       
        />
      </View>
    );}
  }

  constructor (props) {
    super(props);
    this.state = {
      scheduleOpen: false
    };
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
  schedule: {
    flex: 1,
    //backgroundColor = primary
  }
})


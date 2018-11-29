import React from 'react';
import { Text, View, WebView, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { Location, Permissions, Calendar } from 'expo';
import { Button, Drawer, ListItem, ActionButton, ThemeContext, getTheme, COLOR } from 'react-native-material-ui';

//set theme for react-native-material-ui elements
const uiTheme = {
  palette: {
    primaryColor: COLOR.indigo500,
    accentColor: COLOR.pinkA400,
  }
};

//the code stuff

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
  constructor (props){
    super(props);
    this.state = {
      isOpen: true
    }
  } 

  toggleIsOpen() {
    this.setState({isOpen: !this.state.isOpen});
  }

  render () {
    if (!isOpen) {
      console.log('rendering ActionButton');
      return (
        <View style={backgroundColor='rgba(255, 255, 255, 0.0)'}>
          <ActionButton
            onPress = {this.toggleIsOpen.bind(this)}
          />
        </View>
      )

    } else { //if isOpen
      console.log('rendering schedule');
      return (
        <View style={{flex: 1, backgroundColor:'orange'}}>
          <Text> My Classes </Text>
          {console.log(JSON.stringify(eventListObj))}
          <FlatList>
            <eventListObj events={this.props.events} />
          </FlatList>
          <Button
            raised
            accent
            text="Close"
            onPress={toggleScheduleOpen.bind(this)}
          />
        </View>
      );
    }
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upcoming: null,
      dismissed: false
    };
  }
 
  componentDidMount() {
    if (this.props.events) {
      //set upcoming event
      minRemaining = 60; //start with 60 minutes as minimum remaining time because we don't care about anything shorter
      soonestEvent = null
      for (event in this.props.events) {
        remaining = Math.round((new Date(this.props.events[event].startDate).getTime() - Date.now())/1000/60);
        if (remaining < minRemaining) {
          minRemaining = remaining;
          soonestEvent = this.props.events[event]
        }
        if (remaining < 60) { //if there is actually something coming up soon
          this.setState({upcoming: soonestEvent});
        } else {
          this.setState({upcoming: null});
        }
      }
    } else {
      this.setState({upcoming: null});
    }
   
  }
 
  toggleDismissed() {
    this.setState({dismissed: !this.state.dismissed})
  }
 
  render() {
    if (!this.state.dismissed && this.state.upcoming) {
      return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {this.state.upcoming.title} in {this.state.upcoming.location} in {Math.round((new Date(this.state.upcoming.startDate).getTime() - Date.now())/1000/60)} minutes
        </Text>
        <Button
          raised
          primary
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
  
  constructor (props) {
    super(props);
    this.state = {
      location: null,
      events: null
    }
  }

  

  async componentDidMount() {
    loc = await this.getLocationAsync();
    console.log('got location: ' + JSON.stringify(loc));
    ev = await this.getEventsAsync();
    console.log('setting state, got events: ' + JSON.stringify(ev))
    this.setState({location: [loc.coords.latitude, loc.coords.longitude]});
    this.setState({events: ev});
  }

  
  async getLocationAsync() {
    const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
    if (status === 'granted') {
      console.log('sending location request');
      return Expo.Location.getCurrentPositionAsync({enableHighAccuracy: true});
    } else {
      throw new Error('Location permission not granted');
    }
  }
 
  async getEventsAsync() {
    const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);
    if (status === 'granted') {
      var calendars;
      calendars = await(Expo.Calendar.getCalendarsAsync());
      console.log('got calendars')
      var ids = [];
      for (cal in calendars) {
        ids.push(calendars[cal].id)
      }
      //from one hour ago to one day in the future
      time = Date.now();
      console.log('sending event request')
      return Expo.Calendar.getEventsAsync(ids, time - 3.6e6, time + 6.048e8);
    } else {
      throw new Error('Location permission not granted');
    }
  }

  render() {
    if(!(this.state.events && this.state.location)) {
      // if (!this.state.location) {
        console.log('rendering load screen');
        return (
          <ThemeContext.Provider value={getTheme(uiTheme)}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: uiTheme.palette.primaryColor}}>
              <Text style={{fontSize: 24}}>
                OwlPath
              </Text>
              <Image
                style={{margin: 20, width: Dimensions.get('window').width * .9}}
                resizeMode="contain"
                source={require('./assets/logo.png')}
              />
              <Text style={{fontSize: 24}}>
                Loading . . .
              </Text>
            </View>
          </ThemeContext.Provider>
        )
      // if done loading
      } else {
        console.log('rendering webview');
        return (
          <ThemeContext.Provider value={getTheme(uiTheme)}>
          <View style={{flex: 1}}>
            {/* <Header events = {this.props.events.filter(event => new Date(event.startDate).getTime() - Date.now() < 6.048e8)}/> */}
            <Header events = {this.state.events} />
            <WebView
              source={{uri: 'http://10.100.81.150:3000/'}}
              style={{flex: 1}}
              javaScriptEnabled={true}
              geolocationEnabled={true}
            />
            <Schedule
                events = {this.state.events}
                style={styles.schedule}
            />
          </View>
          </ThemeContext.Provider>
          );
        }
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


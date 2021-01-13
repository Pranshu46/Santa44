import React , {Component} from 'react';
import { Animated, 
       Dimensions,
        StyleSheet,
        Text,
        TouchableHighlight,
        View 
    } from 'react-native';

    import {ListItem, Icon } from 'react-native-elements';

    import { SwipeListView } from 'react-native-swipe-list-view';

    import db from '../config';

    export default class SwipeableFlatlist extends Component{
        constructor(props) {
            super(props);
            this.state = {
                allNotification : this.props.allNotification,
            };
        }


        updateMarkAsread = (notification)=>{
            db.collection("all_notification").doc(notification.doc_id).update({
                "notification_status" : "read"
            })
        }

        onSwipeValueChange = swipeData => {
            var allNotification = this.state.allNotification
            const {key, value} = swipeData;

            if (value < -Dimensions.get('window').width){
                const newData = [...allNotification];
                const prevIndex = allNotification.findIndex(item => item.key === key);
                this.updateMarkAsread(allNotification[prevIndex]);
                newData.splice(prevIndex, 1);
                this.setState({allNotification: newData})
            };
        };
    renderItem = data => (
        <Animated.View>
            <ListItem
            leftElement={<Icon name="book" type="font-awsome" color ='#696969'/>}
            title={data.item.book_name}
            titleStyle={{ color:'black' , fontWeight: 'bold' }}
            subtitle={data.item.message}
            bottomDivider
            />
        </Animated.View>
    );

    renderHiddenItem = () => (
        <View style={StyleSheet.rowBack}>
            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}></Text>
            </View>
        </View>
    );

    render(){
        return(
            <View style={styles.containr}>
                <SwipeListView
                disableRightSwipe
                data = {this.state.allNotification}
                renderItem = {this.renderItem}
                renderHiddenItem = {this.renderHiddenItem}
                rightOpenValue={-Dimension.get('window').width}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onSwipeValueChange={this.onSwipeValueChange}
                />
            </View>
        )
    }

    }

    const styles = StyleSheet.create({
        container : {
            backgroundColor: 'white',flex: 1,
        },
        backTextWhite: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize:15
        },
        rowBack: {
            alignItems: 'center',
            backgroundColor: '#29b6f6',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 15,
        },
        backRightBtn: {
            alignItems: 'center',
            bottom: 0,
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            width: 100,
        },
        backRightBtn: {
            backgroundColor: '#29b6f6',
            right: 0,

        },
    });
import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Alert } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {BookSearch} from 'react-native-google-books';


export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      IsBookRequestActive: "",
      requestedBookName:"",
      bookStatus:"",
      requestId:"",
      userDocId:'',
      docId:'',
      ImageLink: '',
      dataSource: "",
      showFlatlist: false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "book_status"  :  "requested" ,
        "date"         : firebase.firestore.FieldVValue.serverTimestamp(),
        "image_link"   : books.data[0].volumInfo.imageLinks.smallThumbnail
    })
    await this.getBookRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{db.collection('users').doc(doc.id).update({
      IsBookRequestActive: true
    })
  })

    this.setState({
        bookName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })

    return Alert.alert("Book Requested Successfully")
  }

  recievedBooks=(bookName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('recieved_books').add({
      "user_id" : userId,
      "book_name" : bookName,
      "request_id": requestId,
      "bookStatus": "recieved"
    })
  }

  getIsBookRequestActive(){
    db.collection('users')
    .where(email_id,'==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsBookRequestActive:doc.data().IsBookRequestActive,
          userDocId:doc.id
        })
      })
    }) 
  }

getBookRequest = ()=>{
  var bookRequest = db.collection('requested_books')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot) =>{
    snapshot.forEach((doc)=>{
      if(doc.data().book_status !== "recieved"){
        this.setState({
          request_id: doc.data().requestId,
          requestedBookName: doc.data().book_status,
          docId : doc.id
        })
      }
    })
  })}  

 sendNotificaton =()=>{
   db.collection('users').where('email_id','==',this.state.userId).get()
   .then((snapshot)=>{
     snapshot.forEach((doc)=>{
       var name = doc.data().first_name
       var lastname = doc.data().last_name


       db.collection('all_notifications').add({
        "targeted_user_id" : donorId,
        "message" : name +" " + lastName + " received the book " + bookName ,
        "notification_status" : "unread",
        "book_name" : bookName
     })
    })
  })
 }

 componentDidMount(){
   this.getBookRequest()
   this.getIsBookRequestActive()
 }

updateBookRequestStatus=()=>{
  db.collection('requested_books').doc(this.state.userId).get()
.update({
  book_status: recieved
}) 
 db.collection('users').where('email_id','==',this.state.userId).get()
 then((snapshot)=>{
   snapshot.forWach((doc)=>{
     db.collection('users').doc(doc.id).update({
       IsBookRequestActive: false
     })
   })
 })
}

async getBookFromApi (bookName){
  this.setState({bookName:bookName})
  if (bookName.length >2){
    varbooks = await BookSearch.searchbook{bookName,'AIzaSyAZzC-oDzIoPgF_ckXmqbSiMWBXpqrnTSI  '}
    this.setState({
      dataSource:bookName.data,
      showFlatlist:true
    })
  }
}

renderItem = ( {item, i} ) => {
  console.log("image link");

  let obj ={
    title:item.volumeInfo.title,
    selfLink: item.selfLink,
    buyLink: item.saleInfo.buyLink,
    imageLink: item.vilumeInfo.imageLinks
  }

  return(
    <TouchableHighlight
    style={{ alignItems: "center" , backgroundColor: '#DDDDDD', padding: 10, 
  width: '90%'}}

  activeOpacity={0.6}
  underlayColor="#DDDDDD"
  onPress={()=>{
    this.setState({
      showFlatlist:false,
      bookName:item.volumeInfo.title,
    })}
  }
  bottomDivider 
  >
    <Text> {item.volumeInfo.title}</Text>
  </TouchableHighlight>
  )
}

  render(){
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book"/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)

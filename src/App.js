import React, { useState, useEffect } from "react";
import $, { data } from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { baseUrl, checkAuth, clearCookies, getCookie, setCookie, SOCKET } from './myJs';
import { v4 as uuidv4 } from 'uuid';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import Logo from './component/Logo';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import useToggle from './myJs';
import { useHistory } from "react-router-dom";
import { addDefaultSrc, returnDefaultImage, removeDublicateFrd } from "./myJs";
import { Socket } from "socket.io-client";
import moment from 'moment'

const override = css`
  display: block;
  margin: 10px auto;
  border-radius: 50px !important;
  width: 95%;
`;

// localStorage.setItem("session_id", "VJZgDUeyMnJU0BpjPT7uvGl4ByTYwe75")
// setCookie("session_id", "AN9Gjrtdt2324st38Qntr2IrhAWvUAdD", 1)
// setCookie("user_id", 27, 1)
// app id: bd7c4ac2265f496dbaa84d9837960c78
// app secret: 40082f25ff2a4b88ac1358f7e863cba6
// channel: test
// token: 006bd7c4ac2265f496dbaa84d9837960c78IAAq1GZbv3moec3u6pFg67UZMEm0pzTuHT21ki9gqV9EXQx+f9gAAAAAEAAH/YchlRMJYAEAAQCYEwlg

let messageList = [], receiver_id, userData, searchName = "",
    searchPage = 1, myFriendList = [], friendId = null, onlineInterval, futureCall = false;

const scrollToBottom = () => {
    var div = document.getElementById('chat-body');
    if (!!div)
        div.scroll({ top: div.scrollHeight, behavior: 'smooth' });
}

var frdMesageStatus = {
    friend_id: "",
    online: { read: false, unread: false, reciever_id: "" },
    offline: false
};

const ChatBox = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const is_auth = checkAuth();
    // window.setTimeout()
    const [Likes, setLikes] = useState([]);
    const [Visitors, setVisitors] = useState([]);
    const [FriendList, setFriendlist] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [FriendUserId, setFriendId] = useState(null);
    const [AllData, setData] = useState('');
    const [CompleteMessageList, setMessages] = useState([]);
    const [UserMessage, setuserMessage] = useState('');
    const [randomNumber, setRandomNumber] = useState('');
    const [isOn, toggleIsOn] = useToggle();
    const [GiftData, setGiftData] = useState([]);

    let [loading, setLoading] = useState(false);
    let [logoutLoading, setLogoutLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [dummyMediaRc, setDummyMediaRc] = useState(null)
    const [chatTyping, setChatTyping] = useState("")
    const [is_show_Emoji, setIs_show_Emoji] = useState(false)
    const [searchUser, setSearchUser] = useState("")
    const [searchUserForm, setSearchUserForm] = useState("")
    const [userInterval, setUserInterval] = useState(0)
    const [isAcknowledge, setIsAcknowledge] = useState(true)
    const [frds_acknowledged, setFrds_acknowledged] = useState(0)
    const [chatLists, setChatLists] = useState([]);
    const [futureCall, setFutureCall] = useState(true)
    const createNotificationCustom = (type) => {

        switch (type) {
            case 'success':
                NotificationManager.success('Send successfull', 'Gift');
                break;
            case 'error':
                NotificationManager.error('Please recharge and try again', 'Insufficient Balance!', 5000, () => {
                });
                break;
        };
    };

    // console.log(UserMessage);
    const [GetActivity, setActivity] = useState(0);

    // userData = useSelector(userProfile).user.profile; //using redux useSelector here
    userData = { user_id: getCookie("user_id"), first_name: getCookie("f_name"), last_name: getCookie("l_name") }

    const sessionId = getCookie("session_id");


    const updateFriendDetails = (details) => {
        friendId = details.id;
        setFriendId(details.id)
        setData(details);

    }
    // Fetching details of user initial time
    const getAllDetails = async (name, page, scroll) => {
        // const likes = await axios.post(LIKED_LIST,bodyParameters)
        // setLikes(likes.data.data);

        // Destructing response and getting data part
        // const visitor = await axios.post(VISITOR_LIST_API,bodyParameters)
        // setVisitors(visitor.data.result);
        const bodyParameters = {
            session_id: getCookie("session_id"),
            name
        };

        const friend = await axios.post(baseUrl() + "/fake-user?page=" + page, bodyParameters)
        if (!!friend.data.users) {
            let data = friend.data.users.data;
            if (scroll) {
                data = [...myFriendList, ...data]
            }
            myFriendList = data;
            setFriendlist(data);
            setChatLists(data)
        }
    }

    // Onclick button, getting LIkes, Visitor and friends list

    const getLikes = async () => {  //Likes here
        // setActivity(0);
        // const { data: {data} } = await axios.post(LIKED_LIST,bodyParameters)
        // setLikes(data);
    }

    const getVisitors = async () => {  // Visitors here
        // setActivity(1);
        // const { data: {result} } = await axios.post(VISITOR_LIST_API,bodyParameters)
        // setVisitors(result);

    }

    const getFriend = async () => { //Friends here
        // setActivity(2);
        // const {data:{data}}= await axios.post(FRIENDLIST_API,bodyParameters)
        // setFriendlist(!!data ? data : []);
    }

    // fetching friends according to userID
    const getFriendDetails = async () => {
        // const bodyParameters = {
        //     session_id: localStorage.getItem('session_id'),
        //     user_id: FriendUserId,
        // };

        // const {data:{data}}= await axios.post(GET_USERPROFILE_API,bodyParameters)
        // setData(data);
    }


    const AcceptUserRequest = (LikedUserId) => {
        // const bodyParameters = {
        //     session_id : sessionId,
        //     id : LikedUserId
        // }
        // axios.post(ACCEPT_REQUEST_API , bodyParameters)
        //     .then((response) => {
        //         if(response.status==200)
        //         {
        //             createNotification('accept');
        //         }
        //     }, (error) => {
        //     });

    }

    //all gift
    const handleGift = async () => {
        // toggleIsOn(true);
        // const bodyParameters = {
        //     session_id :  localStorage.getItem('session_id'),
        //     }
        //     const {data:{result}} = await axios.post(GIFT_LIST_API , bodyParameters)
        //     setGiftData(result);
    }

    //get single  gift item
    const getGiftItem = async (giftId) => {
        //    const bodyParameters ={
        //    session_id :  localStorage.getItem('session_id') ,
        //    gift_id : giftId ,
        //    given_to : FriendUserId
        //    }
        //     const {data : {giftStatus}} = await axios.post(GIFT_PURCHASE_API , bodyParameters)
        //         // alert(giftStatus.get_gifts.image);

        //         if(!!giftStatus)
        //         {
        //         toggleIsOn(false);
        //         var msg = {};
        //         msg.file = giftStatus.get_gifts.image;
        //         msg.fileName = "abc_image";
        //         msg.sessionId = sessionId;
        //         msg.reciever_id = receiver_id;
        //         SOCKET.emit('gift_send', msg);
        //         setLoading(true);
        //         }
        //         else
        //         {
        //             toggleIsOn(false);
        //             createNotificationCustom('error');

        //         }
    }
    /************************************* Working here socket *******************************************************/

    function readThenSendFile(data) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var msg = {};
            msg.file = evt.target.result;
            msg.fileName = data.name;
            msg.sessionId = sessionId;
            msg.reciever_id = receiver_id;
            msg.is_fake = true;
            SOCKET.emit('media_file', msg);
            setLoading(true);
        };
        reader.readAsDataURL(data);
    }


    const clearData = () => {
        SOCKET.emit('is_user_active', { user_id: Number(getCookie("user_id")), is_online: 0, is_fake: true });
        clearCookies();
        SOCKET.disconnect();
    }

    // Authenicating user here
    const DetermineUser = () => {
 
        var secondUserDataId = FriendUserId;
        SOCKET.emit('authenticate', {
            "session_id": sessionId,
            "reciever_id": secondUserDataId,
            socket_id: getCookie("socket_id")

        });
        console.log( {"session_id": sessionId,
        "reciever_id": secondUserDataId,
        socket_id: getCookie("socket_id")},"wvswdwhd")

        SOCKET.emit('is_user_active', {
            "user_id": userData.user_id,
            is_online: 1
        });

        let do_I_have_blocked_my_frd = {
            sender_id: userData.user_id,
            reciever_id: secondUserDataId,
        }
        SOCKET.emit('do_I_have_blocked_my_frd', do_I_have_blocked_my_frd)
        let do_frd_have_blocked_me = {
            sender_id: secondUserDataId,
            reciever_id: userData.user_id,
            toMe: true
        }
        SOCKET.emit('do_frd_have_blocked_me', do_frd_have_blocked_me)
    }
    const getCurrentDateTime = () => {
        return moment().format('L') + " " + moment().format('LT')
    }

    const checkReadStatus = (list) => {
        var secondUserDataId = this.props.navigation.getParam('userInfo');
        // console.log("listen list",this.props.userData.id,this.props.userData.first_name, list, secondUserDataId, "second")
        if (list.friend_id == secondUserDataId) {
            if (list.offline) {
                list.online.read = false;
                list.online.unread = false;
                list.online.reciever_id = "";
            }
            else {
                list.online.read = list.online.reciever_id == this.props.userData.id ? true : false;
                list.online.unread = list.online.reciever_id == this.props.userData.id ? false : true;
            }
            frdMesageStatus = list;
            //  console.log(frdMesageStatus, "frdMesageStatus.......")
            let apiData = this.state.completeMessageList;
            if (list.online.read) {
                for (let i in apiData) {
                    if (!apiData[i].message_is_read) {
                        apiData[i].message_is_read = 1
                        apiData[i].message_is_sent = 0
                        apiData[i].message_is_not_seen = 0
                    }
                }
            }
            if (list.online.unread) {
                for (let i in apiData) {
                    if (apiData[i].message_is_sent) {
                        apiData[i].message_is_read = 0
                        apiData[i].message_is_sent = 0
                        apiData[i].message_is_not_seen = 1
                    }
                }
            }
            // if (list.offline) {
            //     this.setState({is_online:false})
            // }     
            // else {
            //     this.setState({is_online:true})
            // }

            //console.log(apiData, "new apidata....")
            this.setState({ completeMessageList: apiData })
            // this.setState({ counter: Math.random() })
            // this.forceUpdate()

            //}
        }

    }

    // Socket Methods
    const CheckTextInputIsEmptyOrNot = (e) => {
        e.preventDefault()
        if (UserMessage != '') {
            var secondUserDataId = FriendUserId;

            var message = {
                "session_id": sessionId,
                "reciever_id": secondUserDataId,
                "message": UserMessage,
                // "sender_name": this.props.userData.first_name + " " + this.props.userData.last_name,
                "sender_name": userData.first_name,
                device_token: null,
                created_at: getCurrentDateTime(),
                frds_acknowledged: !!frds_acknowledged ? 1 : 0,

                message_id: uuidv4(),
                messageStatus: frdMesageStatus,
                sender_id: userData.user_id



            }
            SOCKET.emit("send_message", message);
            setuserMessage(''); //Empty user input heresend
            setIs_show_Emoji(false);
        } else {
        }
    }
    // Get all messages here
    const GetAllMessages = (messages) => {

    }

    useEffect(() => {
        scrollToBottom();
    }, [randomNumber])
    // console.log(FriendUserId);

    const verifyFakeUser = async () => {
        const bodyParameters = {
            session_id: getCookie("session_id"),
            user_id: Number(getCookie("user_id"))
        }
        try {
            const loginUser = await axios.post(baseUrl() + "/getSingleUserDetail", bodyParameters)
            if (loginUser.data.status === 200 && loginUser.data.success) {
                if (loginUser.data.userData.is_fake !== 2) {
                    clearData();
                    history.push("/login")
                }
                else {
                    SOCKET.emit('is_user_active', { user_id: Number(getCookie("user_id")), is_online: 1, is_fake: true });
                }
            }
            else {
                clearData();
                history.push("/login")
            }
        }
        catch (err) {
            clearData();
            history.push("/login")
        }
    }

    const makeMeFrd = async () => {
        const bodyParameters = {
            session_id: getCookie("session_id"),
            user_id: friendId
        }
        const makeMyFrd = await axios.post(baseUrl() + "/chatUser", bodyParameters)
    }
    useEffect(() => {
        SOCKET.connect()
        SOCKET.on('connect', function (socket) {
            setCookie("socket_id", SOCKET.id, 1);
            console.log(SOCKET, "bdwjhdbe")
            SOCKET.emit('establish_socket_connection', { "u_id": getCookie("user_id"), socket_id: SOCKET.id });
        });
        document.title = "Mosh | Chat";
    }, [])
    useEffect(() => {
        verifyFakeUser();
        // realTimeActiveUser();
        $('#chat').on('scroll', function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                const nextPage = searchPage + 1;
                searchPage = nextPage
                getAllDetails(searchName, nextPage, true)
            }
        })

        window.setTimeout(() => {
            $('#uploadfile').bind('change', function (e) {
                var data = e.originalEvent.target.files[0];
                const fileName = data.name.split(".");
                const imageFormat = fileName[fileName.length - 1];
                if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" ||
                    imageFormat === "PNG" || imageFormat === "JPG" || imageFormat === "JPEG") {
                    readThenSendFile(data);
                }
                else {
                    alert("Only .png, .jpg, .jpeg image formats supported.")
                }
            })
        }, 2000);

        // getAllDetails("", 1);
        SOCKET.off('getMessage').on('getMessage', (messages) => { // only one time
            setLoading(false);
            alert(23)
            setMessages(messages.message_list);
            messageList = messages.message_list;
            if (messageList.length === 0) {
                makeMeFrd()
            }
        });
        // Checking the typing user
        SOCKET.off('typing').on('typing', (typing) => {
            if (!!typing) {
                if ((typing.user_id == userData.user_id && typing.reciever_id == receiver_id)
                    ||
                    (typing.user_id == receiver_id && typing.reciever_id == userData.user_id)
                ) { // check one-to-one data sync

                    if (typing.user_id !== userData.user_id) {
                        setChatTyping(typing.typing_user)
                        window.setTimeout(() => {
                            setChatTyping("")
                        }, 1500)
                    }
                }
            }
        })

        SOCKET.off('message_data').on('message_data', (messages) => {
            if (!!messages) {
                if ((!messages.obj.is_acknowledge && (userData.user_id == messages.obj.user_to_id)) || messages.obj.is_acknowledge) {
                    let messagesList = messageList;

                    // this.setState({ completeMessageList: [...this.state.completeMessageList,messages.obj ]})
                    // this.setState({ userMessage: '' })
                    if ((messages.obj.user_from_id == userData.user_id && messages.obj.user_to_id == receiver_id)
                        ||
                        (messages.obj.user_from_id == receiver_id && messages.obj.user_to_id == userData.user_id)) {
                        messagesList.push(messages.obj);
                        messageList = messagesList;
                        setMessages(messagesList);
                        setRandomNumber(Math.random());
                        scrollToBottom()

                        setFrds_acknowledged(messages.obj.frds_acknowledged)
                        // if(this.state.completeMessageList.length==1){
                        //     this.AddUserTochatList()
                        // }
                    }
                }
                else {
                    if (userData.user_id == messages.obj.user_from_id) {
                        alert("Your friend has not acknowledged your Message ,Please wait for response")
                    }

                }

            }

        });

        SOCKET.off('media_file').on('media_file', (messages) => {

            let messagesList = messageList;
            if (!!messages) {

                if (((messages.obj.user_from_id == userData.user_id && messages.obj.user_to_id == receiver_id)
                    ||
                    (messages.obj.user_from_id == receiver_id && messages.obj.user_to_id == userData.user_id))
                    && messages.obj.is_acknowledge
                ) {
                    setIsAcknowledge(true)
                    messagesList.push(messages.obj);
                    messageList = messagesList;

                    setMessages(messagesList);
                    setuserMessage(''); //Empty user input here
                    setLoading(false);
                    setRandomNumber(Math.random());
                    scrollToBottom()
                }
                else {
                    setIsAcknowledge(false)
                }
            }
        });

        SOCKET.off('gift_send').on('gift_send', (messages) => {

            let messagesList = messageList;
            if (!!messages) {
                if (((messages.obj.user_from_id == userData.user_id && messages.obj.user_to_id == receiver_id)
                    ||
                    (messages.obj.user_from_id == receiver_id && messages.obj.user_to_id == userData.user_id))
                    && messages.obj.is_acknowledge
                ) {
                    setIsAcknowledge(true);
                    messagesList.push(messages.obj);
                    messageList = messagesList;

                    setMessages(messagesList);
                    setLoading(false);
                    setRandomNumber(Math.random());
                    scrollToBottom();
                }
                else {
                    setIsAcknowledge(false)
                }
            }
        });

        SOCKET.off('voice').on('voice', function (arrayBuffer) {
            let messagesList = messageList;

            if (!!arrayBuffer) {
                if ((!arrayBuffer.obj.is_acknowledge && (userData.user_id == arrayBuffer.obj.user_to_id)) || arrayBuffer.obj.is_acknowledge) {

                    if ((arrayBuffer.obj.user_from_id == userData.user_id && arrayBuffer.obj.user_to_id == receiver_id)
                        ||
                        (arrayBuffer.obj.user_from_id == receiver_id && arrayBuffer.obj.user_to_id == userData.user_id)) {
                        messagesList.push(arrayBuffer.obj);
                        messageList = messagesList;

                        setMessages(messagesList);
                        setuserMessage(''); //Empty user input here
                        setRandomNumber(Math.random());
                        scrollToBottom()

                        setFrds_acknowledged(arrayBuffer.obj.frds_acknowledged)

                    }
                }
                else {
                    if (userData.user_id == arrayBuffer.obj.user_from_id) {
                        alert("Your friend has not acknowledged your Message ,Please wait for response")
                    }
                    //showError("Your friend has not acknowledged your Message ,Please wait for response")
                }

            }

        });

        //     SOCKET.off('realtime_active_users').on('realtime_active_users', (data) => {
        //         if(data.user_id == Number(getCookie("user_id")) ){
        //          const apiData= myFriendList;
        //          const socketData = data.list;
        //         for (let i in apiData) {
        //          apiData[i].is_online = false
        //             for (let j in socketData) {

        //                 if (apiData[i].id == socketData[j].id) {
        //                     apiData[i].is_online = true
        //                 }
        //             }
        //          }
        //          myFriendList = apiData;
        //          setFriendlist(myFriendList);
        //          setUserInterval(Math.random())
        //   }
        // })
        // SOCKET.on('get_unread_frd_messages', (unreadData) => {
        //     console.log(unreadData , "unreadData..")
        //     let total_unread_frds = 0;

        //     if (unreadData.user_id == userData.user_id) {
        //       console.log("calling............." + userData.user_id)
        //       console.log(unreadData.unreadMessagesList , "unreadlist..")
        //       let chatList = chatLists;
        //       let unreadList = unreadData.unreadMessagesList;

        //       for (let i in unreadList) {
        //         total_unread_frds += unreadList[i].counts > 0 ? 1 : 0;
        //         for (let j in chatList) {
        //           if (unreadList[i].friend_id == chatList[j].id) {
        //             unreadList[i].device_token = chatList[j].device_token;
        //             chatList.splice(j, 1)
        //           }
        //         }
        //       }
        //       for (let k in chatList) {
        //         chatList[k].counts = 0
        //       }


        //       chatList = [...unreadList, ...chatList];

        //     setChatLists(chatList)
        //         console.log("futurecall..",chatList)
        //         if (futureCall) {
        //         SOCKET.emit('get_unread_frd_messages', {
        //           user_id: userData.user_id,
        //           future_calls: true
        //         });
        //       }
        //     }

        //   })

        // console.log(userData.user_id , "userData.user_id")
        // SOCKET.emit('get_unread_frd_messages', { 
        //     user_id: userData.user_id,
        //     future_calls: true
        //      });

        SOCKET.off('check_frds_are_acknowledged').on('check_frds_are_acknowledged', (data) => {
            if (data.sender_id == userData.user_id) {
                setFrds_acknowledged(data.frds_acknowledged)
            }
        })

        //     SOCKET.off('get_unread_frd_messages').on('get_unread_frd_messages', (unreadData) => {
        //         let total_unread_frds = 0;
        //        // let call_future = store.getState().auth.futureCall
        //         if (unreadData.user_id == userData.user_id) {
        //           console.log("calling............." + userData.user_id)
        //           let chatList = myFriendList;
        //           let unreadList = unreadData.unreadMessagesList;
        //           for (let i in unreadList) {
        //             total_unread_frds += unreadList[i].counts > 0 ? 1 : 0;
        //             unreadList[i].user_id == unreadList[i].friend_id
        //             for (let j in chatList) {
        //               if (unreadList[i].friend_id == chatList[j].user_id) {
        //                 unreadList[i].device_token = chatList[j].device_token;
        //                 chatList.splice(j, 1)
        //                 console.log("calling........sass.....",+futureCall)
        //                 // if (unreadList[i].to_is_blocked || unreadList[i].profile_disabled) {
        //                 //     unreadList.splice(i, 1)
        //                 // }
        //               }
        //             }
        //           }
        //           for (let k in chatList) {
        //             chatList[k].counts = 0
        //           }
        //  // console.log(unreadList,"fdfdhfgdhfhddhfhghd")
        // chatlist =    [...unreadList, ...chatList]
        //           chatList = removeDublicateFrd(chatlist);

        //           const frdsOnlineStatus = unreadData.frdsOnlineStatus;
        //          // console.log(frdsOnlineStatus, chatlist, "frdsOnlineStatus..")
        //           for (let h in frdsOnlineStatus) {
        //               for (let r in chatlist) {
        //                 if (frdsOnlineStatus[h].user_id == chatlist[r].user_id) {
        //                     chatlist[r].online = frdsOnlineStatus[h].online
        //                 }
        //               }
        //           }

        //             myFriendList = chatList;
        //             setFriendlist(chatList)
        //             if (futureCall) {
        //             SOCKET.emit('get_unread_frd_messages', {
        //               user_id: userData.user_id,
        //               future_calls: true
        //             });
        //           }
        //         }
        //       })



        return () => { clearInterval(onlineInterval) }
    }, [])

    // On text typing value
    const changeInput = (e) => {
        setuserMessage(e.target.value)
        SOCKET.emit("typing", {
            user_id: userData.user_id,
            typing_user: userData.first_name + " " + userData.last_name,
            reciever_id: receiver_id,
            frds_acknowledged: !!frds_acknowledged ? 1 : 0

        })
    }

    useEffect(() => {
        setMessages([]);
        messageList = [];
        // getFriendDetails();

        if (!!FriendUserId) {
            receiver_id = FriendUserId;
            DetermineUser();
            setLoading(true);
            //  GetAllMessages();
            //  OnReceivedMessage();
            var data = {
                sender_id: userData.user_id,
                reciever_id: FriendUserId
            }
            SOCKET.emit('check_frds_are_acknowledged', data)

        }
        // get messagesfrom socket...

    }, [FriendUserId])

    var blobToBase64 = function (blob, callback) {
        var reader = new FileReader();
        reader.onload = function () {
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            return callback(base64);
        };
        reader.readAsDataURL(blob);
    };

    const sendVoiceNote = () => {

        if (!dummyMediaRc) {
            var constraints = { audio: true };
            let recordAudio = false;
            if (!!navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
                    recordAudio = true;
                    var mediaRecorder = new MediaRecorder(mediaStream);

                    mediaRecorder.onstart = function (e) {
                        setDummyMediaRc(mediaRecorder);
                        this.chunks = [];
                    };
                    mediaRecorder.ondataavailable = function (e) {
                        this.chunks.push(e.data);
                    };
                    mediaRecorder.onstop = function (e) {
                        var blob = new Blob(this.chunks,);

                        blobToBase64(blob, (output) => {
                            SOCKET.emit('radio', {

                                blob: 'data:audio/mp3;base64,' + output,
                                sessionId: sessionId,
                                reciever_id: FriendUserId,
                                sender_name: userData.first_name,
                                device_token: null,
                                created_at: getCurrentDateTime(),
                                frds_acknowledged: !!frds_acknowledged ? 1 : 0,

                                message: null,
                                message_id: uuidv4(),
                                messageStatus: frdMesageStatus,
                                sender_id: userData.user_id
                            });
                        })
                    };

                    // Start recording
                    mediaRecorder.start();
                }).catch(function (err) {
                    createNotification('error-message')
                })
            }
            else {
                alert("You need a secure https connection in order to record voice")
            }
        }
        else {

            dummyMediaRc.stop();
            setDummyMediaRc(null);
        }
    }
    useEffect(() => {

        scrollToBottom()
    }, [CompleteMessageList])

    /*=============================== Video Call ========================================================*/

    const handleVideo = (image) => {
        // var secondUserDataId = FriendUserId;
        // dispatch(
        //     videoCall({
        //         user_from_id: userData.user_id,
        //         user_to_id: secondUserDataId,
        //         user_to_image: image,
        //         channel_id: uuidv4(),
        //         channel_name: null,
        //         channel_token: null
        //     })
        // );
        // history.push("/searching-profile");
    }


    const handleCall = (image) => {
        // var secondUserDataId = FriendUserId;
        // dispatch(
        //     audioCall({
        //         user_from_id: userData.user_id,
        //         user_to_id: secondUserDataId,
        //         user_to_image: image,
        //         channel_id: uuidv4(),
        //         channel_name: null,
        //         channel_token: null
        //     })
        // );
        // history.push("/searching-profile-call");
    }

    const createNotification = (type) => {
        return () => {
            switch (type) {
                case 'accept':
                    NotificationManager.success('Like sucessfully', 'Like');
                    break;
                case 'success':
                    NotificationManager.success('Success message', 'Title here');
                    break;
                case 'error-secure':
                    NotificationManager.error('err.message', 'Click me!', 5000, () => {
                    });
                case 'error-message':
                    NotificationManager.error('err.message', 'Click me!', 5000, () => {

                    });
                    break;
            }
        };
    };

    const onChangeInput = (e) => {
        const target = e.target;
        setSearchUser(target.value)
    }

    const submitSearchUserForm = (e) => {
        e.preventDefault();
        $('#chat').scrollTop(0);
        searchName = searchUser
        setSearchUserForm(searchUser)
    }
    useEffect(() => {
        // hit api to fetch the records...
        myFriendList = [];
        setFriendlist([])
        searchPage = 1;
        // $('#chat').scrollTop(0);
        getAllDetails(searchUserForm, 1, false)
    }, [searchUserForm])

    // useEffect(() => {
    //     // hit api to fetch the records...
    //     setFriendlist([])
    //     setSearchPage(1);
    //     const friend= await axios.post(baseUrl() + "/fake-user?page=1",bodyParameters)
    //     console.log(friend, "friend......")
    //     const data = friend.data.users.data;
    // }, [searchUserForm])

    const logoutMe = async () => {
        setLogoutLoading(true)
        const bodyParameters = {
            session_id: getCookie("session_id")
        }
        try {
            const logout = await axios.post(baseUrl() + "/logout", bodyParameters)
            setLogoutLoading(false)
            clearData();
            history.push("/login")
        }
        catch (err) {
            setLogoutLoading(false)
            clearData();
            history.push("/login")
        }
    }

    return (

        <section className="home-wrapper">
            <img className="bg-mask" src="/moshmatch/assets/images/mask-bg.png" alt="Mask" />
            <div className="header-bar py-3">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12 d-flex align-items-center">
                            <div className="logo">
                                <a href="javascript:void(0)">
                                    <Logo />
                                </a>
                            </div>
                            <div className="user-admin-details">Logged In: <b>{getCookie("f_name")} {getCookie("l_name")} ({getCookie("email")})</b></div>


                            <div className="logout-icon ml-auto" style={{ pointerEvents: logoutLoading ? "none" : "auto" }} onClick={logoutMe}>
                                <a href="javascript:void(0)" className="text-white"><i className="fas fa-sign-out-alt bg-grd-clr"></i></a>
                            </div>

                        </div>


                    </div>
                </div>
            </div>
            <div className="chat-box-wrapper">
                <div className="container">
                    <div className="row panel messages-panel">
                        <div className="contacts-list col-md-4">
                            <form className="search-form" onSubmit={(e) => submitSearchUserForm(e)}>
                                <input style={{ width: "307px", padding: "20px" }} type="text" placeholder="Search user..." onChange={(e) => onChangeInput(e)} />
                            </form>
                            <ul className="nav inbox-categories d-flex flex-wrap mb-3" role="tablist">
                                <li className="nav-item">
                                    <a id="tab-chat" href="javascript:void(0);" className="nav-link" data-toggle="tab" role="tab">Chat</a>
                                </li>
                            </ul>
                            <div id="chat" className="contacts-outter-wrapper tab-pane">
                                <div className="contacts-outter">
                                    <ul className="nav contacts">

                                        {FriendList.map((item, i) => {
                                            return <li className="nav-item">
                                                <a className="nav-link" href="javascript:void(0);" data-toggle="tab" data-id={item.user_id} role="tab" onClick={() => updateFriendDetails(item)}>
                                                    <div className="status-check">
                                                        <img className="img-circle medium-image"
                                                            onError={(e) => addDefaultSrc(e)} src={!!item.profile_pic ? item.profile_pic : returnDefaultImage()} alt={item.name}
                                                        />
                                                        <span class={item.is_online ? "circle-shape-online" : "circle-shape-offline"}></span>
                                                    </div>
                                                    <div className="contacts_info">
                                                        <div className="user_detail">
                                                            <span className="message-time">{item.created_at}</span>
                                                            <h5 className="mb-0 name">{item.name}</h5>
                                                            {/* <div className="message-count">2</div> */}
                                                        </div>
                                                        <div className="vcentered info-combo">
                                                            <p>Yep, I'm new in town and I wanted</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* Chat box here */}
                        {FriendUserId !== null ?
                            <div className="col-md-8 tab-content chat-block" role="tablist">
                                {
                                    !loading && CompleteMessageList.length === 0 &&
                                    <div className="nothing-to-see text-center active">
                                        <figure>
                                            <img src="/moshmatch/assets/images/message-circle.png" alt="Message" />
                                            <figcaption>Nothing To See</figcaption>
                                        </figure>
                                    </div>
                                }
                                <div className="tab-pane tab-pane" id="chat-field">
                                    <div className="message-top d-flex flex-wrap align-items-center justify-content-between">
                                        <div className="chat-header-info d-flex align-items-center">
                                            {!!AllData ?
                                                <div className="status-check">
                                                    <img className="img-circle medium-image"
                                                        onError={(e) => addDefaultSrc(e)} src={!!AllData.profile_pic ? AllData.profile_pic : returnDefaultImage()} alt={AllData.name}
                                                    />
                                                    <span class={AllData.is_online ? "circle-shape-online" : "circle-shape-offline"}></span>
                                                </div>
                                                : ""}
                                            <div className="chat-user-info ml-2">
                                                {!!AllData ? <h5 className="mb-0 name">{AllData.name}</h5> : <h5>  </h5>}
                                            </div>
                                        </div>

                                        {/* Video call */}
                                        {/* <div className="chat-call-opt d-flex">
                                        <a className="bg-grd-clr mr-3" onClick = {() => handleCall(AllData.profile_images[0])} href="javascript:void(0)">
                                                <NotificationContainer/>
                                                <i className="fas fa-phone-alt" /></a>
                                            <a className="bg-grd-clr" onClick = {() => handleVideo(AllData.profile_images[0])} href="javascript:void(0)">
                                                <NotificationContainer/>
                                                <i className="fas fa-video" />

                                            </a>
                                        </div> */}
                                    </div>

                                    {/*<div className="chat-date text-center my-2">Today</div>*/}
                                    <div className="message-chat">

                                        <div className="chat-body" id={"chat-body"}>
                                            {
                                                CompleteMessageList.map((data, i) => (
                                                    <div>
                                                        {
                                                            (data.user_from_id == FriendUserId) ?
                                                                <div className="message info">
                                                                    <div className="message-body">
                                                                        {
                                                                            !!data.media &&
                                                                            <div className="media-socket">
                                                                                <img onError={(e) => addDefaultSrc(e)} src={!!data.media ? data.media : returnDefaultImage()} />
                                                                            </div>
                                                                        }

                                                                        {
                                                                            !!data.message &&
                                                                            <div className="message-text">
                                                                                <p>{data.message}</p>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !!data.audio &&
                                                                            <div className="audio-socket">
                                                                                <audio controls src={data.audio} className="audio-left" />
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="message my-message ">
                                                                    <div className="message-body">
                                                                        {
                                                                            !!data.media &&
                                                                            <div className="media-socket">
                                                                                <img onError={(e) => addDefaultSrc(e)} src={!!data.media ? data.media : returnDefaultImage()} />
                                                                            </div>
                                                                        }

                                                                        {
                                                                            !!data.message &&
                                                                            <div className="message-text">
                                                                                <p>{data.message}</p>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !!data.audio &&
                                                                            <div>
                                                                                <audio controls src={data.audio} className="audio-right" />
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                            {/* {
                                                
                                                !isAcknowledge &&
                                                <div className="message-text warning-msg" >
                                                <p>You can send upto 1 message since this user hasn't response back, Chat message limit reached. You will not be able to send messages to this user</p>
                                            </div>
                                            } */}
                                            <NotificationContainer />
                                        </div>
                                        <form onSubmit={CheckTextInputIsEmptyOrNot}>

                                            <div className="chat-footer">
                                                <div className="sweet-loading">
                                                    <BarLoader color={"#fcd46f"} loading={loading} css={override} size={1000} />
                                                </div>
                                                {/* <label className="upload-file">
                                                    <div>
                                                        <input id="uploadfile" type="file" />
                                                        <i className="far fa-image" />
                                                    </div>
                                                </label> */}
                                                {/* <textarea className="send-message-text" placeholder="Message..." defaultValue={UserMessage} /> */}
                                                <input className="send-message-text" name="Message" id="Message" type="text" placeholder="Message..." value={UserMessage} onChange={e => changeInput(e)} />
                                                {/* <label className="gift-message bg-grd-clr">
                                                    <a href="javascript:void(0)" onClick={handleGift} >
                                                        <i className="fas fa-gift" />
                                                    </a>
                                                </label> */}
                                                <label className="record-message">
                                                    <a onClick={sendVoiceNote}>
                                                        {
                                                            dummyMediaRc &&
                                                            <i className="fas fa-microphone-slash" />
                                                        }
                                                        {
                                                            !dummyMediaRc &&
                                                            <i className="fas fa-microphone" />
                                                        }

                                                    </a>
                                                    <NotificationContainer />
                                                </label>
                                                <button type="submit" className="send-message-button bg-grd-clr"><i className="fas fa-paper-plane" /></button>
                                                {
                                                    !!chatTyping &&
                                                    <div>{chatTyping} is typing...</div>
                                                }
                                            </div>
                                        </form>
                                    </div>

                                </div>

                            </div>
                            : <div className="nothing-to-see text-center active">
                                <figure>
                                    <img src="/moshmatch/assets/images/message-circle.png" alt="Message" />
                                    <figcaption>Nothing To See</figcaption>
                                </figure>
                            </div>}

                        {/* End chat box here */}
                        <div className={isOn ? 'all-gifts-wrapper active' : 'all-gifts-wrapper '} >
                            <div className="all-gift-inner">
                                <a href="javascript:void(0)" className="close-gift-btn modal-close" onClick={toggleIsOn}><img src="/moshmatch/assets/images/btn_close.png" /></a>
                                <div className="all-gift-header d-flex flex-wrap align-items-center mb-3">
                                    <h5 className="mb-0 mr-4">Send Gift</h5>
                                    <div className="remaining-coins">
                                        <img src="/moshmatch/assets/images/diamond-coin.png" alt="Coins" />
                                        <span>152</span>
                                    </div>
                                </div>
                                <div className="all-gift-body">

                                    <ul className="d-flex flex-wrap text-center">
                                        {GiftData.map((items, i) => {
                                            return <li onClick={() => getGiftItem(items.id)}>
                                                <a href="javascript:void(0)" >
                                                    <div>
                                                        <figure>
                                                            <img onError={(e) => addDefaultSrc(e)} src={!!items.image ? items.image : returnDefaultImage()} alt={items.name} />
                                                        </figure>
                                                        <div className="gift-price">
                                                            <img src="/moshmatch/assets/images/diamond-coin.png" alt="Coins" />
                                                            <span>{items.coins}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        })}
                                        <li>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ChatBox;
const express = require("express")
const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());

let room = [];
let customer = [];
let bookedroom = [];
let bookedcustomer = [];

// dummy data room = {roomnumber:101, seatsavailable:2, amenities:'projector, coffee', price:500}, {roomnumber:102, seatsavailable:2, amenities:'projector, coffee', price:500}, {roomnumber:103, seatsavailable:2, amenities:'projector, coffee', price:500}
// dummy data customer = {customername:"Debopam", date:"16 July 2021", starttime:"12:00", endtime: "15:00", roomnumber: 101}, {customername:"Debopam", date:"16 July 2021", starttime:"16:00", endtime: "17:00", roomnumber: 101}, {customername:"Debopam", date:"16 July 2021", starttime:"17:00", endtime: "18:00", roomnumber: 101}

//View the home page

app.get('/', (req,res)=>{
    res.status(200).send("This is the home page") 
})

//Adding of new meeting rooms

app.post('/room', (req, res)=>{
    var t = 0
    for (var i in room){
        if (req.body.roomnumber===room[i].roomnumber){
            t = 1;
        }
    }
    if(t===0){
        room.push({roomnumber:req.body.roomnumber, seatsavailable:req.body.seats, amenities:req.body.amenities, price:req.body.price})
        res.status(200).send("New Room Created")
    }
    else{
        res.status(200).send("Room already exists")
    }
})

//Adding a customer / Room Booking

app.post('/customer', (req, res)=>{

    // checking if customer ID alrady exists

    var t = 0;
    for (var i in customer){
        if (req.body.bookingid===customer[i].bookingid){
            t = 1;
        }
    }

    //checking if room exists

    var x = 0;
    for (var i in room){
        if (req.body.roomnumber===room[i].roomnumber){
            x = 1;
        }
    }

    // Time calculation - Enter the time in hh:mm format only

    var starttimearr = req.body.starttime.split(":");
    var bookingendtimearr = req.body.endtime.split(":");
    var bookingdate = new Date(req.body.date);
    var bookingtime = new Date(req.body.date);
    var bookingendtime = new Date(req.body.date);
    bookingtime.setHours(starttimearr[0],starttimearr[1]);
    bookingendtime.setHours(bookingendtimearr[0],bookingendtimearr[1]);

    var k = 0;
    for (var i in customer){
        if((req.body.roomnumber===customer[i].roomnumber&&bookingdate.toString()===customer[i].date&&bookingtime.toString()<=customer[i].starttime&&bookingendtime.toString()>=customer[i].starttime)||(req.body.roomnumber===customer[i].roomnumber&&bookingdate.toString()===customer[i].date&&bookingtime.toString()>=customer[i].starttime&&bookingtime.toString()<customer[i].endtime)){
            k = 1;
        }
    }

    if(bookingendtime<bookingtime){
        res.status(200).send("Incorred booking period entered. Please enter time in the 24 Hour format only")
    }
    else{
        if(t===1){
            res.status(200).send("Customer ID already Taken, kindly enter another Customer ID")
        }
        else{
            if(x===0){
                res.status(200).send("Room does not exist. Please check the room list and book")
            }
            else{
                if(k===1){
                    res.status(200).send("Room not available during the period. Please try another room/slot")
                }
                else{
                    customer.push({bookingid:customer.length+1, customername:req.body.customername, date:bookingdate.toString(), starttime:bookingtime.toString(), endtime: bookingendtime.toString(), roomnumber: req.body.roomnumber})
    
                    bookedroom.push({roomnumber: req.body.roomnumber, "Booking Status":"Booked", "Customer Name": req.body.customername, "Date": bookingdate.toString(), "Start Time": bookingtime.toString(), "End Time": bookingendtime.toString(), BookingID:customer.length })
    
                    res.status(200).send("New Customer Added")
                }
            } 
        }
    }
})

//Viewing the details of rooms

app.get('/room', (req,res)=>{
    if(room.length>0){
        res.status(200).json({room})
    }
    else{
        res.status(200).send("No rooms exists")
    }
    
})

//View the general details of any particular room

app.get('/room/:roomnumber', (req,res)=>{
    let RoomDetails = [];
    for (var i in room){
        if(req.params.roomnumber==room[i].roomnumber){
            RoomDetails.push(room[i])
        }
    }
    if(RoomDetails.length>0){
        res.status(200).json({RoomDetails})
    }
    else{
        res.status(200).send("This room does not exist")
    }
    
})

//Viewing the details of the customer 

app.get('/customer', (req, res)=>{
    if(customer.length>0){
        res.status(200).json({customer})
    }
    else{
        res.status(200).send("No one has booked any room yet")
    }
})

//Viewing individual bookings

app.get('/customer/:bookingid', (req, res)=>{
    let CustomerDetails = [];
    for (var i in customer){
        if(req.params.bookingid==customer[i].bookingid){
            CustomerDetails.push(customer[i])
        }
    }
    if(CustomerDetails.length>0){
        res.status(200).json({CustomerDetails})
    }
    else{
        res.status(200).send("This bookingid does not exist")
    }
})

//Viewing the details of booked rooms

app.get('/bookedrooms', (req, res)=>{
    if(bookedroom.length>0){
        res.status(200).json({bookedroom})
    }
    else{
        document.getElementById("cont").res.status(200).send("No room is booked as of now")
    }
})

//viewing individual booked rooms

app.get('/bookedrooms/:roomnumber', (req, res)=>{
    let BookingList = [];
    for (var i in bookedroom){
        if (req.params.roomnumber==bookedroom[i].roomnumber){
            BookingList.push(bookedroom[i]);
        }
    }
    if(BookingList.length==0){
        res.status(200).send("No bookings under this room")
    }
    else{
        res.status(200).json({BookingList})
    }
})

//Listen to port

app.listen((port),()=>{
    console.log("listening at port ", port)
})

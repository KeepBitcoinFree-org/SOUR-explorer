var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8082;
//request for API hits
const request = require('request');

// require syntax for BCH BITBOX
let BITBOX = require('bitbox-sdk').BITBOX;
let bitbox = new BITBOX({ restURL: 'https://rest.bitcoin.com/v2/' });
//let mnemonic = bitbox.Mnemonic.generate();

//const BITBOXSDK = require('bitbox-sdk')
let SLPSDK = require('slp-sdk');
let SLP = new SLPSDK();

//SLPDB QUERYS - 

//get all memo transactions
const queryMemo = {
  "v": 3,
  "q": {
    "find": { "out.h1": "6d02" },
    // "out.b0": { "op": 106 },
 //   "project": { "out.$": 1 }
  },
  "r": {
    "f": "[ .[] | {msg: .out[0].s2} ]"
  }
}

//PULLS ALL UNCONFIRMED SOUR SLP TX
const querySOURslp = {
    "v": 3,
    "q": {
  //    db: ['t'],
      "find": {"slp.detail.tokenIdHex" : "6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0"},
      "limit": 50
    },
}

//PULLS ALL UNCONFIRMED SLP TX
const queryAllUnconf = {
  "v": 3,
  "q": {
    "db": ["u"],
    "find": { },
    "limit": 50
 //   "project": { "out.$": 1, "_id": 0 },
  },
//    "r": {
 //   "f": "[.[] | .out[0] | { token_symbol: .s4, token_name: .s5, document_url: .s6} ]"
 // }
}
// "Find 100 transactions with an output OP_RETURN script that starts with 0x6d02 (memo.cash). And then return only its block index, block time, and content."

//SUPPOSED TO FIND MEMO FORMATS? IDK
const queryMemoFormat = {
  "v": 3,
  "q": {
    "find": { "out.h1": "6d02" },
    "limit": 100
  },
  "r": {
    "f": "[{ block: .blk.i?, timestamp: .blk.t?, content: .out[1].s2 }]"
  }
}

//pull latest info for SOUR TOKEN ID 
const querySOURtoken = {
  "v": 3,
  "q": {
    "find": { "tokenDetails.tokenIdHex" : "6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0" },
    "limit": 10
  }
}




function convertUnixTimeToTime(unixtimestamp) {

 // Unixtimestamp
 //var unixtimestamp = document.getElementById('timestamp').value;

 // Months array
 var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 // Convert timestamp to milliseconds
 var date = new Date(unixtimestamp*1000);
 // Year
 var year = date.getFullYear();
 // Month
 var month = months_arr[date.getMonth()];
 // Day
 var day = date.getDate();
 // Hours
 var hours = date.getHours();
 // Minutes
 var minutes = "0" + date.getMinutes();
 // Seconds
 var seconds = "0" + date.getSeconds();
 // Display date time in MM dd, yyyy h:m:s format
 var convdataTime = month+' '+day+', '+year+' '+ (hours) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
 return convdataTime;
}

function numberWithCommas(x) {
//  perArray = x.split('.');
//  if(perArray.length > 1){
//    return perArray[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + perArray[1];
//  }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
}

function numberWithCommasPeriod(x) {
  perArray = x.split('.');
  if(perArray.length > 1){
    return perArray[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + perArray[1];
  }else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

function openSLPDBsocket(query) {
  //try to print info using socket
}

function hitSLPDBforSOURid(query, socket) {

 (async () => {

  //  console.log('query for SOURid: ' + query);
    let res = await SLP.SLPDB.get(query);

    // console.log('res', res);
    // console.log('res.t', res.t[0]);
    // console.log('res.t.lastUpdatedBlock', res.t[0].lastUpdatedBlock);
    // console.log('res.t.tokenDetails', res.t[0].tokenDetails);
    // console.log('res.t.tokenStats', res.t[0].tokenStats);
  
     socket.emit('chat message', 'ID: ' + res.t[0].tokenDetails.tokenIdHex);
     socket.emit('chat message', 'Symbol: ' + res.t[0].tokenDetails.symbol);
     socket.emit('chat message', 'Name: ' + res.t[0].tokenDetails.name);
     socket.emit('chat message', 'Decimals: ' + res.t[0].tokenDetails.decimals);
     socket.emit('chat message', 'Version Type: ' + res.t[0].tokenDetails.versionType);
     socket.emit('chat message', 'Contains Baton: ' + res.t[0].tokenDetails.containsBaton);
     socket.emit('chat message', 'Block Created: ' + numberWithCommas(res.t[0].tokenStats.block_created));
     socket.emit('chat message', 'Timestamp: ' + res.t[0].tokenDetails.timestamp);
     socket.emit('chat message', 'Block Last Active Send: ' + numberWithCommas(res.t[0].tokenStats.block_last_active_send));
     socket.emit('chat message', 'Txns Since Genesis: ' + numberWithCommas(res.t[0].tokenStats.qty_valid_txns_since_genesis));
     socket.emit('chat message', 'Valid SOUR Addresses: ' + numberWithCommas(res.t[0].tokenStats.qty_valid_token_addresses));
     socket.emit('chat message', 'Initial Token Qty: ' + numberWithCommas(res.t[0].tokenStats.qty_token_minted) + ' SOUR');
     socket.emit('chat message', 'Total SOUR burned: ' + numberWithCommas(res.t[0].tokenStats.qty_token_burned) + ' SOUR');
     socket.emit('chat message', 'Circulating Supply: ' + numberWithCommas(res.t[0].tokenStats.qty_token_circulating_supply) + ' SOUR');
     socket.emit('chat message', 'Satoshis locked up: ' + numberWithCommas(res.t[0].tokenStats.qty_satoshis_locked_up) + ' Sats');    

   })();

}

function hitSLPDBforSOUR(query, socket) {

try {

  (async () => {

   // console.log("query forSOUR", query);

    let res = await SLP.SLPDB.get(query);
 //   DEBUG LOGS FOR THE QUERY
 // console.log('=====================');
//  console.log('hitSLPDBforSOUR: ' + res);
  //    console.log('=========U===========');
  //    console.log(res.u[0]);
 //     console.log(res.u[0].in[0]);
  // console.log('=========T===========');
  // console.log(res.t[0]);
  // console.log('=========G===========');
  // console.log(res.g[0]);
  // console.log('=========A===========');
  // console.log(res.a[0]);  
  // console.log('=========X===========');
  // console.log(res.x[0]);
  // console.log('=====================');

    // console.log('res', res);
    // console.log('res.t', res.t);
    // console.log('res.t.lastUpdatedBlock', res.t.lastUpdatedBlock);
    // console.log('res.t.tokenDetails', res.t.tokenDetails);
    // console.log('res.t.tokenStats', res.t.tokenStats);

  //  console.log('res', res);

// GO THROUGH UNCONFIRMED ARRAY OF TX
//console.log(res.u);
if (res.u.length < 1){ 
          socket.emit('tx-uo', '{ No new unconfirmed (pending) SOUR transactions avail from SLPDB. }');
    }else{

 //  console.log('RESPONSE : ');
 //  console.log(res);
 //  console.log(res.c);
 //  console.log(res.c[0]);

 // console.log(res);
 // console.log(res.u.tx);
  //console.log(res.u.in[0]);
 // console.log(res.u.slp);

   // console.log('res.u', res.u);
   // console.log('res.u.out', res.u);

   //for each UNconfirmed transactions...
    res.u.forEach((v) => {
   // console.log('foreach debug:');
   // console.log(v.slp.detail.outputs);
   // console.log(v.slp.detail);

   //DateTime doesn't exist in unconfirmed blocks because the timestamp is based the first block that confirms it.

     // io.emit('tx-c', 'Token: ' + v.slp.detail.symbol + ', ID: ' + v.slp.detail.tokenIdHex);
    socket.emit('tx-u', 'Tx Type: ' + v.slp.detail.transactionType);
   // io.emit('tx-c', );


    //FOR EACH INPUTS
    //LATEST UNCONFIRMED TRANSACTIONS OUTPUTS
    let out = 1;
    let faucet = false;
    
    

    //determine if this is the SOUR Faucet to display an img link
    if (v.slp.detail.outputs.length > 1){
      if (v.slp.detail.outputs[1].address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk'){
        faucet = true;
      }else{
        faucet = false;
      }

    }
    
    //FOR EACH OUTPUTS UNCONFIRMED
    v.slp.detail.outputs.forEach((o) => {

    
      if((faucet == true) && (out == 1)){
        socket.emit('tx-uo-f', ' This is the SOUR Faucet');
      }

      //io.emit('tx-uo', 'Output #' + out + ' -');
        socket.emit('tx-uo', 'Output #' + out + ' -');
        socket.emit('tx-uo', 'Addr: ' + o.address);
        
        if((faucet == true) && (out == 1)){
          socket.emit('tx-uo', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR (WON rolling 🎲🎲 at the SOUR Faucet!)');
        }else{
          socket.emit('tx-uo', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR');
        }

        out++;
      });


    });
    //io.emit('break', '.');
  // End empty check
  }

// END UNCONFIRMED TX


   //LATEST CONFIRMED TX

   //check if it's empty (shouldn't be though)
   if (res.c.length < 1){ 
          socket.emit('tx-c', '{ No new confirmed (completed) SOUR transactions avail from SLPDB. }');
    }else{

 //  console.log('RESPONSE : ');
 //  console.log(res);
 //  console.log(res.c);
 //  console.log(res.c[0]);

   //for each confirmed transaction...
    res.c.forEach((v) => {
   // console.log('foreach debug:');
   // console.log(v.slp.detail.outputs);
   // console.log(v.slp.detail);

   //console.log('confirmed object: ', v);


   let timestamp = v.blk.t;
//console.log('UNIX TIMESTAMP', timestamp);
   let utcDate = convertUnixTimeToTime(timestamp);
  //  console.log('utcDate', utcDate);
   
    socket.emit('tx-c', 'Confirmed on: ' + utcDate + ' UTC,  Tx Type: ' + v.slp.detail.transactionType);

    //LATEST UNCONFIRMED TRANSACTIONS
    let n = 1;
    let faucet = false;
    
    

    //determine if this is the SOUR Faucet to display an img link
    if (v.slp.detail.outputs.length > 1){
      if (v.slp.detail.outputs[1].address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk'){
        faucet = true;
      }else{
        faucet = false;
      }

    }

    //FOR EACH - CONFIRMED OUTPUTS
    v.slp.detail.outputs.forEach((o) => {

        if((faucet == true) && (n == 1)){
          socket.emit('tx-co-f', ' This is the SOUR Faucet');
        }

        socket.emit('tx-co', 'Output #' + n + ' -');
        socket.emit('tx-co', 'Addr: ' + o.address);
        if((faucet == true) && (n == 1)){
          socket.emit('tx-co', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR (WON rolling 🎲🎲 at the SOUR Faucet!)');
        }else{
          socket.emit('tx-co', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR');
        }
        n++;
    });
    });
    //io.emit('break', '.');

  }
  //end ELSE


})();


}catch(error){
console.log(error);
}

 //end fucntion
}









// USER HAS REQUESTED INDEX / PAGE
app.get('/', function(req, res){
  //Actually returning the index html page
  res.sendFile(__dirname + '/index.html');

  // awesome documentation
  // https://docs.fountainhead.cash/docs/tutorial_v3
  // SLPDB QUERY => https://slpdb.bitcoin.com/
  // https://docs.fountainhead.cash/docs/intro_v3#query-examples
  // https://docs.fountainhead.cash/docs/query_v3
  // https://github.com/simpleledger/SLPDB/blob/master/README.md#BCHDgRPCSupport
 
});



 // NEW USER CONNECTED HERE
io.on('connection', function(socket){

  try{ 

  //QUERIES FOR SLPDB TO GRAB INFO ON SOUR

  //console.log(querySOURtoken);
  hitSLPDBforSOURid(querySOURtoken, socket);


  //console.log('hitSLPDBforSOURid');
  hitSLPDBforSOUR(querySOURslp, socket);


  //, 10 * 1000);

  // SLPsocket.listen(
  //   {
  //     v: 3,
  //     q: { find: {"tokenDetails.tokenIdHex":"6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0"} }
  //    //   'out.h1': '6d02'    
  //   },
  //   slpsock => {
  //     setTimeout(function() {
  //       SLPsocket.close(() => {
  //         console.log(slpsock);
  //         console.log('SLP Socket closed');
  //       })
  //     }, 120 * 1000)
  //     console.log(slpsock);
  //     console.log(slpsock[0]);
  //     console.log(slpsock.data);
      //SLPsocket.emit('update', slpsock);
  // });
//console.log(slpsock);


}catch(error){
  console.log(error);
}

// https://slpsocket.bchdata.cash/

  //CLOSE USER SOCKET CONNECTION
  });






//  io.on('connection', function(socket){
//    console.log('new user connected to socket');

//    socket.on('disconnect', function(){
//     console.log('user disconnected from socket');
//     //TODO: force refresh the page on every disconnect so that the info doesn't keep replicating
//     let refresh = true;
//     io.emit('refresh', refresh);
//     console.log('refreshed');
//   });




// });

http.listen(port, function(){
  console.log('BOOTING UP....')
  console.log('listening on *:' + port);
});


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

function hitSLPDBforSOURid(query) {

 (async () => {

  //  console.log('query for SOURid: ' + query);
    let res = await SLP.SLPDB.get(query);

    // console.log('res', res);
    // console.log('res.t', res.t[0]);
    // console.log('res.t.lastUpdatedBlock', res.t[0].lastUpdatedBlock);
    // console.log('res.t.tokenDetails', res.t[0].tokenDetails);
    // console.log('res.t.tokenStats', res.t[0].tokenStats);
  
     io.emit('chat message', 'ID: ' + res.t[0].tokenDetails.tokenIdHex);
     io.emit('chat message', 'Symbol: ' + res.t[0].tokenDetails.symbol);
     io.emit('chat message', 'Name: ' + res.t[0].tokenDetails.name);
     io.emit('chat message', 'Decimals: ' + res.t[0].tokenDetails.decimals);
     io.emit('chat message', 'Version Type: ' + res.t[0].tokenDetails.versionType);
     io.emit('chat message', 'Contains Baton: ' + res.t[0].tokenDetails.containsBaton);
     io.emit('chat message', 'Block Created: ' + numberWithCommas(res.t[0].tokenStats.block_created));
     io.emit('chat message', 'Timestamp: ' + res.t[0].tokenDetails.timestamp);
     io.emit('chat message', 'Block Last Active Send: ' + numberWithCommas(res.t[0].tokenStats.block_last_active_send));
     io.emit('chat message', 'Txns Since Genesis: ' + numberWithCommas(res.t[0].tokenStats.qty_valid_txns_since_genesis));
     io.emit('chat message', 'Valid SOUR Addresses: ' + numberWithCommas(res.t[0].tokenStats.qty_valid_token_addresses));
     io.emit('chat message', 'Initial Token Qty: ' + numberWithCommas(res.t[0].tokenStats.qty_token_minted) + ' SOUR');
     io.emit('chat message', 'Total SOUR burned: ' + numberWithCommas(res.t[0].tokenStats.qty_token_burned) + ' SOUR');
     io.emit('chat message', 'Circulating Supply: ' + numberWithCommas(res.t[0].tokenStats.qty_token_circulating_supply) + ' SOUR');
     io.emit('chat message', 'Satoshis locked up: ' + numberWithCommas(res.t[0].tokenStats.qty_satoshis_locked_up) + ' Sats');    })();

}

function hitSLPDBforSOUR(query) {

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
          io.emit('tx-uo', '{ No new unconfirmed (pending) SOUR transactions avail from SLPDB. }');
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
    io.emit('tx-u', 'Tx Type: ' + v.slp.detail.transactionType);
   // io.emit('tx-c', );


   //FOR EACH INPUTS

    //LATEST UNCONFIRMED TRANSACTIONS OUTPUTS
    let out = 1;
    let faucet = false;
    
    //FOR EACH OUTPUTS
    v.slp.detail.outputs.forEach((o) => {
     // console.log('new output');
    // console.log(o.address);
      // if(o.address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk'){
      //   io.emit('tx', 'Output #' + n + ' Addr: ' + o.address + ' (SOUR Faucet at sour-faucet.ddns.net)');
      //   faucet = true;
      // }else{
     io.emit('tx-uo', 'Output #' + out + ' -');

      if(o.address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk'){
       io.emit('tx-uo', 'Addr: ' + o.address);
       io.emit('tx-uo', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR');
       io.emit('tx-uo', '*This is the SOUR FAUCET at http://sour-faucet.ddns.net');

      }
      else{
        io.emit('tx-uo', 'Addr: ' + o.address);
        io.emit('tx-uo', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR');

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
          io.emit('tx-c', '{ No new confirmed (completed) SOUR transactions avail from SLPDB. }');
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
   
    io.emit('tx-c', 'Confirmed on: ' + utcDate + ' UTC,  Tx Type: ' + v.slp.detail.transactionType);

    //LATEST UNCONFIRMED TRANSACTIONS
    let n = 1;
    let faucet = false;
    
    v.slp.detail.outputs.forEach((o) => {
     // console.log('new output');
    // console.log(o.address);
      // if(o.address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk'){
      //   io.emit('tx', 'Output #' + n + ' Addr: ' + o.address + ' (SOUR Faucet at sour-faucet.ddns.net)');
      //   faucet = true;
      // }else{
     io.emit('tx-co', 'Output #' + n + ' -');
     if(o.address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk'){
        io.emit('tx-co', 'Addr: ' + o.address);
        io.emit('tx-co', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR');
        io.emit('tx-co', '*This is the SOUR FAUCET at http://sour-faucet.ddns.net');
      }
      else{

        io.emit('tx-co', 'Addr: ' + o.address);
        io.emit('tx-co', 'Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR');
      }
// ', Amount: ' + numberWithCommasPeriod(o.amount) + ' SOUR'
   //   if ((n == 1) && (v.slp.detail.outputs[1].address == 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk')){
   //   io.emit('tx', 'Output #' + n + ' Amnt: ' + numberWithCommasPeriod(o.amount) + ' SOUR (WON rolling the dice at the SOUR Faucet');

  //    }else{
    
  //   }
     n++;
    });

    //io.emit('tx', '=================================================================');
  //  io.emit('update', 'Details: ' + JSON.stringify(v));
   // io.emit('update', '');
    });
    //io.emit('break', '.');

  }
  //end ELSE


})();

  // io.emit('update', 'Latest SOUR Addresses: ');
  // io.emit('update', JSON.stringify(res.a[0], null, 4));


  // io.emit('update', 'SOUR ADDRESSES: ');
  // res.a.forEach((v) => {
  //   io.emit('update', v.address);
  //   io.emit('update', v.token_balance + ' SOUR');
  //});

}catch(error){
console.log(error);
}

 //end fucntion
}

app.get('/', function(req, res){
 

//io.emit('chat message', 'SOUR Tracker');
 

//console.log('hitting SLPDB for SOURid');
//hitSLPDBforSOURid(querySOURtoken);


 try {
 // (async () => {
    
 //       let sour = await SLP.Utils.list(
 //         '6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0'
 //       );

 //     // console.log(sour);
 //     // console.log('whatup');

 //     io.emit('chat message', 'ID: ' + sour.id);
 //     io.emit('chat message', 'Symbol: ' + sour.symbol);
 //     io.emit('chat message', 'Name: ' + sour.name);
 //     io.emit('chat message', 'Decimals: ' + sour.decimals);
 //     io.emit('chat message', 'Timestamp: ' + sour.timestamp);
 //     io.emit('chat message', 'Version Type: ' + sour.versionType);
 //     io.emit('chat message', 'Contains Baton: ' + sour.containsBaton);
 //     //io.emit('chat message', 'Doc Hash: ' + sour.documentHash);
 //     io.emit('chat message', 'Block Created: ' + numberWithCommas(sour.blockCreated));
 //     io.emit('chat message', 'Block Last Active Send: ' + numberWithCommas(sour.blockLastActiveSend));
	//    io.emit('chat message', 'Txns Since Genesis: ' + numberWithCommas(sour.txnsSinceGenesis));
	//    io.emit('chat message', 'Valid SOUR Addresses: ' + numberWithCommas(sour.validAddresses));
	//    io.emit('chat message', 'Initial Token Qty: ' + numberWithCommas(sour.initialTokenQty) + ' SOUR');
	//    io.emit('chat message', 'Total SOUR burned: ' + numberWithCommas(sour.totalBurned));
	//    io.emit('chat message', 'Circulating Supply: ' + numberWithCommas(sour.circulatingSupply) + ' SOUR');
 //   //  io.emit('chat message', '_________________________________________________________________________________');


//     io.emit('logo', '__┬__┌─┐┌┬┐┌─┐┌─┐┌┬┐__╔═╗╔═╗╦_╦╦═╗__┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐');
//     io.emit('logo', '__│__├─┤_│_├┤_└─┐_│___╚═╗║_║║_║╠╦╝___│_├┬┘├─┤│││└─┐├─┤│___│_││_││││└─┐');
//     io.emit('logo', '__┴─┘┴_┴_┴_└─┘└─┘_┴___╚═╝╚═╝╚═╝╩╚═___┴_┴└─┴_┴┘└┘└─┘┴_┴└─┘_┴_┴└─┘┘└┘└─┘');
 //    io.emit('update', '__██████__▒█████___█____██__██▀███_____▄▄▄█████▓▒██___██▒');
 //    io.emit('update', '▒██____▒_▒██▒__██▒_██__▓██▒▓██_▒_██▒___▓__██▒_▓▒▒▒_█_█_▒░');
 //    io.emit('update', '░_▓██▄___▒██░__██▒▓██__▒██░▓██_░▄█_▒___▒_▓██░_▒░░░__█___░');
 //    io.emit('update', '__▒___██▒▒██___██░▓▓█__░██░▒██▀▀█▄_____░_▓██▓_░__░_█_█_▒_');
 //    io.emit('update', '▒██████▒▒░_████▓▒░▒▒█████▓_░██▓_▒██▒_____▒██▒_░_▒██▒_▒██▒');
 //    io.emit('update', '▒_▒▓▒_▒_░░_▒░▒░▒░_░▒▓▒_▒_▒_░_▒▓_░▒▓░_____▒_░░___▒▒_░_░▓_░');
 //    io.emit('update', '░_░▒__░_░__░_▒_▒░_░░▒░_░_░___░▒_░_▒░_______░____░░___░▒_░');
 //    io.emit('update', '░__░__░__░_░_░_▒___░░░_░_░___░░___░______░_______░____░__');
  

  // awesome documentation
  // https://docs.fountainhead.cash/docs/tutorial_v3
  // SLPDB QUERY => https://slpdb.bitcoin.com/
  // https://docs.fountainhead.cash/docs/intro_v3#query-examples
  // https://docs.fountainhead.cash/docs/query_v3
  // https://github.com/simpleledger/SLPDB/blob/master/README.md#BCHDgRPCSupport



 // })();

    } catch (error) {
      console.log(error);
    }

 try{ 
        // GET REAL-TIME DATA FROM SOCKET
        // open REAL TIME Socket


  //QUERIES FOR SLPDB TO GRAB INFO ON SOUR

  //MEMO QUERY - get all memo transactions
var queryMemo = {
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

var querySOURslp = {
    "v": 3,
    "q": {
  //    db: ['t'],
      "find": {"slp.detail.tokenIdHex" : "6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0"},
      "limit": 50
    },
}

var queryAllUnconf = {
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

var queryMemoFormat = {
  "v": 3,
  "q": {
    "find": { "out.h1": "6d02" },
    "limit": 100
  },
  "r": {
    "f": "[{ block: .blk.i?, timestamp: .blk.t?, content: .out[1].s2 }]"
  }
}

var querySOURtoken = {
  "v": 3,
  "q": {
    "find": { "tokenDetails.tokenIdHex" : "6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0" },
    "limit": 10
  }
}


//console.log(querySOURtoken);
  hitSLPDBforSOURid(querySOURtoken);
//console.log('hitSLPDBforSOURid');



//setTimeout(

  hitSLPDBforSOUR(querySOURslp);

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

 res.sendFile(__dirname + '/index.html');





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


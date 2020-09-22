var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8082;
//request for API hits
const request = require('request');

// require syntax for BCH BITBOX
let BITBOX = require('bitbox-sdk').BITBOX;
let bitbox = new BITBOX();
//let mnemonic = bitbox.Mnemonic.generate();

//const BITBOXSDK = require('bitbox-sdk')
let SLPSDK = require('slp-sdk');
let SLP = new SLPSDK({ restURL: 'https://slpdb.electroncash.de'});

// EJS
// app.use(express.static('public'));
// //app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

// TODO: CONVERT CURRENT OL LISTS TO USE DATATABLES INSTEAD TO
// AUTOMATICALLY ADD PAGiNATION, FILTERING, SEARCHING, ETC.
// https://datatables.net/examples/data_sources/dom.html
// https://datatables.net/manual/

// TODO: Add Captcha to the SOUR-Faucet
// https://www.npmjs.com/package/node-captcha
// https://stackfame.com/google-recaptcha-node-express

// TODO: Add Socket to SLPDB to automatically update info when new tx arise


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

//PULLS ALL  SOUR SLP TX
const querySOURslp = {
  "v": 3,
  "q": {
    "find": {"slp.detail.tokenIdHex" : "6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0"},
    "limit": 10
  }
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
      let x0 = perArray[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return x0.concat('.' + perArray[1]);
  }else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

function openSLPDBsocket(query) {
  //try to print info using socket
}

const NETWORK = `mainnet`


// PAY OUT PROOF OF SOUR AIRDROP \\

function sendPOSpayout(sendConfig){




}



// TODO: restrict to my IP only. 176.113.74.72

  // IT FUCKING WORKS!! 50 at a time right now.
function payoutProofOfSOUR(res){


// let userIP = req.ip;

// if(userIP === '176.113.74.72'){

let dividendPayoutsSLP = new Array();

//set up sample for testing
// let slp = 'simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g';
// let bal = 200;
// let percent = .0001;
// let nextPOSpayout = 2;
  
  //create list to pay out for testing. 
    dividendPayoutsSLP.push(
   
      {"address":"simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g","balance":1200,"percent":0.0019356118711076056,"POSpayout":4.35611871},
      {"address":"simpleledger:qzlq5chhphjzu3gl6qs4fx4sgevv0cqfzyucvyy2aa","balance":1063.04961765,"percent":0.0017147095495831178,"POSpayout":5.1470955}, 
      {"address":"simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk","balance":2063.04961765,"percent":0.0017147095495831178,"POSpayout":5.234955}

     )

//first 50, wait for confirmation


// second 50
// 

// third 50

 // {
 //        'slp' : slp,
 //        'bal' : bal,
 //        'percent' : percent,
 //        'nextPOSpayout': nextPOSpayout
 //        }
  // set up wallet for paying out SOUR POS payments.
//   const mnemonic = 'ten trigger auction nominee version picnic brick tuition doll vapor tuition clap';

    // root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    // master HDNode
    let masterHDNode
    if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed)
    else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet") // Testnet

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, "0/0")

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.HDNode.toSLPAddress(change)

    console.log(cashAddress);
    console.log(slpAddress);

    const fundingAddress = slpAddress
    const fundingWif = SLP.HDNode.toWIF(change) // <-- compressed WIF format
   // const tokenReceiverAddress = SLPADDR
    const bchChangeReceiverAddress = cashAddress

    // Exit if user did not update the SLPADDR.
/*    if (!SLPADDR || SLPADDR === "") {
      console.log(
        `SLPADDR value is empty. Update the code with the SLPADDR of your token.`
      )
      return
    }

    // Exit if user did not update the TOKENID.
    if (!TOKENID || TOKENID === "") {
      console.log(
        `TOKENID value is empty. Update the code with the TOKENID of your token.`
      )
      return
    }*/


const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

const start = async () => {
  
  await asyncForEach(dividendPayoutsSLP, async (balance) => {
    await waitFor(4000);

    //do things inside our loop like send the token tx

      console.log(balance);

      let tokenReceiverAddress = balance.address;

  //console.log('tokenReceiverAddress ', tokenReceiverAddress);

    // set up send config for send
      var sendConfig = {
      fundingAddress,
      fundingWif,
      tokenReceiverAddress,
      bchChangeReceiverAddress,
      tokenId: SOURid,
      amount: balance.POSpayout
    }

    console.log(sendConfig);


    const sendTxId = await SLP.TokenType1.send(sendConfig)

    console.log('sendTxId: ', sendTxId);

    console.log('\nView this transaction on the block explorer:')
    if (NETWORK === 'mainnet') {
      console.log('https://explorer.bitcoin.com/bch/tx/'+sendTxId);
     // res.send('https://explorer.bitcoin.com/bch/tx/'+sendTxId);
    }
    else console.log('https://explorer.bitcoin.com/tbch/tx/'+sendTxId)


  });

  //after we finish going thru all objs in array
  console.log('Done');
}
start();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


//res.send('test done');


  //send payment using details from Array
// dividendPayoutsSLP.forEach(async function (balance) {

// try{



//   //sendPOSpayout();

//   console.log('balance ', balance);
// //  console.log(balance.slp);
// //  console.log(balance.nextPOSpayout);

//   let tokenReceiverAddress = balance.address;

//   //console.log('tokenReceiverAddress ', tokenReceiverAddress);

//     // set up send config for send
//       var sendConfig = {
//       fundingAddress,
//       fundingWif,
//       tokenReceiverAddress,
//       bchChangeReceiverAddress,
//       tokenId: SOURid,
//       amount: balance.POSpayout
//     }

//     console.log('sendConfig ', sendConfig);

//     // SEND EACH PAYMENT \\
//       //console.log(`createConfig: ${util.inspect(createConfig)}`)

//     // Generate, sign, and broadcast a hex-encoded transaction for sending
//     // the tokens.
    
//     sendPOSpayout(sendConfig)


// }catch(error){
//   console.error(error);
// }


// })

// }else{

//   res.send('You are not authorized, mothafucka.')
// }
}


// GET POS SOUR BALANCES > 400 SOUR \\ GET ALL SOUR BALANCE \\ GET BCH AIRDROP BALANCES with payout > .00005 BCH.

function getAllSOURbalances(socket, res){

  let minBCHpayout = .00005;
  let SOURbalances = new Array();
  let dividendPayoutsBCH = new Array();
  let dividendPayoutsSLP = new Array();
  let dividendlengthBCH = 0;
  let dividendlengthSLP = 0;
  let sourtoshiBal = 0;
  let totalSOUR = 0;
  let index1 = 0;
  let totalSOURpayoutAddedup = 0;

  (async () => {
  try {
    let balances = await SLP.Utils.balancesForToken(
      SOURid
    )
   // console.log('SOUR BALANCES: ', balances);


balances.forEach((balance) => {
      let slp = balance.slpAddress;
      let bal = parseInt(balance.tokenBalanceString);
 //   let percent = (bal / 42000000).toFixed(16);

   if((slp === 'simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g') || (slp === 'simpleledger:qzlq5chhphjzu3gl6qs4fx4sgevv0cqfzyucvyy2aa') || (slp === 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk') || (slp === 'simpleledger:qrkxepw4ckmt5zrp784lrrkr69kwrn90cyvjwwfqx2')){

      console.log('removing ' + slp);

      sourtoshiBal = sourtoshiBal + bal;
      
      balances.splice(index1, 1);

    }else{

      totalSOUR = totalSOUR + bal;
    }

index1++;
})
  
  let sourBurned = ((42000000 - sourtoshiBal) - totalSOUR);

  console.log('SOURTOSHI BAL: '+ numberWithCommas(sourtoshiBal));
  console.log('TOTAL SOUR IN CIRCULATION: '+ numberWithCommas(totalSOUR));
  console.log('TOTAL SOUR BURNED: '+ numberWithCommas(sourBurned));

 //  setTimeout(function(){console.log('pausing 2 sec to remove sourtoshi addresses')},500);

     // go through each object in balances to splice out SOURtoshi addresses & add them up to determine sour in circulation, etc.
     balances.forEach((balance) => {

      let slp = balance.slpAddress;
      let bal = Number(balance.tokenBalanceString);
      let percent = (bal / totalSOUR);
      //.toFixed(8)

      let totalSOURPayout = 10000;

      let nextPOSpayout = Number((totalSOURPayout * percent).toFixed(8));

      // SOURtoshi addresses //

      // bitcoincash:qzlq5chhphjzu3gl6qs4fx4sgevv0cqfzysr8l32rr - memo , bitcoincash:qqs74sypnfjzkxeq0ltqnt76v5za02amfgg7frk99g - faucet, simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g - mobile badger
      // simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g
      // simpleledger:qzlq5chhphjzu3gl6qs4fx4sgevv0cqfzyucvyy2aa
      // simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk


    // remove SOURtoshi & dev addresses //

    // if(slp === 'simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g'){
    //   console.log(slp);
    // }

    if((slp === 'simpleledger:qpvfjghxe8w5p75yg07d6mmst0mewrt08ygmjm5z5g') || (slp === 'simpleledger:qzlq5chhphjzu3gl6qs4fx4sgevv0cqfzyucvyy2aa') || (slp === 'simpleledger:qqs74sypnfjzkxeq0ltqnt76v5za02amfgy9zcr9mk')){

      console.log(slp);

     // sourtoshiBal = 
    

    }else{

      // Determine BCH payouts, build lists for SLP payout, BCH payout & all balances in general. //
      if(percent > minBCHpayout){
        dividendPayoutsBCH.push({
        'address' : slp,
        'balance' : bal,
        'percent' : percent
        })

       dividendlengthBCH++
      }


      if(bal > 400){
        dividendPayoutsSLP.push({
        'address' : slp,
        'balance' : bal,
        'percent' : percent,
        'POSpayout': nextPOSpayout
        })

        dividendlengthSLP++
      }

      SOURbalances.push({
        'address' : slp,
        'balance' : bal,
        'percent' : percent,
        'POSpayout': nextPOSpayout
      })
    }
  })
    
  
    console.log('Addresses to receive BCH payout = ' + dividendlengthBCH);
    console.log('Addresses to receive SLP payout = ' + dividendlengthSLP);

    // console.log(dividendPayouts);


    SOURbalances.forEach((balance) => {


    totalSOURpayoutAddedup += Number(balance.POSpayout);

    })
  
    console.log('Total SOUR Payout to all holders is... '+totalSOURpayoutAddedup);

   //res.set('SOURbalances': dividendPayoutsSLP);


  //  res.sendFile(__dirname + '/balances.html');

   res.send(dividendPayoutsSLP);

  } catch (error) {
    console.error(error)
  }
})()

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


 //   let circSupply = parseInt(res.t[0].tokenStats.qty_token_circulating_supply);
 //   let burned = parseInt(res.t[0].tokenStats.qty_token_burned);


  //  console.log('circulating supply - ', res.t[0].tokenStats.qty_token_circulating_supply);
  //  console.log('token burned - ', res.t[0].tokenStats.qty_token_burned);

 //  let totalCirculatingSupply = res.t[0].tokenStats.qty_token_circulating_supply + res.t[0].tokenStats.qty_token_burned;

 //  console.log('totalCirculatingSupply ', totalCirculatingSupply);

 //console.log(res.t[0]);
 //console.log(res.t[0].tokenStats);

 //console.log(res.t[0].tokenDetails);

     socket.emit('chat message', 'ID: ' + res.t[0].tokenDetails.tokenIdHex);
     socket.emit('chat message', 'Symbol: ' + res.t[0].tokenDetails.symbol);
     socket.emit('chat message', 'Name: ' + res.t[0].tokenDetails.name);
     socket.emit('chat message', 'Decimals: ' + res.t[0].tokenDetails.decimals);
     socket.emit('chat message', 'Version Type: ' + res.t[0].tokenDetails.versionType);
     socket.emit('chat message', 'Contains Baton: ' + res.t[0].tokenDetails.containsBaton);
     socket.emit('chat message', 'Block Created: ' + numberWithCommas(res.t[0].tokenStats.block_created));
     socket.emit('chat message', 'Timestamp: ' + res.t[0].tokenDetails.timestamp);

     socket.emit('chat message', 'Document URI: ' + res.t[0].tokenDetails.documentUri);

  //   socket.emit('chat message', 'Block Last Active Send: ' + numberWithCommas(res.t[0].tokenStats.block_last_active_send));
    socket.emit('chat message', 'Txns Since Genesis: ' + numberWithCommas(res.t[0].tokenStats.approx_txns_since_genesis));
  //   socket.emit('chat message', 'Valid SOUR Addresses: ' + numberWithCommas(res.t[0].tokenStats.qty_valid_token_addresses));
     socket.emit('chat message', 'Total Token Qty: ' + numberWithCommas(res.t[0].tokenDetails.genesisOrMintQuantity) + ' SOUR');
   // socket.emit('chat message', 'Total SOUR burned: ' + numberWithCommasPeriod(res.t[0].tokenStats.qty_token_burned) + ' SOUR');
  //  console.log(res.t[0].tokenStats.qty_token_circulating_supply - res.t[0].tokenStats.qty_token_burned);
   //  socket.emit('chat message', 'Circulating Supply: ' + numberWithCommasPeriod(circulatingSupply) + ' SOUR');
  //   socket.emit('chat message', 'Satoshis locked up: ' + numberWithCommas(res.t[0].tokenStats.qty_satoshis_locked_up) + ' Sats');


   })();

}


function hitSlpUtilforSOUR(socket) {

  (async () => {
  try {
    let list = await SLP.Utils.list(SOURid);
    console.log(list);
    //do things

     socket.emit('chat message', 'ID: ' + list.id);
     socket.emit('chat message', 'Symbol: ' + list.symbol);
     socket.emit('chat message', 'Name: ' + list.name);
     socket.emit('chat message', 'Decimals: ' + list.decimals);
     socket.emit('chat message', 'Version Type: ' + list.versionType);
     socket.emit('chat message', 'Contains Minting Baton: ' + list.containsBaton + ', ' + list.mintingBatonStatus);
     socket.emit('chat message', 'Block Created: ' + numberWithCommas(list.block_created));
     socket.emit('chat message', 'Timestamp: ' + list.timestamp);
     socket.emit('chat message', 'Document URI: ' + list.documentUri);
     socket.emit('chat message', 'Block Last Active Send: ' + numberWithCommas(list.lastActiveSend));
     socket.emit('chat message', 'Txns Since Genesis: ' + numberWithCommas(list.txnsSinceGenesis));
     socket.emit('chat message', 'Total Token Qty: ' + numberWithCommas(list.quantity) + ' SOUR');
   if(list.totalBurned > 0){
        socket.emit('chat message', 'Total SOUR burned: ' + numberWithCommasPeriod(list.totalBurned) + ' SOUR');
   }

   socket.emit('chat message', 'Satoshis locked up: ' + numberWithCommas(list.satoshisLockedUp) + ' Sats');
   socket.emit('chat message', 'Valid Address: ' + numberWithCommas(list.validAddresses));


  } catch (error) {
    console.error(error);
  }
})();

}

function hitSLPDBforSOUR(query, socket) {

try {

 // (async () => {

   // console.log("query forSOUR", query);


    // usual main call
   // let res = await SLP.SLPDB.get(query);


    // API call
 // var url = 'https://slpserve.imaginary.cash/q/ewogICJ2IjogMywKICAicSI6IHsKICAgICJmaW5kIjogeyJzbHAuZGV0YWlsLnRva2VuSWRIZXgiIDogIjY0NDgzODFmOTY0OWVjYWNkOGMzMDE4OWNmYmZlZTcxYTkxYjZiOTczOGVhNDk0ZmUzM2Y4YjhiNTFjYmZjYTAifSwKICAgICJsaW1pdCI6IDEwMAogIH0KfQ==';
var url = 'https://nyc1.slpdb.io/q/ewogICAgInYiOiAzLAogICAgInEiOiB7CiAgICAgICJmaW5kIjogeyJzbHAuZGV0YWlsLnRva2VuSWRIZXgiIDogIjY0NDgzODFmOTY0OWVjYWNkOGMzMDE4OWNmYmZlZTcxYTkxYjZiOTczOGVhNDk0ZmUzM2Y4YjhiNTFjYmZjYTAifSwKICAgICAgImxpbWl0IjogMTAwCiAgICB9Cn0='; 
 request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var res = JSON.parse(body)
  //    console.log(res);





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


// BEGIN LATEST CONFIRMED TX

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


 // })();

    }
})

}catch(error){
console.log(error);
}

 //end fucntion
}


let latestTokenPrices = {
  version: 1,
  data: {
      SPICE: {
      price_usd: 0.0005
    },
    SOUR: {
      price_usd: .004
    }
  }
  }

var spiceprice = 0;


// GET BALANCES

app.get('/balances', function (req, res){

getAllSOURbalances(socket, res)


})

app.get('/api', function (req, res){

  var url = 'https://slpdb.electroncash.de/q/ewogICJ2IjogMywKICAicSI6IHsKICAgICJmaW5kIjogeyJzbHAuZGV0YWlsLnRva2VuSWRIZXgiIDogIjY0NDgzODFmOTY0OWVjYWNkOGMzMDE4OWNmYmZlZTcxYTkxYjZiOTczOGVhNDk0ZmUzM2Y4YjhiNTFjYmZjYTAifSwKICAgICJsaW1pdCI6IDEwCiAgfQp9';

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      console.log(info);
    }
})

})


// PAYOUT POS PAYMENTS
app.get('/pos-payment', function(req, res){

payoutProofOfSOUR(res);

})



app.get('/get', function (req, res){

// hit API to get live spice price...
var url = 'https://api.coinex.com/v1/market/deals?market=spicebch';

request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, obj) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is already parsed as JSON:
    //  console.log('DATA ==========> ', obj);
     // console.log('DATA PRICE ========> ', data[0]);
     //console.log(typeof obj);
   // let obj = JSON.parse(data);
   let x = 0;

    obj.data.forEach(sale => {

      if (x == 0){
       // console.log(sale.price);

       let bchUsd = 220;
        spicePrice = sale.price;
        console.log('NEW SPICE PRICE SET @ $' + spicePrice);


      latestTokenPrices.data.SPICE.price_usd = Number(spicePrice * bchUsd).toFixed(5);

       //console.log('SPICE PRICE: $' + latestTokenPrices.data.SPICE.price_usd);
       //console.log('SOUR PRICE: $' + latestTokenPrices.data.SOUR.price_usd);

      
        
      }else{
        return;
      }

      

      x++;
})
  //  console.log(obj);
   // console.log(obj[0].price);

    //end else
    }



})

   // console.log('spicePrice ======>' +  spicePrice);

 //  res.send(latestTokenPrices);
  
  // return API response.

  res.setHeader('Content-Type', 'application/json; charset=UTF-8')
  res.send(latestTokenPrices);
 // setTimeout(res.send(latestTokenPrices), 2000);
 // res.send(latestTokenPrices);
    
});


app.get('/test', function(req,res){

//res.render('index', {});


})



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
 // hitSlpUtilforSOUR(socket);


  // GET PRICE
  getSOURprice(socket);



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

const SOURid = '6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0';

const querylatestSOURmemoSale = {
  "v": 3,
  "q": {
    "find": {
      "out.h1": "534c5000",
      "out.h4": "6448381f9649ecacd8c30189cfbfee71a91b6b9738ea494fe33f8b8b51cbfca0"
    },
    "limit": 100
  }
}


// app.get('/price', function (req, res) {

 function getSOURprice(socket){ 
//if (it has an output 2 - then it is a sale.)
// input[0] is amount paid for SOUR 

// output[2] is amount of SOUR bought

// memo cash protocol - https://memo.cash/protocol
// https://github.com/memocash/mips/blob/master/mip-0009/mip-0009.md#specification

// bitdb docs - https://docs.fountainhead.cash/docs/indexer


// A Genesis SLP transaction.


    const queryConfSour = {
    "v": 3,
    "q": {
      "db": ["c"],
      "find": {
        "slp.detail.tokenIdHex" : SOURid
              }
         }
    }

// "out.e.a" : depositAddress,
 // let SLPSDK = require('slp-sdk')
 // let SLP = new SLPSDK()

  // USUAL CALL USING SLPDB BUT FUCK THAT SHIT
   // let txs = await SLP.SLPDB.get(querylatestSOURmemoSale)



  var url = 'https://slpserve.imaginary.cash/q/ewogICJ2IjogMywKICAicSI6IHsKICAgICJmaW5kIjogewogICAgICAib3V0LmgxIjogIjUzNGM1MDAwIiwKICAgICAgIm91dC5oNCI6ICI2NDQ4MzgxZjk2NDllY2FjZDhjMzAxODljZmJmZWU3MWE5MWI2Yjk3MzhlYTQ5NGZlMzNmOGI4YjUxY2JmY2EwIgogICAgfSwKICAgICJsaW1pdCI6IDEwMAogIH0KfQ==';
  request(url, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var txs = JSON.parse(body)
//      console.log(info);


  //console.log(res)

  if(txs){



   for(var i = 0; i < 100 ;i++){ 
          //  console.log(i);
       //     console.log(JSON.stringify(txs.c[i]));

   try {

    // example of SOUR sale: 
    // https://explorer.bitcoin.com/bch/tx/88a822281bbbc019dd4680ff9c34912824821b6b693914703d864b1b62567daf

//    const txid = txs.c[i].tx.h;

   // console.log('SOUR TX FOUND');

    let str = txs.c[i].out[0].str;


  //  console.log(str);

   // console.log('------------------------------------');
  //  console.log(txs.c[i]);


    let inputLength = txs.c[i].in.length;
  //  console.log('inputLength ' + inputLength);

    let outputLength = txs.c[i].out.length;
  //  console.log('outputLength ' + outputLength);

    // (inputLength == 2) && 
    if((outputLength == 5)){
        let BCHpaid = txs.c[i].out[1].e.v;
        let SOURsold = txs.c[i].slp.detail.outputs[1].amount;
        let pricePerSOUR = (BCHpaid / SOURsold);

    //    console.log('AMOUNT OF BCH PAID: ' + BCHpaid);
      //  console.log('AMOUNT OF SOUR SOLD: ' + SOURsold);

        let SOUR = {
            'sats': pricePerSOUR+ ' Satoshis',
            'bch': (pricePerSOUR / 100000000).toFixed(8)+' BCH',
            'SOURsold': SOURsold+' SOUR' 
        }

        let usd = await bitbox.Price.current('usd');

       // console.log(usd);

        usd = usd / 100;

        let priceInSats = numberWithCommas(pricePerSOUR.toFixed(2));

      //  console.log (usd);
        let SOURusd = (pricePerSOUR / 100000000) * usd;
      //  console.log(SOURusd.toFixed(4));

        socket.emit('chat message', '*SOUR Price on Memo DEX: '+ SOUR.bch + ' ('+ priceInSats +' Satoshis), $'+ SOURusd.toFixed(5));

       // res.send(SOUR);
       // res.send('AMOUNT OF BCH PAID: ' + BCHpaid + ' & AMOUNT OF SOUR SOLD: ' + SOURsold + '.... Price per SOUR: ' + pricePerSOUR + ' BCH Satoshis');


        i=100;

    }else{
        i++;
    }
    
  } catch (error) {
    console.error(error)
  }

    }



  }

  //console.log(res.t[0])

  // returns
  //
  // { _id: '5d43635f4760895f2a312f71',
  // schema_version: 71,
  // lastUpdatedBlock: 593917,
  // tokenDetails:
  //  { decimals: 0,
  //    tokenIdHex:
  //     'c586b4339dfe5f4c3b508a0c6db2531c64ff091065dc47c885291cad6aefbd45',
  //    timestamp: '2019-08-01 21:23:58',
  //    timestamp_unix: 1564694638,
  //    transactionType: 'GENESIS',
  //    versionType: 129,
  //    documentUri: '',
  //    documentSha256Hex: null,
  //    symbol: '',
  //    name: '',
  //    batonVout: null,
  //    containsBaton: false,
  //    genesisOrMintQuantity: '1',
  //    sendOutputs: null },
  // mintBatonUtxo: '',
  // tokenStats:
  //  { block_created: 593918,
  //    block_last_active_send: null,
  //    block_last_active_mint: null,
  //    qty_valid_txns_since_genesis: 1,
  //    qty_valid_token_utxos: 0,
  //    qty_valid_token_addresses: 0,
  //    qty_token_minted: '1',
  //    qty_token_burned: '1',
  //    qty_token_circulating_supply: '0',
  //    qty_satoshis_locked_up: 0,
  //    minting_baton_status: 'NEVER_CREATED' } }

    }
})


//this works. 
// slpData.spendData. (spendData is the token sale (the one that isn't 0 is the # of tokens sold))
// then I think I'll need to use that same txid to look up the BCH info for the total amount paid, 
// then divide that by the # of tokens sold and booyakasha you have the price...

}
// })


async function getBCHusd(){
 (async () => {
  let usd = await bitbox.Price.current('usd');
  return usd;
  })()
}

http.listen(port, function(){
  console.log('BOOTING UP....')
  console.log('listening on *:' + port);
});

import Web3 from 'web3'
import ItemManager from '../../build/contracts/ItemManager.json'
import Item from '../../build/contracts/Item.json'

const App = {
  start: async function () {
    const web3 = window.httpWeb3
    // const wsWeb3 = window.wsWeb3;
    try {
      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      this.itemManager = new web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] &&
          ItemManager.networks[networkId].address
      )
      // this.wsitemManager = new wsWeb3.eth.Contract(
      //   ItemManager.abi,
      //   ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
      // );
      this.item = new web3.eth.Contract(
        Item.abi,
        Item.networks[this.networkId] && Item.networks[this.networkId].address
      )

      // get accounts
      this.accounts = await web3.eth.getAccounts()
     

    } catch (error) {
      console.error('Could not connect to contract or chain.')
    }
  },

  handlesubmit: async function () {
    const amount = parseInt(document.getElementById('amount').value)
    const product = document.getElementById('product').value
    console.log(product, amount, this.itemManager)
    let result = await this.itemManager.methods
      .createItem(product, amount)
      .send({ from: this.accounts[0] })
       console.log(this.accounts[0])
    let itemNM, _price
    let itemArr = []
    itemNM = result.events.SupplyChainStep.returnValues.itemName
    _price = result.events.SupplyChainStep.returnValues.price
    console.log('Create item event submitted', result)
    console.log(itemNM, _price, itemArr)

    itemArr.push({ itemName: itemNM, Price: _price })

    console.log('array', itemArr)
    console.log(itemArr[0]['itemName'])
    console.log(itemArr[0]['Price'])

    for (var i = 0; i < itemArr.length; i++) {
      var tablebody = document.getElementById('candidate-rows')
      var tr = document.createElement('TR')
      var td = document.createElement('TD')
      var td1 = document.createElement('TD')
      var td2 = document.createElement('TD')

      td.width = '75'
      td.appendChild(document.createTextNode(itemArr[i]['Price']))
      td1.appendChild(document.createTextNode(itemArr[i]['itemName']))
      var button = document.createElement('button')
      button.innerHTML = 'Transfer'
      button.onclick = this.transferuser   
      td2.appendChild(button)
      tr.appendChild(td)
      tr.appendChild(td1)
      tr.appendChild(td2)

      tablebody.appendChild(tr)
    }
  },

  transferuser: function () {
    console.log('hello')
  },

  loaddata: function(){
   this.itemManager.methods.getItemList().call({from : this.accounts[0]}).then(console.log);
  }
}

window.App = App

window.addEventListener('load', async function () {
  if (window.ethereum) {
    console.log('In ethereum')
    const web3 = new Web3(window.ethereum)
    try {
      // Request account access if needed
      await window.ethereum.enable()
      // Acccounts now exposed

      window.httpWeb3 = web3
    } catch (error) {
      reject(error)
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3
    console.log('Injected web3 detected.')
    //  resolve(web3);
    window.httpWeb3 = web3
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8000')
    const web3 = new Web3(provider)
    console.log('No web3 instance injected, using Local web3.')
    // resolve(web3);
    window.httpWeb3 = web3
  }
  const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8001')
  window.wsWeb3 = new Web3(provider)

  App.start()
})

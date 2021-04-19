import Web3 from 'web3'
import ItemManager from '../../build/contracts/ItemManager.json'
// import Item from '../../build/contracts/Item.json'

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
          ItemManager.networks[networkId].address,
      )
      // this.wsitemManager = new wsWeb3.eth.Contract(
      //   ItemManager.abi,
      //   ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
      // // );
      // this.item = new web3.eth.Contract(
      //   Item.abi,
      //   Item.networks[this.networkId] && Item.networks[this.networkId].address
      // )

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
     
      this.loaddata();
  },

  loaddata: async function () {
    let inventory = await this.itemManager.methods
      .getItemList()
      .call({ from: this.accounts[0] })
    // console.log(inventory[0]._itemName);
    // console.log(inventory[0]._priceInWei);
    console.log(inventory)
    // console.log(inventory.length)
    var tablebody = document.getElementById('candidate-rows')
    tablebody.innerHTML = ''
    for (var i = 0; i < inventory.length; i++) {
      var tr = document.createElement('TR')
      var td = document.createElement('TD')
      var td1 = document.createElement('TD')
      var td2 = document.createElement('TD')

      td.width = '33'
      td1.width = '33'
      td2.width = '33'
        
      td.appendChild(document.createTextNode(inventory[i]._priceInWei))
      td1.appendChild(document.createTextNode(inventory[i]._itemName))
      var button = document.createElement('button')
      button.innerHTML = 'Add'
      button.onclick = this.AddtoMarketPlace(
        inventory[i]._index,
        inventory[i]._owner
      )
      td2.appendChild(button)
      tr.appendChild(td)
      tr.appendChild(td1)
      tr.appendChild(td2)
      tablebody.appendChild(tr)
    }
  },

  AddtoMarketPlace: function (_index, _owner) {
    console.log('hello')
    let self = this

    return async function () {
    
      console.log(_owner,"owner");
      console.log(_index,"index");
      // console.log(self.itemManager)
      let marketPlace = await self.itemManager.methods
        .addTomarketPlace(_index, _owner)
        .send({ from: self.accounts[0] })
          self.loaddata();
      self.getMarketplaceList();
    }
  },

  getMarketplaceList: async function () {
    console.log('hi')

    let results = await this.itemManager.methods
      .marketPlaceList()
      .call({ from: this.accounts[0] })

      console.log(results)

      let tablebody = document.getElementById('marketplace-rows')
      tablebody.innerHTML = ''
      for(var i=0;i<results.length;i++)
      {
        let tr = document.createElement('TR')
        let td = document.createElement('TD')
        let td1 = document.createElement('TD')
        let td2 = document.createElement('TD')

        td.width = '33'
        td1.width = '33'
        td2.width = '33'
        let account = this.accounts[0]
        td.appendChild(document.createTextNode(results[i]._priceInWei))
        td1.appendChild(document.createTextNode(results[i]._itemName))
        let button = document.createElement('button')
        button.innerHTML = 'Purchase'
       if (account === results[i]._owner){
         button.disabled = true;
       }
       else
       {
        button.onclick = this.purchase(
          results[i]._index,
          results[i]._owner,
          results[i]._priceInWei
        );
        }
        td2.appendChild(button)
        tr.appendChild(td)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tablebody.appendChild(tr)
      }
  },

  purchase:function(_index,_owner,price){
      let self=this;
      return async function(){
        console.log(_index,"_index")
        console.log(_owner,"_owner")
        console.log(price)
        let result = await self.itemManager.methods
      .purchaseItem(_index,_owner)
      .send({ from: self.accounts[0] ,value:1000000000000000000000000000})

      console.log(result)

      
      }
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

import axios from 'axios';

class ChargeWorkflow {
  //   baseUrl = 'http://df2.localhost:8080/v1';
  baseUrl = 'http://central-rest.csms.deepfleet.com/v1';
  token: string;
  chargingStationId: string;
  connectorId: number = 2;
  //   txnId: string = '103149113';
  txnId: string;

  public async doLogin(email: string, password: string) {
    let url = `${this.baseUrl}/auth/signin`;
    let dataIn = {
      email: email,
      password: password,
      acceptEula: true,
      tenant: 'df1.csms',
    };
    const { data, status } = await axios.post(url, dataIn, {
      headers: {
        Accept: 'application/json',
      },
    });
    console.log(`Login Token ${data.token}`);
    this.token = data.token;
  }
  public async getChargers() {
    let url = `${this.baseUrl}/api/charging-stations?Limit=100`;
    const { data, status } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (data.result) {
      for (let chargePoint of data.result) {
        console.log(`Vendor -> ${chargePoint.chargePointVendor}`);
        console.log(`Charge Point ID -> ${chargePoint.id}`);
      }
    } else {
      console.log('No charging station found');
    }
  }

  public async startCharging() {
    let url = `${this.baseUrl}/api/transactions/start`;
    this.chargingStationId = 'CS-ABB-00001';
    let dataIn = {
      chargingStationID: this.chargingStationId,
      args: {
        tagID: 'GG1027573378',
        visualTagID: '6296444742b63ed45473f8c4',
        connectorId: this.connectorId,
      },
    };
    console.log(`Starting charging on ${this.chargingStationId}`);
    const { data, status } = await axios.put(url, dataIn, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (data.status) {
      console.log(`Status of Txn ${data.status}`);
    } else {
      console.log('Starting charging failed');
    }
  }
  public async getTxnIdFromCharger() {
    let url = `${this.baseUrl}/api/charging-stations/${this.chargingStationId}?ProjectFields=`;

    const { data, status } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (data.connectors) {
      for (let connector of data.connectors) {
        if (connector.connectorId === this.connectorId) {
          this.txnId = connector.currentTransactionID;
          break;
        }
      }
      if (this.txnId) {
        console.log(`Txn Id -> ${this.txnId}`);
      }
    } else {
      console.log('Finding charger details failed.');
    }
  }
  public async getTxnDetails() {
    let url = `${this.baseUrl}/api/transactions/${this.txnId}?WithCar=true&WithUser=true&WithTag=true`;

    const { data, status } = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (data.chargeBoxID && data.userID) {
      console.log(`Charging  in Charger ${data.chargeBoxID}`);
    } else {
      console.log('Finding charger details failed.');
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async stopTxn() {
    console.log(`Going to wait for 10s before stopping`);
    await this.delay(5000);
    let url = `${this.baseUrl}/api/transactions/${this.txnId}/stop`;
    try {
      const { data, status } = await axios.put(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });
      console.log(`Status -> ${status}`);
      if (data.status) {
        console.log(`Status of Stop Txn ${data.status}`);
      } else {
        console.log('Finding charger details failed.');
      }
    } catch (e) {
      //   console.error(e);
    }
  }
  public async executeWorkflow() {
    // User Login
    console.log('##############################################');
    console.log('USER LOGIN');
    await this.doLogin('abc.def@deepfleet.com', 'Password123@');
    console.log('##############################################');
    //Get all chargers
    console.log('FIND CHARGERS');
    console.log('##############################################');
    await this.getChargers();
    console.log('##############################################');
    // Start transaction
    console.log('##############################################');
    console.log('START TXN');
    await this.startCharging();
    console.log('##############################################');
    //Txn consumption
    console.log('##############################################');
    console.log('TXN DETAILS');
    await this.getTxnIdFromCharger();
    await this.getTxnDetails();
    console.log('##############################################');
    //Stop txn
    console.log('##############################################');
    console.log('STOPPING TXN');
    await this.stopTxn();
    console.log('##############################################');
  }
}

const chargerFlow = new ChargeWorkflow();
chargerFlow.executeWorkflow();

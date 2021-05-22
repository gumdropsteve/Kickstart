import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "0xfb312389AFaB26A65ea8436EcA2eE796fAbC52a5" // addresss of already deployed factory
);

export default instance;
